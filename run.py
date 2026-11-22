import uvicorn
from backend.app.config import settings

if __name__ == "__main__":
    print(f"==================================================")
    print(f"  Starting Luna Writer Server...")
    print(f"  URL: http://127.0.0.1:{settings.PORT}")
    print(f"  Swagger API Docs: http://127.0.0.1:{settings.PORT}/docs")
    print(f"==================================================")
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=False
    )
