# Luna Writer & Masterclass 🌙✨

**Luna Writer & Masterclass** is a modern, full-stack language evolution and creative writing platform. It is designed to take aspiring readers and writers on a transformative journey: absorbing rich vocabulary through curated literature, practicing with distraction-free auto-save studio tools, receiving Cambridge CEFR evaluations from Google Gemini AI, and unlocking publication to the community showcase.

---

## 🌟 Key Features

1. **Four Dedicated Reading Rooms:**
   - 📖 **Short Stories & Fiction:** 10 diverse stories ranging from Beginner (A1) to Mastery (C2).
   - 📰 **Articles & Essays:** 8 structured non-fiction pieces covering science, culture, and life habits.
   - 📮 **Letters & Notes:** 8 formal and informal correspondences, complaints, and invitations.
   - ✉️ **Modern Emails:** 8 practical workplace and everyday communications.
2. **Interactive 3D Reader Canvas:**
   - Click or highlight any word in a text to instantly hear pronunciation and click **"Save to Word Bank"**.
   - **🤖 AI Review & Learning Highlights:** Dissects narrative pacing, structure, and techniques aspiring writers can borrow.
   - **✅ Finished Reading Button:** Saves reading completion to the persistent database and fires celebratory confetti!
3. **Writing Studio & Publishing Milestone:**
   - Choose format: **Story**, **Article**, **Email**, or **Letter**.
   - **Auto-Save:** Saves drafts automatically every few seconds to your private vault.
   - **Document Upload:** Import `.docx` Word documents, `.md` Markdown, or `.txt` text files.
   - **Smart Publishing Gate:** Gemini AI assesses whether your piece reaches the **A1 standard or higher**. If approved, it is published to the community showcase! If not yet ready, a friendly alert lets you save it in your private folder to keep practicing.
4. **Achievements & Reading Habits (`/achievements`):**
   - **Today's Reads:** Automatically rolls over and tracks a fresh daily tally after 12:00 AM midnight.
   - **Weekly Statistics:** 7-day average and total completed pieces.
   - **Reading Streaks & Badges:** Consistency rewards from *First Step* to *Master Scholar*.
5. **3D Visual Atmospheres (7 Presets in Palette Drawer):**
   - 🌌 **Modern Midnight:** Deep cosmic obsidian with glowing moonlit violet.
   - ⚡ **Cyberpunk Holo-Writer:** Neon cyan laser, electric magenta, and dark grid depth.
   - ☕ **Oxford Vintage Study:** Antique parchment, burnished leather, and gold leaf.
   - 🍃 **Emerald Sanctuary:** Calming jade moss and botanical glassmorphism.
   - 🌅 **Synthwave Sunset:** Twilight plum, neon coral, and warm horizon glow.
   - 🕊️ **Porcelain Luxury:** Architectural white, frosted glass, and royal sapphire.
   - 👑 **Solar Sovereign:** Imperial bronze, sovereign gold, and royal prestige.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** React 19 with TypeScript, Vite 8, Tailwind CSS, shadcn/ui (Radix UI primitives), Lucide React icons, and Motion for React.
- **Backend:** Python with FastAPI and Pydantic v2.
- **Database:** MongoDB with Beanie ODM and asynchronous PyMongo (`AsyncMongoClient`), plus high-fidelity persistent fallback storage.
- **Authentication:** `python-jose[cryptography]` for JWT access tokens and Passlib with bcrypt for password encryption.
- **AI Engine:** Google Gemini 2.5 Flash via `google-generativeai` with resilient offline Cambridge heuristic fallback.

---

## 🚀 How to Run on Your Computer

### Prerequisites
- Python 3.10+ (Python virtual environment `.venv` is included)
- Node.js v18+ and npm

### 1. Start the Unified Server (Backend & Frontend)
Open your terminal in this project folder and run:
```bash
.\.venv\Scripts\python run.py
```
Then open your browser and visit:
👉 **http://127.0.0.1:8000**

### 2. Run the Automated Test Suite
To verify that all database queries, AI evaluations, authentication, and endpoints pass:
```bash
.\.venv\Scripts\python test_suite.py
```

### 3. (Optional) Run Frontend in Hot-Reload Development Mode
If you wish to edit frontend React components with live hot-reloading:
```bash
cd frontend
npm.cmd run dev
```
Then visit **http://localhost:5173**.

---

## 🔐 Configuration & Environment Variables

Copy `.env.example` to `.env` to configure your environment settings:

```env
# Application Settings
HOST=0.0.0.0
PORT=8000
DEBUG=false

# MongoDB Database Connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=luna_writer

# JWT Security
JWT_SECRET_KEY=change_this_to_a_random_secret_in_production

# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL_NAME=gemini-2.5-flash
```

---

## ☁️ Deployment to Render & GitHub

This project is configured with `render.yaml` for one-click deployment:
- **Repository:** https://github.com/kirtheesh13/luna-writer
- **Branch:** `main`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free Plan supported
