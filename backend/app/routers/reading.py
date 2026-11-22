import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.database import db_manager
from backend.app.models.reading import BadgeOut, FinishReadingRequest, ReadingActivity, ReadingStatsOut
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user_optional, get_current_user_required

router = APIRouter(prefix="/api/reading", tags=["Reading & Achievements"])

def get_today_str() -> str:
    # Uses system local date so after 12:00 AM midnight it automatically advances
    return datetime.now().strftime("%Y-%m-%d")

@router.post("/finish")
async def finish_reading(req: FinishReadingRequest, current_user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = current_user["id"] if current_user else "anonymous_guest"
    today_str = get_today_str()
    now = datetime.utcnow()

    if db_manager.is_connected_to_mongo:
        activity = ReadingActivity(
            user_id=user_id,
            writing_id=req.writing_id,
            writing_title=req.writing_title,
            category=req.category,
            word_count=req.word_count,
            read_date=today_str,
            completed_at=now
        )
        await activity.insert()

        # Update streak on user if logged in
        if current_user:
            user = await User.get(user_id)
            if user:
                if user.last_read_date != today_str:
                    yesterday_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
                    if user.last_read_date == yesterday_str:
                        user.reading_streak += 1
                    else:
                        user.reading_streak = 1
                    user.last_read_date = today_str
                    await user.save()
    else:
        doc = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "writing_id": req.writing_id,
            "writing_title": req.writing_title,
            "category": req.category,
            "word_count": req.word_count,
            "read_date": today_str,
            "completed_at": now.isoformat()
        }
        db_manager._memory_store["reading_activities"].insert(0, doc)
        
        if current_user:
            for u in db_manager._memory_store["users"]:
                if str(u.get("id")) == user_id or str(u.get("_id")) == user_id:
                    last_date = u.get("last_read_date")
                    yesterday_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
                    if last_date != today_str:
                        if last_date == yesterday_str:
                            u["reading_streak"] = u.get("reading_streak", 0) + 1
                        else:
                            u["reading_streak"] = 1
                        u["last_read_date"] = today_str
                    break
        db_manager._save_embedded_store()

    return {
        "success": True,
        "message": f"Congratulations! You finished reading '{req.writing_title}'!",
        "read_date": today_str
    }

@router.get("/achievements", response_model=ReadingStatsOut)
async def get_achievements(current_user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = current_user["id"] if current_user else "anonymous_guest"
    today_str = get_today_str()
    seven_days_ago = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")

    activities = []
    streak_days = current_user.get("reading_streak", 0) if current_user else 0
    last_read_date = current_user.get("last_read_date") if current_user else None

    if db_manager.is_connected_to_mongo:
        docs = await ReadingActivity.find(ReadingActivity.user_id == user_id).sort(-ReadingActivity.completed_at).to_list()
        for d in docs:
            activities.append({
                "writing_id": d.writing_id,
                "writing_title": d.writing_title,
                "category": d.category,
                "word_count": d.word_count,
                "read_date": d.read_date,
                "completed_at": d.completed_at.isoformat()
            })
    else:
        activities = [
            a for a in db_manager._memory_store["reading_activities"]
            if a.get("user_id") == user_id or (user_id == "anonymous_guest" and a.get("user_id") == "anonymous_guest")
        ]

    # Calculate statistics
    today_count = sum(1 for a in activities if a.get("read_date") == today_str)
    
    # Last 7 days counts
    last_7_days_activities = [a for a in activities if a.get("read_date", "") >= seven_days_ago]
    weekly_total = len(last_7_days_activities)
    weekly_average = round(weekly_total / 7.0, 1)
    total_completed = len(activities)

    # Badges calculation
    badges = [
        BadgeOut(
            id="badge_first",
            name="First Step",
            description="Completed your first reading",
            icon="🌱",
            unlocked=total_completed >= 1,
            progress=f"{min(total_completed, 1)}/1"
        ),
        BadgeOut(
            id="badge_curious",
            name="Curious Explorer",
            description="Finished 3 writings",
            icon="🔍",
            unlocked=total_completed >= 3,
            progress=f"{min(total_completed, 3)}/3"
        ),
        BadgeOut(
            id="badge_bookworm",
            name="Avid Reader",
            description="Finished 7 writings",
            icon="📚",
            unlocked=total_completed >= 7,
            progress=f"{min(total_completed, 7)}/7"
        ),
        BadgeOut(
            id="badge_streak",
            name="Consistency Champion",
            description="Maintained a 3-day reading streak",
            icon="🔥",
            unlocked=streak_days >= 3,
            progress=f"{streak_days}/3 days"
        ),
        BadgeOut(
            id="badge_scholar",
            name="Master Scholar",
            description="Completed 15 readings across categories",
            icon="🎓",
            unlocked=total_completed >= 15,
            progress=f"{min(total_completed, 15)}/15"
        ),
    ]

    return ReadingStatsOut(
        today_count=today_count,
        weekly_total=weekly_total,
        weekly_average=weekly_average,
        total_completed=total_completed,
        streak_days=streak_days,
        last_read_date=last_read_date,
        badges=badges,
        recent_history=activities[:20]
    )
