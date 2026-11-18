import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.database import db_manager
from backend.app.routers import (
    writings,
    reviews,
    bookmarks,
    uploads,
    settings as settings_router,
    status as status_router,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("luna_writer")

FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Luna Writer backend...")
    await db_manager.connect()
    yield
    logger.info("Shutting down Luna Writer backend...")

app = FastAPI(
    title="Luna Writer API",
    description=(
        "Full-stack API for reading English writing across stories, letters, articles, and emails, "
        "managing drafts, and evaluating English text suitability for Cambridge B1 (PET) learners."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(writings.router)
app.include_router(reviews.router)
app.include_router(bookmarks.router)
app.include_router(uploads.router)
app.include_router(settings_router.router)
app.include_router(status_router.router)

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "database_mode": "Live MongoDB" if db_manager.is_live_mongo else "Embedded JSON MongoDB"
    }

# Mount static frontend directories
if FRONTEND_DIR.exists():
    css_dir = FRONTEND_DIR / "css"
    js_dir = FRONTEND_DIR / "js"
    if css_dir.exists():
        app.mount("/css", StaticFiles(directory=str(css_dir)), name="css")
    if js_dir.exists():
        app.mount("/js", StaticFiles(directory=str(js_dir)), name="js")

# Serve SPA index.html for all page routes
CATEGORY_ROUTES = ["/stories", "/letters", "/articles", "/emails", "/studio", "/my-writing", "/settings"]

@app.get("/")
async def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "Frontend index.html not found"}

@app.get("/{full_path:path}")
async def catch_all_spa(full_path: str):
    # If API or docs route, don't interfere
    if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
        return {"error": "Endpoint not found"}
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": f"Path /{full_path} not found"}
