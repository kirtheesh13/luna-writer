import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Luna Writer & Masterclass"
    PROJECT_VERSION: str = "2.0.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

    # MongoDB Configuration (Beanie with AsyncMongoClient)
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "luna_writer")

    # Security & JWT (python-jose & passlib)
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "luna_masterclass_super_secret_jwt_key_2026_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # AI Integration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-2.5-flash")

    # Uploads
    MAX_UPLOAD_SIZE_BYTES: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", "5242880"))  # 5MB
    ALLOWED_EXTENSIONS: list[str] = [
        ext.strip().lower()
        for ext in os.getenv("ALLOWED_EXTENSIONS", ".txt,.md,.docx,.json").split(",")
    ]
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    DATA_DIR: Path = BASE_DIR / ".data"

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
