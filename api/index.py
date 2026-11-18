import sys
from pathlib import Path

# Add project root to sys.path so 'backend' imports work in Vercel serverless environment
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app

# Export app for Vercel
app = app
