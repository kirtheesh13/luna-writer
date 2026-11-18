import math
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, status

from backend.app.database import db_manager
from backend.app.models.writing import (
    WritingItem,
    WritingCreate,
    WritingUpdate,
)

router = APIRouter(prefix="/api/writings", tags=["Writings"])

def calculate_reading_time(word_count: int) -> int:
    # Standard average reading speed: ~170 words per minute for B1 learners
    return max(1, math.ceil(word_count / 170))

@router.get("", response_model=List[WritingItem])
async def list_writings(
    category: Optional[str] = Query(None, description="Category filter: stories, letters, articles, emails"),
    level: Optional[str] = Query(None, description="Level filter: A2, B1, B2"),
    length: Optional[str] = Query(None, description="Length filter: short (<300), medium (300-600), long (>600)"),
    topic: Optional[str] = Query(None, description="Topic/tag filter"),
    search: Optional[str] = Query(None, description="Search keyword in title, description, or content"),
    status: Optional[str] = Query(None, description="draft, published, in_review"),
    visibility: Optional[str] = Query(None, description="private, public"),
    only_user: Optional[bool] = Query(False, description="Filter for user-created pieces only (exclude samples)"),
    sort_by: Optional[str] = Query("recent", description="recent, title, reading_time")
):
    query = {}
    if category:
        query["category"] = category.lower()
    if level:
        query["level"] = level.upper()
    if status:
        st = status.lower()
        if st == "draft":
            query["status"] = {"$in": ["draft", "in_review"]}
        elif st == "published":
            query["$or"] = [{"status": "published"}, {"visibility": "public"}]
        else:
            query["status"] = st
    if visibility:
        query["visibility"] = visibility.lower()
    if only_user:
        query["is_sample"] = False

    if topic and topic.lower() != "all":
        query["$or"] = [
            {"topic": {"$regex": topic, "$options": "i"}},
            {"tags": {"$in": [topic]}}
        ]

    if search:
        search_term = search.strip()
        search_filter = [
            {"title": {"$regex": search_term, "$options": "i"}},
            {"description": {"$regex": search_term, "$options": "i"}},
            {"content": {"$regex": search_term, "$options": "i"}},
            {"author_name": {"$regex": search_term, "$options": "i"}}
        ]
        if "$or" in query:
            query["$and"] = [{"$or": query.pop("$or")}, {"$or": search_filter}]
        else:
            query["$or"] = search_filter

    coll = db_manager.get_collection("writings")
    cursor = coll.find(query)

    # Sort
    if sort_by == "title":
        cursor.sort("title", 1)
    elif sort_by == "reading_time":
        cursor.sort("reading_time_minutes", 1)
    else:
        cursor.sort("created_at", -1)

    items = await cursor.to_list(length=100)

    # Post-filter for length if requested
    filtered_items = []
    for item in items:
        wc = item.get("word_count", len(item.get("content", "").split()))
        if length == "short" and wc >= 300:
            continue
        if length == "medium" and (wc < 300 or wc > 600):
            continue
        if length == "long" and wc <= 600:
            continue
        filtered_items.append(item)

    # Determine bookmark status for each item
    bm_coll = db_manager.get_collection("bookmarks")
    user_bookmarks = await bm_coll.find({}).to_list(length=200)
    bookmarked_ids = {b.get("writing_id") for b in user_bookmarks}

    results = []
    for doc in filtered_items:
        doc_id = doc.get("id") or str(doc.get("_id"))
        doc["id"] = doc_id
        doc["is_bookmarked"] = (doc_id in bookmarked_ids)
        results.append(WritingItem(**doc))

    return results

@router.get("/stats/categories")
async def get_category_stats():
    coll = db_manager.get_collection("writings")
    categories = ["stories", "letters", "articles", "emails"]
    stats = {}

    descriptions = {
        "stories": "Engaging narratives, personal experiences, and creative journeys written in accessible English.",
        "letters": "Formal and semi-formal correspondence, letters of complaint, gratitude, and inquiry.",
        "articles": "Informative pieces on lifestyle, education, environmental habits, and technology.",
        "emails": "Authentic everyday emails for workplace communication, community events, and social plans."
    }

    for cat in categories:
        count = await coll.count_documents({"category": cat})
        sample_cursor = coll.find({"category": cat})
        docs = await sample_cursor.to_list(length=50)
        topics = set()
        for d in docs:
            if d.get("topic"):
                topics.add(d["topic"])
            for t in d.get("tags", []):
                topics.add(t)

        stats[cat] = {
            "name": cat.capitalize(),
            "count": count,
            "description": descriptions.get(cat, ""),
            "topics": sorted(list(topics))[:8]
        }

    return stats

@router.get("/{writing_id}", response_model=WritingItem)
async def get_writing(writing_id: str):
    coll = db_manager.get_collection("writings")
    doc = await coll.find_one({"$or": [{"id": writing_id}, {"_id": writing_id}]})
    if not doc:
        raise HTTPException(status_code=404, detail="Writing not found")

    doc["id"] = doc.get("id") or str(doc.get("_id"))

    # Check bookmark
    bm_coll = db_manager.get_collection("bookmarks")
    bm = await bm_coll.find_one({"writing_id": doc["id"]})
    doc["is_bookmarked"] = (bm is not None)

    return WritingItem(**doc)

@router.post("", response_model=WritingItem, status_code=status.HTTP_201_CREATED)
async def create_writing(payload: WritingCreate):
    words = len(payload.content.split())
    doc = payload.model_dump()
    doc["id"] = f"w-{uuid.uuid4().hex[:8]}"
    doc["word_count"] = words
    doc["reading_time_minutes"] = calculate_reading_time(words)
    doc["is_sample"] = False
    doc["is_bookmarked"] = False
    doc["created_at"] = datetime.utcnow()
    doc["updated_at"] = datetime.utcnow()

    coll = db_manager.get_collection("writings")
    await coll.insert_one(doc)

    return WritingItem(**doc)

@router.put("/{writing_id}", response_model=WritingItem)
async def update_writing(writing_id: str, payload: WritingUpdate):
    coll = db_manager.get_collection("writings")
    doc = await coll.find_one({"$or": [{"id": writing_id}, {"_id": writing_id}]})
    if not doc:
        raise HTTPException(status_code=404, detail="Writing not found")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "content" in update_data:
        words = len(update_data["content"].split())
        update_data["word_count"] = words
        update_data["reading_time_minutes"] = calculate_reading_time(words)
    update_data["updated_at"] = datetime.utcnow()

    await coll.update_one({"$or": [{"id": writing_id}, {"_id": writing_id}]}, {"$set": update_data})

    updated_doc = await coll.find_one({"$or": [{"id": writing_id}, {"_id": writing_id}]})
    updated_doc["id"] = updated_doc.get("id") or str(updated_doc.get("_id"))
    return WritingItem(**updated_doc)

@router.delete("/{writing_id}")
async def delete_writing(writing_id: str):
    coll = db_manager.get_collection("writings")
    res = await coll.delete_one({"$or": [{"id": writing_id}, {"_id": writing_id}]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Writing not found")

    # Clean up bookmarks and reviews
    await db_manager.get_collection("bookmarks").delete_one({"writing_id": writing_id})
    return {"message": "Writing deleted successfully", "id": writing_id}
