import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from backend.app.database import db_manager
from backend.app.models.user import User, UserLogin, UserOut, UserRegister, TokenResponse
from backend.app.services.auth import create_access_token, decode_access_token, get_password_hash, verify_password

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user_optional(token: str = Depends(oauth2_scheme)) -> dict | None:
    if not token:
        return None
    token_data = decode_access_token(token)
    if not token_data or not token_data.user_id:
        return None
        
    if db_manager.is_connected_to_mongo:
        user = await User.get(token_data.user_id)
        if user:
            return {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "created_at": user.created_at,
                "reading_streak": user.reading_streak,
                "last_read_date": user.last_read_date
            }
    else:
        for u in db_manager._memory_store["users"]:
            if str(u.get("id")) == token_data.user_id or str(u.get("_id")) == token_data.user_id:
                return {
                    "id": str(u.get("id", u.get("_id"))),
                    "email": u["email"],
                    "full_name": u["full_name"],
                    "role": u.get("role", "user"),
                    "created_at": u.get("created_at"),
                    "reading_streak": u.get("reading_streak", 0),
                    "last_read_date": u.get("last_read_date")
                }
    return None

async def get_current_user_required(user: dict = Depends(get_current_user_optional)) -> dict:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in to access your private vault.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/register", response_model=TokenResponse)
async def register(req: UserRegister):
    email = req.email.lower().strip()
    
    # Check if user already exists
    if db_manager.is_connected_to_mongo:
        existing = await User.find_one(User.email == email)
        if existing:
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
        
        hashed = get_password_hash(req.password)
        new_user = User(
            email=email,
            hashed_password=hashed,
            full_name=req.full_name.strip(),
            created_at=datetime.utcnow(),
            reading_streak=0
        )
        await new_user.insert()
        user_out = UserOut(
            id=str(new_user.id),
            email=new_user.email,
            full_name=new_user.full_name,
            role=new_user.role,
            created_at=new_user.created_at,
            reading_streak=new_user.reading_streak,
            last_read_date=new_user.last_read_date
        )
    else:
        for u in db_manager._memory_store["users"]:
            if u["email"].lower() == email:
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
        
        user_id = str(uuid.uuid4())
        hashed = get_password_hash(req.password)
        now = datetime.utcnow()
        doc = {
            "id": user_id,
            "_id": user_id,
            "email": email,
            "hashed_password": hashed,
            "full_name": req.full_name.strip(),
            "role": "user",
            "created_at": now.isoformat(),
            "reading_streak": 0,
            "last_read_date": None
        }
        db_manager._memory_store["users"].append(doc)
        db_manager._save_embedded_store()
        user_out = UserOut(
            id=user_id,
            email=email,
            full_name=req.full_name.strip(),
            role="user",
            created_at=now,
            reading_streak=0,
            last_read_date=None
        )

    token = create_access_token(data={"sub": user_out.id, "email": user_out.email})
    return TokenResponse(access_token=token, token_type="bearer", user=user_out)

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLogin):
    email = req.email.lower().strip()
    
    if db_manager.is_connected_to_mongo:
        user = await User.find_one(User.email == email)
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        user_out = UserOut(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            created_at=user.created_at,
            reading_streak=user.reading_streak,
            last_read_date=user.last_read_date
        )
    else:
        matched = None
        for u in db_manager._memory_store["users"]:
            if u["email"].lower() == email:
                matched = u
                break
        if not matched or not verify_password(req.password, matched["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        
        user_out = UserOut(
            id=str(matched.get("id", matched.get("_id"))),
            email=matched["email"],
            full_name=matched["full_name"],
            role=matched.get("role", "user"),
            created_at=datetime.fromisoformat(matched["created_at"]) if isinstance(matched["created_at"], str) else matched["created_at"],
            reading_streak=matched.get("reading_streak", 0),
            last_read_date=matched.get("last_read_date")
        )

    token = create_access_token(data={"sub": user_out.id, "email": user_out.email})
    return TokenResponse(access_token=token, token_type="bearer", user=user_out)

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user_required)):
    return UserOut(**current_user)
