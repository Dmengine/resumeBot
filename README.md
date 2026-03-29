# ResumeBot

ResumeBot is a simple full-stack app where users upload a resume and receive AI-generated feedback.

## Tech Stack

- Backend: Node.js + Express + TypeScript
- Frontend: React + Vite + TypeScript
- Bonus: Python resume checker script

## Features

- Upload resume as PDF or TXT
- Parse resume text on backend
- Generate AI feedback using OpenRouter API
- Show:
  - summary
  - strengths
  - improvement suggestions
  - one rewritten impact bullet
  - ATS keywords

## Project Structure

- `backend/`: Express API
- `frontend/`: React app
- `scripts/resume_checker.py`: bonus local TXT resume checker

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
# Add your OPENROUTER_API_KEY in .env
npm install
npm run dev
```

Backend runs on `http://localhost:5050`.

### 2) Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and calls backend at `http://localhost:5050` by default.

Optional custom backend URL:

```bash
VITE_API_BASE=http://localhost:5050 npm run dev
```

## API

### `POST /api/resume-feedback`

- Content-Type: `multipart/form-data`
- Field: `resume` (`.pdf` or `.txt`)

Response:

```json
{
  "feedback": {
    "summary": "...",
    "strengths": ["..."],
    "improvements": ["..."],
    "rewrittenBullet": "...",
    "atsKeywords": ["..."]
  }
}
```

## Bonus Python Script

Run a quick offline check on a TXT resume:

```bash
python3 scripts/resume_checker.py /path/to/resume.txt
```

## Loom Video Suggestion (3-5 mins)

- Show repo structure and stack
- Run backend and frontend
- Upload a sample resume
- Explain the returned feedback sections
- Show bonus Python script output

## Submission

1. Push this project to a GitHub repository.
2. Record a 3-5 minute Loom walkthrough.
3. Reply with:
   - GitHub repo link
   - Loom link
