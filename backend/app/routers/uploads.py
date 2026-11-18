import io
import json
import os
import re
import xml.etree.ElementTree as ET
import zipfile
from fastapi import APIRouter, File, UploadFile, HTTPException, status

from backend.app.config import settings

router = APIRouter(prefix="/api/uploads", tags=["File Uploads"])

def extract_docx_text(file_bytes: bytes) -> str:
    """Extracts raw text from a .docx file using built-in zipfile and XML parsing."""
    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            xml_content = z.read("word/document.xml")
            tree = ET.fromstring(xml_content)
            # Find all w:t text nodes
            ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
            paragraphs = []
            for p in tree.iter(f"{{{ns['w']}}}p"):
                texts = [node.text for node in p.iter(f"{{{ns['w']}}}t") if node.text]
                if texts:
                    paragraphs.append("".join(texts))
            return "\n\n".join(paragraphs)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse .docx file: {str(e)}"
        )

@router.post("")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_document.txt"
    _, ext = os.path.splitext(filename.lower())

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}."
        )

    # Read bytes with size verification
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_BYTES:
        max_mb = settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {max_mb:.1f} MB."
        )

    extracted_text = ""
    suggested_title = os.path.splitext(filename)[0].replace("-", " ").replace("_", " ").title()

    if ext in [".txt", ".md"]:
        try:
            extracted_text = contents.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = contents.decode("latin-1")
    elif ext == ".docx":
        extracted_text = extract_docx_text(contents)
    elif ext == ".json":
        try:
            data = json.loads(contents.decode("utf-8"))
            if isinstance(data, dict):
                extracted_text = data.get("content") or data.get("text") or data.get("body") or json.dumps(data, indent=2)
                if "title" in data and isinstance(data["title"], str):
                    suggested_title = data["title"]
            else:
                extracted_text = json.dumps(data, indent=2)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")

    extracted_text = extracted_text.strip()
    if not extracted_text:
        raise HTTPException(status_code=400, detail="The uploaded document appears to be empty.")

    # Infer category if possible
    lower_name = filename.lower()
    inferred_category = "stories"
    if "letter" in lower_name:
        inferred_category = "letters"
    elif "article" in lower_name:
        inferred_category = "articles"
    elif "email" in lower_name:
        inferred_category = "emails"

    words = len(extracted_text.split())

    return {
        "filename": filename,
        "title": suggested_title,
        "category": inferred_category,
        "content": extracted_text,
        "word_count": words,
        "file_size_bytes": len(contents),
        "message": f"Successfully parsed '{filename}' ({words} words)."
    }
