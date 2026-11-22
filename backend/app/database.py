import asyncio
import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from beanie import init_beanie
from pymongo import AsyncMongoClient
from pymongo.errors import ServerSelectionTimeoutError

from backend.app.config import settings
from backend.app.models.user import User
from backend.app.models.writing import Writing
from backend.app.models.reading import ReadingActivity
from backend.app.models.vocabulary import VocabularyWord
from backend.app.services.seed_data import get_sample_writings

logger = logging.getLogger("luna_writer.database")

DB_FILE = settings.DATA_DIR / "luna_embedded_db.json"

class DatabaseManager:
    def __init__(self):
        self.is_connected_to_mongo: bool = False
        self.client: Optional[AsyncMongoClient] = None
        self._memory_store: Dict[str, List[Dict[str, Any]]] = {
            "users": [],
            "writings": [],
            "reading_activities": [],
            "vocabulary_words": []
        }

    def _load_embedded_store(self):
        if DB_FILE.exists():
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._memory_store = {
                        "users": data.get("users", []),
                        "writings": data.get("writings", []),
                        "reading_activities": data.get("reading_activities", []),
                        "vocabulary_words": data.get("vocabulary_words", [])
                    }
                    logger.info(f"Loaded {len(self._memory_store['writings'])} writings from embedded storage.")
            except Exception as e:
                logger.warning(f"Error loading embedded store: {e}")
        
        # If writings are empty, seed them
        if not self._memory_store["writings"]:
            samples = get_sample_writings()
            for s in samples:
                doc = s.copy()
                doc["_id"] = doc.get("id") or str(uuid.uuid4())
                doc["id"] = doc["_id"]
                if isinstance(doc.get("created_at"), datetime):
                    doc["created_at"] = doc["created_at"].isoformat()
                if isinstance(doc.get("updated_at"), datetime):
                    doc["updated_at"] = doc["updated_at"].isoformat()
                self._memory_store["writings"].append(doc)
            self._save_embedded_store()
            logger.info(f"Seeded {len(samples)} writings to embedded store.")

    def _save_embedded_store(self):
        try:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(self._memory_store, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving embedded store: {e}")

    async def connect(self):
        """Initialize MongoDB with Beanie & AsyncMongoClient. Fallback to embedded persistence if unreachable."""
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI} using PyMongo AsyncMongoClient...")
            self.client = AsyncMongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
            
            # Ping database to confirm live connection
            await self.client.admin.command('ping')
            
            # Initialize Beanie with document models
            await init_beanie(
                database=self.client[settings.MONGODB_DB_NAME],
                document_models=[User, Writing, ReadingActivity, VocabularyWord]
            )
            self.is_connected_to_mongo = True
            logger.info("Successfully connected to live MongoDB with Beanie ODM!")
            
            # Seed sample data if empty
            count = await Writing.count()
            if count == 0:
                samples = get_sample_writings()
                for s in samples:
                    doc_data = s.copy()
                    if "id" in doc_data:
                        del doc_data["id"]
                    w = Writing(**doc_data)
                    await w.insert()
                logger.info(f"Seeded {len(samples)} writings into live MongoDB.")

        except (ServerSelectionTimeoutError, Exception) as e:
            logger.warning(f"Could not connect to live MongoDB daemon ({type(e).__name__}: {e}). Running in resilient persistent embedded mode.")
            self.is_connected_to_mongo = False
            self._load_embedded_store()

    async def disconnect(self):
        if self.client:
            await self.client.close()

db_manager = DatabaseManager()
