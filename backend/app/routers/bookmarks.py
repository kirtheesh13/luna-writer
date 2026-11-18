from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException

from backend.app.database import db_manager
from backend.app.models.writing import WritingItem

router = APIRouter(prefix="/api/bookmarks", tags=["Bookmarks"])

@router.post("/{writing_id}")
async def toggle_bookmark(writing_id: str):
    w_coll = db_manager.get_collection("writings")
    item = await w_coll.find_one({"$or": [{"id": writing_id}, {"_id": writing_id}]})
    if not item:
        raise HTTPException(status_code=404, detail="Writing not found")

    item_id = item.get("id") or str(item.get("_id"))
    bm_coll = db_manager.get_collection("bookmarks")
    existing = await bm_coll.find_one({"writing_id": item_id})

    if existing:
        await bm_coll.delete_one({"writing_id": item_id})
        return {"writing_id": item_id, "bookmarked": False, "message": "Bookmark removed"}
    else:
        await bm_coll.insert_one({
            "writing_id": item_id,
            "created_at": datetime.utcnow()
        })
        return {"writing_id": item_id, "bookmarked": True, "message": "Bookmark added"}

@router.get("", response_model=List[WritingItem])
async def list_bookmarks():
    bm_coll = db_manager.get_collection("bookmarks")
    bookmarks = await bm_coll.find({}).sort("created_at", -1).to_list(length=100)
    writing_ids = [b["writing_id"] for b in bookmarks if "writing_id" in b]

    if not writing_ids:
        return []

    w_coll = db_manager.get_collection("writings")
    writings_cursor = w_coll.find({"$or": [{"id": {"$in": writing_ids}}, {"_id": {"$in": writing_ids}}]})
    writings = await writings_cursor.to_list(length=100)

    results = []
    for doc in writings:
        doc["id"] = doc.get("id") or str(doc.get("_id"))
        doc["is_bookmarked"] = True
        results.append(WritingItem(**doc))

    return results
