from datetime import datetime
from typing import Optional
from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field

class User(Document):
    email: Indexed(str, unique=True)
    hashed_password: str
    full_name: str
    role: str = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reading_streak: int = 0
    last_read_date: Optional[str] = None  # YYYY-MM-DD

    class Settings:
        name = "users"

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime
    reading_streak: int
    last_read_date: Optional[str]

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
