from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class CategoryEnum(str):
    STORIES = "stories"
    LETTERS = "letters"
    ARTICLES = "articles"
    EMAILS = "emails"

class LevelEnum(str):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"

class StatusEnum(str):
    DRAFT = "draft"
    PUBLISHED = "published"
    IN_REVIEW = "in_review"

class VisibilityEnum(str):
    PRIVATE = "private"
    PUBLIC = "public"

class WritingBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field("stories", description="Category: stories, letters, articles, emails")
    content: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, max_length=350)
    topic: Optional[str] = Field("General", max_length=100)
    level: str = Field("B1", description="Target CEFR level: A2, B1, B2")
    status: str = Field("draft", description="draft, published, in_review")
    visibility: str = Field("private", description="private, public")
    author_name: str = Field("Luna Contributor")
    tags: List[str] = Field(default_factory=list)

class WritingCreate(WritingBase):
    pass

class WritingUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    topic: Optional[str] = None
    level: Optional[str] = None
    status: Optional[str] = None
    visibility: Optional[str] = None
    tags: Optional[List[str]] = None

class WritingItem(WritingBase):
    id: str
    word_count: int = 0
    reading_time_minutes: int = 1
    is_sample: bool = False
    is_bookmarked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserSettings(BaseModel):
    theme: str = Field("light", description="light, dark, sepia, nord, slate")
    accent_color: str = Field("indigo", description="indigo, violet, emerald, amber, rose, sky")
    font_family: str = Field("sans", description="sans, serif, mono, lexend")
    font_size: int = Field(16, ge=12, le=26)
    line_spacing: str = Field("normal", description="compact, normal, relaxed")
    reading_width: str = Field("medium", description="narrow, medium, wide")
    interface_density: str = Field("comfortable", description="compact, comfortable, spacious")
    card_style: str = Field("bordered", description="bordered, shadow, flat, glass")
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookmarkToggle(BaseModel):
    writing_id: str
    bookmarked: bool
