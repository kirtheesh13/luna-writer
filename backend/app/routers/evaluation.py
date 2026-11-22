from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from backend.app.services.ai_service import evaluate_writing_with_ai, generate_reading_highlights
from backend.app.routers.auth import get_current_user_optional

router = APIRouter(prefix="/api/evaluate", tags=["AI Evaluation & Review"])

class EvaluateWritingRequest(BaseModel):
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=10)
    category: str = Field("stories", description="stories, articles, letters, emails")

class ReadingHighlightRequest(BaseModel):
    title: str
    content: str
    category: str = "stories"

@router.post("/writing")
async def evaluate_user_writing(req: EvaluateWritingRequest, current_user: Optional[dict] = Depends(get_current_user_optional)):
    result = await evaluate_writing_with_ai(
        title=req.title,
        content=req.content,
        category=req.category
    )
    return result

@router.post("/reading-highlights")
async def get_reading_highlights(req: ReadingHighlightRequest):
    result = await generate_reading_highlights(
        title=req.title,
        content=req.content,
        category=req.category
    )
    return result
