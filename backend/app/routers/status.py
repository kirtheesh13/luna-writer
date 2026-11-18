from fastapi import APIRouter
from backend.app.config import settings
from backend.app.database import db_manager

router = APIRouter(prefix="/api/status", tags=["System Status"])

@router.get("")
async def system_status():
    db_status = await db_manager.get_status()
    
    if settings.OPENAI_API_KEY:
        engine_label = f"OpenAI ({settings.AI_MODEL_NAME})"
        mode_label = "Live OpenAI Connected"
    elif settings.GEMINI_API_KEY:
        engine_label = f"Google Gemini ({settings.AI_MODEL_NAME})"
        mode_label = "Live Gemini Connected"
    else:
        engine_label = "Luna B1 Educational Linguistic Engine (Demo Heuristic Mode)"
        mode_label = "Demo / Built-in Linguistic Engine"

    ai_status = {
        "engine": engine_label,
        "has_gemini_key": bool(settings.GEMINI_API_KEY),
        "has_openai_key": bool(settings.OPENAI_API_KEY),
        "model_name": settings.AI_MODEL_NAME,
        "mode_label": mode_label
    }
    return {
        "app_name": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "database": db_status,
        "ai_service": ai_status,
        "allowed_upload_extensions": settings.ALLOWED_EXTENSIONS,
        "max_upload_size_bytes": settings.MAX_UPLOAD_SIZE_BYTES
    }
