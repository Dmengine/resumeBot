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

## Loom Video Script (3-5 mins)

Use the outline below as a guide when recording. Each segment has a suggested time to help you stay within the 3-5 minute window.

### [0:00 – 0:30] Introduction
- Greet the interviewer and introduce yourself briefly.
- State what you built: *"I built ResumeBot — a full-stack AI-powered resume reviewer where users upload a PDF or TXT resume and get structured, actionable feedback in seconds."*
- Mention the tech stack at a high level: Node.js/Express/TypeScript backend, React/Vite/TypeScript frontend, and a bonus Python script.

### [0:30 – 1:15] Repo Structure Walk-through
- Open the repository in your editor and point out the three main areas:
  - `backend/` — Express API with a file-parser utility, resume service (OpenRouter AI call), and controller.
  - `frontend/` — React app with a file-upload component and a feedback-result component.
  - `scripts/resume_checker.py` — offline Python checker that inspects word count, action verbs, quantified achievements, and required sections.
- Briefly show `backend/src/services/resumeService.ts` to highlight how the AI prompt is constructed and how the JSON response is parsed.

### [1:15 – 2:30] Live Demo
- Start the backend (`npm run dev` inside `backend/`) and the frontend (`npm run dev` inside `frontend/`).
- Open `http://localhost:5173` in the browser.
- Upload a sample resume (PDF or TXT).
- Walk through each section of the returned feedback while it renders on screen:
  - **Summary** — concise paragraph overview.
  - **Strengths** — three highlights from the resume.
  - **Improvements** — four actionable suggestions.
  - **Rewritten Bullet** — one weak bullet rewritten in STAR/impact format.
  - **ATS Keywords** — eight relevant keywords to improve applicant-tracking-system scores.

### [2:30 – 3:15] Bonus Python Script
- Switch to a terminal and run:
  ```bash
  python3 scripts/resume_checker.py /path/to/sample_resume.txt
  ```
- Point out what the script checks: word count, bullet count, action-verb frequency, quantified achievements, and presence of standard sections (Education, Experience, Skills, Projects).
- Show how the suggestions it prints complement the AI feedback from the web app.

### [3:15 – 3:45] Architecture & Design Decisions
- Explain why you chose OpenRouter (model-agnostic, easy key management) and how the service retries with the default model (`gpt-4o-mini`) when a custom model returns a "No endpoints found" error.
- Mention the strict JSON-only prompt design and the `parseFeedback` fallback that gracefully handles markdown-wrapped JSON from some providers.

### [3:45 – 4:00] Closing
- Summarize what you would add next (e.g., authentication, resume history, side-by-side diff view for the rewritten bullet).
- Thank the interviewer and invite any questions.

## Submission

1. Push this project to a GitHub repository.
2. Record a 3-5 minute Loom walkthrough.
3. Reply with:
   - GitHub repo link
   - Loom link
