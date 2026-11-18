import json
import logging
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import asyncio

from backend.app.config import settings
from backend.app.services.seed_data import get_sample_writings

logger = logging.getLogger("luna_writer.database")

import os
import shutil

# Persistent directory for embedded/fallback mode (supports local and Vercel/Lambda serverless /tmp)
SOURCE_DATA_FILE = Path(__file__).resolve().parent.parent.parent / ".data" / "luna_embedded_db.json"
if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
    DATA_DIR = Path("/tmp/.data")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DB_BACKUP_FILE = DATA_DIR / "luna_embedded_db.json"
    if not DB_BACKUP_FILE.exists() and SOURCE_DATA_FILE.exists():
        try:
            shutil.copyfile(SOURCE_DATA_FILE, DB_BACKUP_FILE)
        except Exception as e:
            logger.warning(f"Could not copy seed DB to /tmp: {e}")
else:
    DATA_DIR = Path(__file__).resolve().parent.parent.parent / ".data"
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DB_BACKUP_FILE = DATA_DIR / "luna_embedded_db.json"

def _normalize_doc(data: Any) -> Any:
    """Recursively convert datetime instances to ISO-8601 strings for robust JSON & sorting."""
    if isinstance(data, datetime):
        return data.isoformat()
    if isinstance(data, dict):
        return {k: _normalize_doc(v) for k, v in data.items()}
    if isinstance(data, list):
        return [_normalize_doc(v) for v in data]
    return data

class MockCursor:
    def __init__(self, items: List[Dict[str, Any]]):
        self._items = items
        self._skip = 0
        self._limit = len(items)

    def sort(self, key_or_list, direction=1):
        def _safe_sort_key(item, k):
            val = item.get(k)
            if val is None:
                return (2, "")
            if isinstance(val, datetime):
                return (0, val.isoformat())
            if isinstance(val, (int, float)):
                return (1, val)
            return (0, str(val))

        if isinstance(key_or_list, list):
            for k, d in reversed(key_or_list):
                rev = (d == -1)
                self._items.sort(key=lambda x: _safe_sort_key(x, k), reverse=rev)
        else:
            rev = (direction == -1)
            self._items.sort(key=lambda x: _safe_sort_key(x, key_or_list), reverse=rev)
        return self

    def skip(self, count: int):
        self._skip = count
        return self

    def limit(self, count: int):
        self._limit = count
        return self

    async def to_list(self, length: Optional[int] = None):
        res = self._items[self._skip : self._skip + self._limit]
        if length is not None:
            res = res[:length]
        return res

    def __aiter__(self):
        self._iter_items = iter(self._items[self._skip : self._skip + self._limit])
        return self

    async def __anext__(self):
        try:
            return next(self._iter_items)
        except StopIteration:
            raise StopAsyncIteration

class MockMongoCollection:
    def __init__(self, name: str, parent_db: "MockMongoDB"):
        self.name = name
        self.parent = parent_db

    def _matches_filter(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        if not query:
            return True
        for key, expected in query.items():
            if key == "$or":
                if not any(self._matches_filter(doc, subq) for subq in expected):
                    return False
                continue
            if key == "$and":
                if not all(self._matches_filter(doc, subq) for subq in expected):
                    return False
                continue

            val = doc.get(key)
            if isinstance(expected, dict):
                # handle operators $regex, $in, $gte, $lte, $ne, $options
                if "$regex" in expected:
                    pattern = expected["$regex"]
                    flags = re.IGNORECASE if "i" in expected.get("$options", "") else 0
                    if not (isinstance(val, str) and re.search(pattern, val, flags)):
                        return False
                if "$in" in expected:
                    if isinstance(val, list):
                        if not any(item in expected["$in"] for item in val):
                            return False
                    elif val not in expected["$in"]:
                        return False
                if "$nin" in expected:
                    if isinstance(val, list):
                        if any(item in expected["$nin"] for item in val):
                            return False
                    elif val in expected["$nin"]:
                        return False
                if "$exists" in expected:
                    exists = (key in doc and doc[key] is not None)
                    if bool(expected["$exists"]) != exists:
                        return False
                if "$gte" in expected and (val is None or val < expected["$gte"]):
                    return False
                if "$lte" in expected and (val is None or val > expected["$lte"]):
                    return False
                if "$ne" in expected and val == expected["$ne"]:
                    return False
            else:
                if val != expected:
                    return False
        return True

    async def find_one(self, query: Dict[str, Any] = None, projection: Dict[str, Any] = None):
        query = query or {}
        for doc in self.parent._data.get(self.name, []):
            if self._matches_filter(doc, query):
                return dict(doc)
        return None

    def find(self, query: Dict[str, Any] = None, projection: Dict[str, Any] = None):
        query = query or {}
        matches = [dict(doc) for doc in self.parent._data.get(self.name, []) if self._matches_filter(doc, query)]
        return MockCursor(matches)

    async def insert_one(self, document: Dict[str, Any]):
        doc_copy = _normalize_doc(dict(document))
        if "id" not in doc_copy and "_id" not in doc_copy:
            import uuid
            doc_copy["id"] = f"{self.name}-{uuid.uuid4().hex[:8]}"
        elif "id" not in doc_copy and "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
        
        self.parent._data.setdefault(self.name, []).append(doc_copy)
        self.parent.save_to_disk()
        
        class InsertResult:
            inserted_id = doc_copy.get("id") or doc_copy.get("_id")
        return InsertResult()

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        set_fields = _normalize_doc(update.get("$set", {}))
        matched = 0
        modified = 0
        for doc in self.parent._data.get(self.name, []):
            if self._matches_filter(doc, query):
                matched += 1
                doc.update(set_fields)
                modified += 1
                self.parent.save_to_disk()
                break
        
        if matched == 0 and upsert:
            new_doc = dict(query)
            new_doc.update(set_fields)
            await self.insert_one(new_doc)
            modified = 1
            matched = 1

        class UpdateResult:
            matched_count = matched
            modified_count = modified
        return UpdateResult()

    async def delete_one(self, query: Dict[str, Any]):
        docs = self.parent._data.get(self.name, [])
        initial_len = len(docs)
        self.parent._data[self.name] = [d for d in docs if not self._matches_filter(d, query)]
        deleted = initial_len - len(self.parent._data[self.name])
        if deleted > 0:
            self.parent.save_to_disk()
        
        class DeleteResult:
            deleted_count = deleted
        return DeleteResult()

    async def count_documents(self, query: Dict[str, Any] = None) -> int:
        query = query or {}
        return sum(1 for doc in self.parent._data.get(self.name, []) if self._matches_filter(doc, query))

    async def create_index(self, *args, **kwargs):
        return "index_ok"

class MockMongoDB:
    def __init__(self):
        self._data: Dict[str, List[Dict[str, Any]]] = {}
        self.load_from_disk()

    def __getitem__(self, name: str) -> MockMongoCollection:
        return MockMongoCollection(name, self)

    def __getattr__(self, name: str) -> MockMongoCollection:
        return self[name]

    def load_from_disk(self):
        if DB_BACKUP_FILE.exists():
            try:
                with open(DB_BACKUP_FILE, "r", encoding="utf-8") as f:
                    self._data = json.load(f)
            except Exception as e:
                logger.warning(f"Could not load embedded DB file: {e}")
                self._data = {}

    def save_to_disk(self):
        def _json_serial(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            return str(obj)
        try:
            with open(DB_BACKUP_FILE, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, default=_json_serial)
        except Exception as e:
            logger.warning(f"Could not save embedded DB file: {e}")

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_live_mongo: bool = False
        self.connection_error: Optional[str] = None
        self.mock_db = MockMongoDB()

    async def connect(self):
        from motor.motor_asyncio import AsyncIOMotorClient

        uri = settings.MONGODB_URI
        db_name = settings.MONGODB_DB_NAME
        try:
            logger.info(f"Connecting to MongoDB at {uri}...")
            client = AsyncIOMotorClient(
                uri,
                serverSelectionTimeoutMS=1500,
                connectTimeoutMS=1500
            )
            # Test ping
            await client.admin.command("ping")
            self.client = client
            self.db = client[db_name]
            self.is_live_mongo = True
            logger.info(f"Connected to Live MongoDB ({db_name}) successfully.")
            await self._ensure_indexes()
            await self._seed_if_needed()
        except Exception as e:
            self.is_live_mongo = False
            self.connection_error = str(e)
            self.db = self.mock_db
            logger.warning(
                f"Could not connect to live MongoDB at {uri}: {e}. "
                f"Operating in resilient Embedded MongoDB Mode backed by JSON storage."
            )
            await self._seed_if_needed()

    async def _ensure_indexes(self):
        if self.is_live_mongo:
            try:
                await self.db.writings.create_index("category")
                await self.db.writings.create_index("level")
                await self.db.writings.create_index("created_at")
                await self.db.bookmarks.create_index("writing_id", unique=True)
                await self.db.reviews.create_index("writing_id")
            except Exception as e:
                logger.warning(f"Index creation warning: {e}")

    async def _seed_if_needed(self):
        count = await self.db.writings.count_documents({})
        if count == 0:
            logger.info("Database writings collection is empty. Seeding realistic sample pieces...")
            samples = get_sample_writings()
            for item in samples:
                # Convert datetime to ISO string if in mock mode for consistency
                await self.db.writings.insert_one(item)
            logger.info(f"Seeded {len(samples)} realistic sample pieces across all categories.")

    def get_collection(self, name: str):
        if self.db is None:
            return self.mock_db[name]
        return self.db[name]

    async def get_status(self) -> Dict[str, Any]:
        doc_count = await self.get_collection("writings").count_documents({})
        bookmark_count = await self.get_collection("bookmarks").count_documents({})
        review_count = await self.get_collection("reviews").count_documents({})
        
        return {
            "mode": "Live MongoDB" if self.is_live_mongo else "High-Fidelity Embedded Mode",
            "is_live_mongo": self.is_live_mongo,
            "target_uri": settings.MONGODB_URI,
            "db_name": settings.MONGODB_DB_NAME,
            "connection_error": self.connection_error if not self.is_live_mongo else None,
            "counts": {
                "writings": doc_count,
                "bookmarks": bookmark_count,
                "reviews": review_count
            },
            "instructions": (
                "To connect to your own MongoDB server: set MONGODB_URI=mongodb://localhost:27017 "
                "or a MongoDB Atlas connection string in your .env file."
            )
        }

db_manager = DatabaseManager()

def get_db():
    return db_manager.db
