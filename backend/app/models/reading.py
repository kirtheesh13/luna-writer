from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, Field

class ReadingActivity(Document):
    user_id: str
    writing_id: str
    writing_title: str
    category: str
    word_count: int
    read_date: str  # YYYY-MM-DD
    completed_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reading_activities"

class FinishReadingRequest(BaseModel):
    writing_id: str
    writing_title: str
    category: str
    word_count: int

class BadgeOut(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    unlocked: bool
    progress: Optional[str] = None

class ReadingStatsOut(BaseModel):
    today_count: int
    weekly_total: int
    weekly_average: float
    total_completed: int
    streak_days: int
    last_read_date: Optional[str]
    badges: List[BadgeOut]
    recent_history: List[dict]
