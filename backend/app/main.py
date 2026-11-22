import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.database import db_manager
from backend.app.routers import auth, evaluation, reading, uploads, vocabulary, writings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("luna_writer")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Luna Writer & Masterclass API...")
    await db_manager.connect()
    yield
    logger.info("Shutting down Luna Writer & Masterclass API...")
    await db_manager.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local Vite development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(writings.router)
app.include_router(reading.router)
app.include_router(evaluation.router)
app.include_router(vocabulary.router)
app.include_router(uploads.router)

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "database": "mongodb_beanie" if db_manager.is_connected_to_mongo else "embedded_persistent",
        "gemini_ai": bool(settings.GEMINI_API_KEY)
    }

# Mount Frontend in Production if built
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(FRONTEND_DIST / "index.html")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            return None
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
