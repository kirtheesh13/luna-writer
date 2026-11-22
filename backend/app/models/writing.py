from datetime import datetime
from typing import Any, Dict, List, Optional
from beanie import Document
from pydantic import BaseModel, Field

class Writing(Document):
    title: str
    category: str = "stories"  # stories, articles, letters, emails
    topic: str = "General"
    level: str = "B1"          # A1, A2, B1, B2, C1, C2
    status: str = "published"  # draft, published
    visibility: str = "public" # public, private
    author_id: Optional[str] = None
    author_name: str = "Anonymous Writer"
    description: str = ""
    content: str = ""
    tags: List[str] = Field(default_factory=list)
    word_count: int = 0
    reading_time_minutes: int = 1
    is_sample: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    ai_evaluation: Optional[Dict[str, Any]] = None

    class Settings:
        name = "writings"

class WritingCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    category: str = "stories"
    topic: str = "General"
    level: str = "A1"
    status: str = "draft"
    visibility: str = "private"
    content: str = Field(..., min_length=5)
    description: Optional[str] = ""
    tags: Optional[List[str]] = Field(default_factory=list)

class WritingUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    topic: Optional[str] = None
    level: Optional[str] = None
    status: Optional[str] = None
    visibility: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    ai_evaluation: Optional[Dict[str, Any]] = None

class WritingOut(BaseModel):
    id: str
    title: str
    category: str
    topic: str
    level: str
    status: str
    visibility: str
    author_id: Optional[str] = None
    author_name: str = "Anonymous Writer"
    description: Optional[str] = ""
    content: str
    tags: List[str] = Field(default_factory=list)
    word_count: int = 0
    reading_time_minutes: int = 1
    is_sample: bool = False
    created_at: datetime
    updated_at: datetime
    ai_evaluation: Optional[Dict[str, Any]] = None

class WritingListResponse(BaseModel):
    items: List[WritingOut]
    total: int
    category: Optional[str] = None
