import io
import json
from pathlib import Path
from fastapi import APIRouter, File, HTTPException, UploadFile
from backend.app.config import settings

try:
    import docx
except ImportError:
    docx = None

router = APIRouter(prefix="/api/upload", tags=["Uploads"])

@router.post("")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "untitled"
    suffix = Path(filename).suffix.lower()

    if suffix not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{suffix}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    content_bytes = await file.read()
    if len(content_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size exceeds the 5MB limit.")

    stem_title = Path(filename).stem.replace("_", " ").replace("-", " ").title()
    extracted_text = ""

    if suffix in [".txt", ".md"]:
        try:
            extracted_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = content_bytes.decode("latin-1", errors="replace")

    elif suffix == ".docx":
        if not docx:
            raise HTTPException(status_code=500, detail="Word (.docx) processor not available.")
        try:
            doc = docx.Document(io.BytesIO(content_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            extracted_text = "\n\n".join(paragraphs)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not parse Word document: {str(e)}")

    elif suffix == ".json":
        try:
            data = json.loads(content_bytes.decode("utf-8"))
            if isinstance(data, dict):
                stem_title = data.get("title", stem_title)
                extracted_text = data.get("content", str(data))
            else:
                extracted_text = json.dumps(data, indent=2)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file is empty or contains no readable text.")

    return {
        "title": stem_title,
        "content": extracted_text.strip(),
        "filename": filename,
        "word_count": len(extracted_text.split())
    }
