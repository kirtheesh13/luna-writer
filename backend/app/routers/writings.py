import re
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.database import db_manager
from backend.app.models.writing import Writing, WritingCreate, WritingListResponse, WritingOut, WritingUpdate
from backend.app.routers.auth import get_current_user_optional, get_current_user_required

router = APIRouter(prefix="/api/writings", tags=["Writings"])

def calculate_meta(content: str):
    words = re.findall(r"\b\w+\b", content)
    count = len(words)
    reading_time = max(1, round(count / 200))
    return count, reading_time

@router.get("", response_model=WritingListResponse)
async def list_public_writings(
    category: Optional[str] = Query(None, description="stories, articles, letters, emails"),
    search: Optional[str] = Query(None),
    level: Optional[str] = Query(None, description="A1, A2, B1, B2, C1, C2"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    if db_manager.is_connected_to_mongo:
        query = Writing.find(Writing.visibility == "public")
        if category:
            query = query.find(Writing.category == category.lower())
        if level:
            query = query.find(Writing.level == level.upper())
        if search:
            regex = re.compile(search, re.IGNORECASE)
            query = query.find({
                "$or": [
                    {"title": {"$regex": regex}},
                    {"description": {"$regex": regex}},
                    {"tags": {"$in": [regex]}}
                ]
            })
        
        total = await query.count()
        docs = await query.sort(-Writing.created_at).skip(skip).limit(limit).to_list()
        items = []
        for d in docs:
            items.append(WritingOut(
                id=str(d.id),
                title=d.title,
                category=d.category,
                topic=d.topic,
                level=d.level,
                status=d.status,
                visibility=d.visibility,
                author_id=d.author_id,
                author_name=d.author_name or "Anonymous Writer",
                description=d.description or "",
                content=d.content,
                tags=d.tags,
                word_count=d.word_count,
                reading_time_minutes=d.reading_time_minutes,
                is_sample=d.is_sample,
                created_at=d.created_at,
                updated_at=d.updated_at,
                ai_evaluation=d.ai_evaluation
            ))
        return WritingListResponse(items=items, total=total, category=category)
    else:
        # Embedded fallback
        all_items = db_manager._memory_store["writings"]
        filtered = [w for w in all_items if w.get("visibility", "public") == "public"]
        
        if category:
            filtered = [w for w in filtered if w.get("category", "").lower() == category.lower()]
        if level:
            filtered = [w for w in filtered if w.get("level", "").upper() == level.upper()]
        if search:
            s_lower = search.lower()
            filtered = [
                w for w in filtered if s_lower in w.get("title", "").lower()
                or s_lower in w.get("description", "").lower()
                or any(s_lower in t.lower() for t in w.get("tags", []))
            ]
        
        total = len(filtered)
        paged = filtered[skip : skip + limit]
        
        items = []
        for d in paged:
            doc_id = str(d.get("id", d.get("_id")))
            created_at = d.get("created_at")
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at)
            elif not isinstance(created_at, datetime):
                created_at = datetime.utcnow()
                
            updated_at = d.get("updated_at")
            if isinstance(updated_at, str):
                updated_at = datetime.fromisoformat(updated_at)
            elif not isinstance(updated_at, datetime):
                updated_at = datetime.utcnow()

            items.append(WritingOut(
                id=doc_id,
                title=d.get("title", "Untitled"),
                category=d.get("category", "stories"),
                topic=d.get("topic", "General"),
                level=d.get("level", "B1"),
                status=d.get("status", "published"),
                visibility=d.get("visibility", "public"),
                author_id=d.get("author_id"),
                author_name=d.get("author_name") or "Author",
                description=d.get("description") or "",
                content=d.get("content", ""),
                tags=d.get("tags", []),
                word_count=d.get("word_count", 0),
                reading_time_minutes=d.get("reading_time_minutes", 1),
                is_sample=d.get("is_sample", False),
                created_at=created_at,
                updated_at=updated_at,
                ai_evaluation=d.get("ai_evaluation")
            ))
        return WritingListResponse(items=items, total=total, category=category)

@router.get("/user/mine", response_model=WritingListResponse)
async def get_my_writings(current_user: dict = Depends(get_current_user_required)):
    user_id = current_user["id"]
    if db_manager.is_connected_to_mongo:
        docs = await Writing.find(Writing.author_id == user_id).sort(-Writing.updated_at).to_list()
        items = [
            WritingOut(
                id=str(d.id),
                title=d.title,
                category=d.category,
                topic=d.topic,
                level=d.level,
                status=d.status,
                visibility=d.visibility,
                author_id=d.author_id,
                author_name=d.author_name or "Anonymous Writer",
                description=d.description or "",
                content=d.content,
                tags=d.tags,
                word_count=d.word_count,
                reading_time_minutes=d.reading_time_minutes,
                is_sample=d.is_sample,
                created_at=d.created_at,
                updated_at=d.updated_at,
                ai_evaluation=d.ai_evaluation
            ) for d in docs
        ]
        return WritingListResponse(items=items, total=len(items))
    else:
        my_items = [w for w in db_manager._memory_store["writings"] if str(w.get("author_id")) == user_id]
        items = []
        for d in my_items:
            doc_id = str(d.get("id", d.get("_id")))
            created_at = datetime.fromisoformat(d["created_at"]) if isinstance(d.get("created_at"), str) else (d.get("created_at") or datetime.utcnow())
            updated_at = datetime.fromisoformat(d["updated_at"]) if isinstance(d.get("updated_at"), str) else (d.get("updated_at") or datetime.utcnow())
            items.append(WritingOut(
                id=doc_id,
                title=d.get("title", "Untitled"),
                category=d.get("category", "stories"),
                topic=d.get("topic", "General"),
                level=d.get("level", "A1"),
                status=d.get("status", "draft"),
                visibility=d.get("visibility", "private"),
                author_id=d.get("author_id"),
                author_name=d.get("author_name") or "Author",
                description=d.get("description") or "",
                content=d.get("content", ""),
                tags=d.get("tags", []),
                word_count=d.get("word_count", 0),
                reading_time_minutes=d.get("reading_time_minutes", 1),
                is_sample=d.get("is_sample", False),
                created_at=created_at,
                updated_at=updated_at,
                ai_evaluation=d.get("ai_evaluation")
            ))
        return WritingListResponse(items=items, total=len(items))

@router.get("/{id}", response_model=WritingOut)
async def get_writing_by_id(id: str, current_user: Optional[dict] = Depends(get_current_user_optional)):
    if db_manager.is_connected_to_mongo:
        doc = await Writing.get(id)
        if not doc:
            raise HTTPException(status_code=404, detail="Writing not found.")
        if doc.visibility == "private":
            if not current_user or (current_user["id"] != doc.author_id and current_user.get("role") != "admin"):
                raise HTTPException(status_code=403, detail="This is a private writing accessible only to its author.")
        return WritingOut(
            id=str(doc.id),
            title=doc.title,
            category=doc.category,
            topic=doc.topic,
            level=doc.level,
            status=doc.status,
            visibility=doc.visibility,
            author_id=doc.author_id,
            author_name=doc.author_name or "Anonymous Writer",
            description=doc.description or "",
            content=doc.content,
            tags=doc.tags,
            word_count=doc.word_count,
            reading_time_minutes=doc.reading_time_minutes,
            is_sample=doc.is_sample,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
            ai_evaluation=doc.ai_evaluation
        )
    else:
        matched = None
        for w in db_manager._memory_store["writings"]:
            if str(w.get("id")) == id or str(w.get("_id")) == id:
                matched = w
                break
        if not matched:
            raise HTTPException(status_code=404, detail="Writing not found.")
        
        if matched.get("visibility") == "private":
            if not current_user or (current_user["id"] != str(matched.get("author_id")) and current_user.get("role") != "admin"):
                raise HTTPException(status_code=403, detail="This is a private writing accessible only to its author.")
                
        doc_id = str(matched.get("id", matched.get("_id")))
        created_at = datetime.fromisoformat(matched["created_at"]) if isinstance(matched.get("created_at"), str) else (matched.get("created_at") or datetime.utcnow())
        updated_at = datetime.fromisoformat(matched["updated_at"]) if isinstance(matched.get("updated_at"), str) else (matched.get("updated_at") or datetime.utcnow())
        return WritingOut(
            id=doc_id,
            title=matched.get("title", "Untitled"),
            category=matched.get("category", "stories"),
            topic=matched.get("topic", "General"),
            level=matched.get("level", "B1"),
            status=matched.get("status", "published"),
            visibility=matched.get("visibility", "public"),
            author_id=matched.get("author_id"),
            author_name=matched.get("author_name") or "Author",
            description=matched.get("description") or "",
            content=matched.get("content", ""),
            tags=matched.get("tags", []),
            word_count=matched.get("word_count", 0),
            reading_time_minutes=matched.get("reading_time_minutes", 1),
            is_sample=matched.get("is_sample", False),
            created_at=created_at,
            updated_at=updated_at,
            ai_evaluation=matched.get("ai_evaluation")
        )

@router.post("", response_model=WritingOut)
async def create_writing(req: WritingCreate, current_user: Optional[dict] = Depends(get_current_user_optional)):
    author_id = current_user["id"] if current_user else None
    author_name = current_user["full_name"] if current_user else "Guest Writer"
    word_count, reading_time = calculate_meta(req.content)
    
    # Description fallback if empty
    desc = req.description or (req.content[:160] + "..." if len(req.content) > 160 else req.content)
    now = datetime.utcnow()

    if db_manager.is_connected_to_mongo:
        doc = Writing(
            title=req.title,
            category=req.category.lower(),
            topic=req.topic,
            level=req.level.upper(),
            status=req.status,
            visibility=req.visibility,
            author_id=author_id,
            author_name=author_name,
            description=desc,
            content=req.content,
            tags=req.tags or [req.category.capitalize()],
            word_count=word_count,
            reading_time_minutes=reading_time,
            is_sample=False,
            created_at=now,
            updated_at=now
        )
        await doc.insert()
        return WritingOut(
            id=str(doc.id),
            title=doc.title,
            category=doc.category,
            topic=doc.topic,
            level=doc.level,
            status=doc.status,
            visibility=doc.visibility,
            author_id=doc.author_id,
            author_name=doc.author_name or "Anonymous Writer",
            description=doc.description or "",
            content=doc.content,
            tags=doc.tags,
            word_count=doc.word_count,
            reading_time_minutes=doc.reading_time_minutes,
            is_sample=doc.is_sample,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
            ai_evaluation=None
        )
    else:
        new_id = str(uuid.uuid4())
        item = {
            "id": new_id,
            "_id": new_id,
            "title": req.title,
            "category": req.category.lower(),
            "topic": req.topic,
            "level": req.level.upper(),
            "status": req.status,
            "visibility": req.visibility,
            "author_id": author_id,
            "author_name": author_name,
            "description": desc,
            "content": req.content,
            "tags": req.tags or [req.category.capitalize()],
            "word_count": word_count,
            "reading_time_minutes": reading_time,
            "is_sample": False,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "ai_evaluation": None
        }
        db_manager._memory_store["writings"].insert(0, item)
        db_manager._save_embedded_store()
        return WritingOut(
            id=new_id,
            title=req.title,
            category=req.category.lower(),
            topic=req.topic,
            level=req.level.upper(),
            status=req.status,
            visibility=req.visibility,
            author_id=author_id,
            author_name=author_name,
            description=desc,
            content=req.content,
            tags=req.tags or [req.category.capitalize()],
            word_count=word_count,
            reading_time_minutes=reading_time,
            is_sample=False,
            created_at=now,
            updated_at=now,
            ai_evaluation=None
        )

@router.put("/{id}", response_model=WritingOut)
async def update_writing(id: str, req: WritingUpdate, current_user: Optional[dict] = Depends(get_current_user_optional)):
    now = datetime.utcnow()
    if db_manager.is_connected_to_mongo:
        doc = await Writing.get(id)
        if not doc:
            raise HTTPException(status_code=404, detail="Writing not found.")
        
        # Ownership check if user is attached
        if doc.author_id and current_user and doc.author_id != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Cannot edit someone else's writing.")
            
        if req.title is not None: doc.title = req.title
        if req.category is not None: doc.category = req.category.lower()
        if req.topic is not None: doc.topic = req.topic
        if req.level is not None: doc.level = req.level.upper()
        if req.status is not None: doc.status = req.status
        if req.visibility is not None: doc.visibility = req.visibility
        if req.content is not None:
            doc.content = req.content
            wc, rt = calculate_meta(req.content)
            doc.word_count = wc
            doc.reading_time_minutes = rt
        if req.description is not None: doc.description = req.description
        if req.tags is not None: doc.tags = req.tags
        if req.ai_evaluation is not None: doc.ai_evaluation = req.ai_evaluation
        doc.updated_at = now
        await doc.save()
        return WritingOut(
            id=str(doc.id),
            title=doc.title,
            category=doc.category,
            topic=doc.topic,
            level=doc.level,
            status=doc.status,
            visibility=doc.visibility,
            author_id=doc.author_id,
            author_name=doc.author_name or "Anonymous Writer",
            description=doc.description or "",
            content=doc.content,
            tags=doc.tags,
            word_count=doc.word_count,
            reading_time_minutes=doc.reading_time_minutes,
            is_sample=doc.is_sample,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
            ai_evaluation=doc.ai_evaluation
        )
    else:
        matched = None
        for w in db_manager._memory_store["writings"]:
            if str(w.get("id")) == id or str(w.get("_id")) == id:
                matched = w
                break
        if not matched:
            raise HTTPException(status_code=404, detail="Writing not found.")
            
        if matched.get("author_id") and current_user and str(matched.get("author_id")) != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Cannot edit someone else's writing.")

        if req.title is not None: matched["title"] = req.title
        if req.category is not None: matched["category"] = req.category.lower()
        if req.topic is not None: matched["topic"] = req.topic
        if req.level is not None: matched["level"] = req.level.upper()
        if req.status is not None: matched["status"] = req.status
        if req.visibility is not None: matched["visibility"] = req.visibility
        if req.content is not None:
            matched["content"] = req.content
            wc, rt = calculate_meta(req.content)
            matched["word_count"] = wc
            matched["reading_time_minutes"] = rt
        if req.description is not None: matched["description"] = req.description
        if req.tags is not None: matched["tags"] = req.tags
        if req.ai_evaluation is not None: matched["ai_evaluation"] = req.ai_evaluation
        matched["updated_at"] = now.isoformat()
        db_manager._save_embedded_store()

        created_at = datetime.fromisoformat(matched["created_at"]) if isinstance(matched.get("created_at"), str) else (matched.get("created_at") or now)
        return WritingOut(
            id=str(matched.get("id", matched.get("_id"))),
            title=matched.get("title", "Untitled"),
            category=matched.get("category", "stories"),
            topic=matched.get("topic", "General"),
            level=matched.get("level", "B1"),
            status=matched.get("status", "draft"),
            visibility=matched.get("visibility", "private"),
            author_id=matched.get("author_id"),
            author_name=matched.get("author_name") or "Author",
            description=matched.get("description") or "",
            content=matched.get("content", ""),
            tags=matched.get("tags", []),
            word_count=matched.get("word_count", 0),
            reading_time_minutes=matched.get("reading_time_minutes", 1),
            is_sample=matched.get("is_sample", False),
            created_at=created_at,
            updated_at=now,
            ai_evaluation=matched.get("ai_evaluation")
        )

@router.delete("/{id}")
async def delete_writing(id: str, current_user: dict = Depends(get_current_user_required)):
    if db_manager.is_connected_to_mongo:
        doc = await Writing.get(id)
        if not doc:
            raise HTTPException(status_code=404, detail="Writing not found.")
        if doc.author_id != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Cannot delete someone else's writing.")
        await doc.delete()
        return {"success": True, "message": "Writing deleted successfully."}
    else:
        idx = -1
        for i, w in enumerate(db_manager._memory_store["writings"]):
            if str(w.get("id")) == id or str(w.get("_id")) == id:
                idx = i
                break
        if idx == -1:
            raise HTTPException(status_code=404, detail="Writing not found.")
        matched = db_manager._memory_store["writings"][idx]
        if str(matched.get("author_id")) != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Cannot delete someone else's writing.")
        del db_manager._memory_store["writings"][idx]
        db_manager._save_embedded_store()
        return {"success": True, "message": "Writing deleted successfully."}
