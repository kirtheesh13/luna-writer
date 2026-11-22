import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException

from backend.app.database import db_manager
from backend.app.models.vocabulary import VocabularyCreate, VocabularyOut, VocabularyWord
from backend.app.routers.auth import get_current_user_optional, get_current_user_required

router = APIRouter(prefix="/api/vocabulary", tags=["Vocabulary Vault"])

@router.get("", response_model=List[VocabularyOut])
async def list_vocabulary(current_user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = current_user["id"] if current_user else "anonymous_guest"
    
    if db_manager.is_connected_to_mongo:
        docs = await VocabularyWord.find(VocabularyWord.user_id == user_id).sort(-VocabularyWord.created_at).to_list()
        return [
            VocabularyOut(
                id=str(d.id),
                word=d.word,
                definition=d.definition,
                example_sentence=d.example_sentence,
                synonyms=d.synonyms,
                source_title=d.source_title,
                mastery=d.mastery,
                created_at=d.created_at
            ) for d in docs
        ]
    else:
        words = [w for w in db_manager._memory_store["vocabulary_words"] if w.get("user_id") == user_id]
        out = []
        for w in words:
            created_at = datetime.fromisoformat(w["created_at"]) if isinstance(w.get("created_at"), str) else (w.get("created_at") or datetime.utcnow())
            out.append(VocabularyOut(
                id=str(w.get("id", w.get("_id"))),
                word=w.get("word", ""),
                definition=w.get("definition", ""),
                example_sentence=w.get("example_sentence", ""),
                synonyms=w.get("synonyms", []),
                source_title=w.get("source_title"),
                mastery=w.get("mastery", "learning"),
                created_at=created_at
            ))
        return out

@router.post("", response_model=VocabularyOut)
async def add_vocabulary(req: VocabularyCreate, current_user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = current_user["id"] if current_user else "anonymous_guest"
    word_clean = req.word.strip().lower()
    now = datetime.utcnow()

    if db_manager.is_connected_to_mongo:
        # Check duplicate
        existing = await VocabularyWord.find_one(
            VocabularyWord.user_id == user_id,
            VocabularyWord.word == word_clean
        )
        if existing:
            return VocabularyOut(
                id=str(existing.id),
                word=existing.word,
                definition=existing.definition,
                example_sentence=existing.example_sentence,
                synonyms=existing.synonyms,
                source_title=existing.source_title,
                mastery=existing.mastery,
                created_at=existing.created_at
            )
            
        doc = VocabularyWord(
            user_id=user_id,
            word=word_clean,
            definition=req.definition or "Saved from reading",
            example_sentence=req.example_sentence or "",
            synonyms=req.synonyms or [],
            source_title=req.source_title,
            mastery="learning",
            created_at=now
        )
        await doc.insert()
        return VocabularyOut(
            id=str(doc.id),
            word=doc.word,
            definition=doc.definition,
            example_sentence=doc.example_sentence,
            synonyms=doc.synonyms,
            source_title=doc.source_title,
            mastery=doc.mastery,
            created_at=doc.created_at
        )
    else:
        for w in db_manager._memory_store["vocabulary_words"]:
            if w.get("user_id") == user_id and w.get("word", "").lower() == word_clean:
                created_at = datetime.fromisoformat(w["created_at"]) if isinstance(w.get("created_at"), str) else now
                return VocabularyOut(
                    id=str(w.get("id", w.get("_id"))),
                    word=w["word"],
                    definition=w.get("definition", ""),
                    example_sentence=w.get("example_sentence", ""),
                    synonyms=w.get("synonyms", []),
                    source_title=w.get("source_title"),
                    mastery=w.get("mastery", "learning"),
                    created_at=created_at
                )

        new_id = str(uuid.uuid4())
        item = {
            "id": new_id,
            "_id": new_id,
            "user_id": user_id,
            "word": word_clean,
            "definition": req.definition or "Saved from reading",
            "example_sentence": req.example_sentence or "",
            "synonyms": req.synonyms or [],
            "source_title": req.source_title,
            "mastery": "learning",
            "created_at": now.isoformat()
        }
        db_manager._memory_store["vocabulary_words"].insert(0, item)
        db_manager._save_embedded_store()
        return VocabularyOut(
            id=new_id,
            word=word_clean,
            definition=item["definition"],
            example_sentence=item["example_sentence"],
            synonyms=item["synonyms"],
            source_title=req.source_title,
            mastery="learning",
            created_at=now
        )

@router.delete("/{id}")
async def delete_vocabulary(id: str, current_user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = current_user["id"] if current_user else "anonymous_guest"
    if db_manager.is_connected_to_mongo:
        doc = await VocabularyWord.get(id)
        if doc and doc.user_id == user_id:
            await doc.delete()
        return {"success": True}
    else:
        db_manager._memory_store["vocabulary_words"] = [
            w for w in db_manager._memory_store["vocabulary_words"]
            if not (str(w.get("id", w.get("_id"))) == id and w.get("user_id") == user_id)
        ]
        db_manager._save_embedded_store()
        return {"success": True}
