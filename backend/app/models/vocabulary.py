from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, Field

class VocabularyWord(Document):
    user_id: str
    word: str
    definition: str = ""
    example_sentence: str = ""
    synonyms: List[str] = Field(default_factory=list)
    category: str = "general"
    source_title: Optional[str] = None
    mastery: str = "learning"  # learning, mastered
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "vocabulary_words"

class VocabularyCreate(BaseModel):
    word: str
    definition: Optional[str] = ""
    example_sentence: Optional[str] = ""
    synonyms: Optional[List[str]] = Field(default_factory=list)
    source_title: Optional[str] = None

class VocabularyOut(BaseModel):
    id: str
    word: str
    definition: str
    example_sentence: str
    synonyms: List[str]
    source_title: Optional[str]
    mastery: str
    created_at: datetime
