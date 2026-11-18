from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

from backend.app.database import db_manager
from backend.app.models.review import (
    ReviewRequest,
    ReviewResponse,
)
from backend.app.services.b1_evaluator import evaluate_b1

router = APIRouter(prefix="/api/reviews", tags=["AI B1 Reviews"])

@router.post("/evaluate", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def request_review(payload: ReviewRequest):
    if len(payload.content.strip()) < 15:
        raise HTTPException(status_code=400, detail="Content must contain at least 15 characters to evaluate.")

    review = await evaluate_b1(
        content=payload.content,
        title=payload.title or "Untitled Piece",
        category=payload.category or "stories",
        writing_id=payload.writing_id,
        target_level=payload.target_level or "B1"
    )

    # Save to reviews collection in MongoDB
    coll = db_manager.get_collection("reviews")
    review_dict = review.model_dump()
    await coll.insert_one(review_dict)

    # If writing_id was provided, update writing metadata without unpublishing
    if payload.writing_id:
        w_coll = db_manager.get_collection("writings")
        existing = await w_coll.find_one({"$or": [{"id": payload.writing_id}, {"_id": payload.writing_id}]})
        if existing:
            update_data = {
                "level": review.estimated_level.split()[0],
                "updated_at": datetime.utcnow()
            }
            # Only set to in_review if it was currently a draft; never unpublish published work
            if existing.get("status") == "draft":
                update_data["status"] = "in_review"
            await w_coll.update_one(
                {"$or": [{"id": payload.writing_id}, {"_id": payload.writing_id}]},
                {"$set": update_data}
            )

    return review

@router.get("/history", response_model=List[ReviewResponse])
async def get_review_history(
    writing_id: Optional[str] = Query(None, description="Filter by writing ID"),
    limit: int = Query(30, ge=1, le=100)
):
    coll = db_manager.get_collection("reviews")
    query = {}
    if writing_id:
        query["writing_id"] = writing_id

    cursor = coll.find(query).sort("created_at", -1).limit(limit)
    items = await cursor.to_list(length=limit)
    
    results = []
    for doc in items:
        doc["id"] = doc.get("id") or str(doc.get("_id"))
        results.append(ReviewResponse(**doc))
    return results

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_single_review(review_id: str):
    coll = db_manager.get_collection("reviews")
    doc = await coll.find_one({"$or": [{"id": review_id}, {"_id": review_id}]})
    if not doc:
        raise HTTPException(status_code=404, detail="Review not found")
    doc["id"] = doc.get("id") or str(doc.get("_id"))
    return ReviewResponse(**doc)

@router.delete("/{review_id}")
async def delete_review(review_id: str):
    coll = db_manager.get_collection("reviews")
    res = await coll.delete_one({"$or": [{"id": review_id}, {"_id": review_id}]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted", "id": review_id}
