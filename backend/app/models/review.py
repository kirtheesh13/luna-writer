from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class SentenceSuggestion(BaseModel):
    id: str
    original: str
    suggested: str
    reason: str
    category: str = Field("clarity", description="vocabulary, grammar, length, clarity")
    applied: bool = False

class CategoryObservation(BaseModel):
    score: int = Field(..., ge=0, le=100)
    rating: str = Field(..., description="Below Target, Solid Match, Above Target")
    summary: str
    strengths: List[str] = Field(default_factory=list)
    areas_for_growth: List[str] = Field(default_factory=list)
    key_examples: List[str] = Field(default_factory=list)

class ReviewObservations(BaseModel):
    vocabulary: CategoryObservation
    grammar: CategoryObservation
    sentence_length: CategoryObservation
    organization: CategoryObservation

class ReviewRequest(BaseModel):
    writing_id: Optional[str] = None
    title: Optional[str] = "Untitled Piece"
    category: Optional[str] = "stories"
    target_level: Optional[str] = Field("B1", description="Target CEFR level: A1, A2, B1, B2, C1, C2")
    content: str = Field(..., min_length=15, description="Text to evaluate for Cambridge CEFR suitability")

class ReviewResponse(BaseModel):
    id: str
    writing_id: Optional[str] = None
    title: str
    category: str
    target_level: Optional[str] = "B1"
    estimated_level: str = Field(..., description="A1, A2, B1, B2, C1, or C2")
    suitability_verdict: str = Field(..., description="Suitability indicator for target level")
    is_suitable_b1: bool = Field(True, description="Backwards compatible boolean suitability flag")
    suitability_score: int = Field(..., ge=0, le=100)
    overall_explanation: str
    observations: ReviewObservations
    encouraging_suggestions: List[str]
    sentence_suggestions: List[SentenceSuggestion]
    metrics: Dict[str, Any] = Field(default_factory=dict)
    is_demo: bool = False
    ai_engine_used: str = "Luna CEFR Engine"
    disclaimer: str = (
        "Educational estimate based on CEFR Cambridge benchmarks (A1–C2); "
        "not an official Cambridge Assessment English exam result or guarantee."
    )
    data_privacy_note: str = (
        "Your text was evaluated securely. Submissions are processed without "
        "being used for public training, and stored only in your private Luna review history."
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
