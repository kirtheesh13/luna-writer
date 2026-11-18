from datetime import datetime
from fastapi import APIRouter
from backend.app.database import db_manager
from backend.app.models.writing import UserSettings

router = APIRouter(prefix="/api/settings", tags=["Customization Settings"])

DEFAULT_SETTINGS = {
    "id": "global_user_settings",
    "theme": "light",
    "accent_color": "indigo",
    "font_family": "sans",
    "font_size": 16,
    "line_spacing": "normal",
    "reading_width": "medium",
    "interface_density": "comfortable",
    "card_style": "bordered",
    "updated_at": datetime.utcnow()
}

@router.get("", response_model=UserSettings)
async def get_settings():
    coll = db_manager.get_collection("settings")
    doc = await coll.find_one({"id": "global_user_settings"})
    if not doc:
        return UserSettings(**DEFAULT_SETTINGS)
    return UserSettings(**doc)

@router.post("", response_model=UserSettings)
async def update_settings(payload: UserSettings):
    coll = db_manager.get_collection("settings")
    doc = payload.model_dump()
    doc["id"] = "global_user_settings"
    doc["updated_at"] = datetime.utcnow()
    await coll.update_one({"id": "global_user_settings"}, {"$set": doc}, upsert=True)
    return UserSettings(**doc)

@router.post("/reset", response_model=UserSettings)
async def reset_settings():
    coll = db_manager.get_collection("settings")
    defaults = dict(DEFAULT_SETTINGS)
    defaults["updated_at"] = datetime.utcnow()
    await coll.update_one({"id": "global_user_settings"}, {"$set": defaults}, upsert=True)
    return UserSettings(**defaults)
