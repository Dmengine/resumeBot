import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import { extractResumeText } from "../utils/fileParser";
import { getResumeFeedback, ResumeFeedback } from "../services/resumeService";

interface OpenRouterErrorBody {
  error?: { message?: string };
}

function extractAxiosErrorMessage(err: AxiosError): string {
  const body = err.response?.data as OpenRouterErrorBody | undefined;
  return body?.error?.message || err.message;
}

/**
 * GET /api/health
 * Returns a simple health-check payload.
 */
export function healthCheck(_req: Request, res: Response): void {
  res.json({ ok: true, service: "ResumeBot API" });
}

/**
 * POST /api/resume-feedback
 * Accepts a multipart resume file, extracts the text, and returns AI-generated feedback.
 */
export async function uploadResume(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Please upload a resume file (pdf or txt)." });
      return;
    }

    let resumeText: string;
    try {
      resumeText = await extractResumeText(req.file.buffer, req.file.mimetype, req.file.originalname);
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : "Failed to parse file.";
      res.status(400).json({ error: message });
      return;
    }

    if (!resumeText) {
      res.status(400).json({ error: "No readable text found in the uploaded resume." });
      return;
    }

    let feedback: ResumeFeedback;
    try {
      feedback = await getResumeFeedback(resumeText);
    } catch (aiError) {
      if (axios.isAxiosError(aiError)) {
        const message = extractAxiosErrorMessage(aiError);
        res.status(502).json({ error: `AI service error: ${message}` });
        return;
      }
      const message = aiError instanceof Error ? aiError.message : "Unexpected AI error.";
      res.status(500).json({ error: message });
      return;
    }

    res.json({
      feedback: {
        summary: feedback.summary || "Could not parse AI response.",
        strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
        improvements: Array.isArray(feedback.improvements) ? feedback.improvements : [],
        rewrittenBullet: feedback.rewrittenBullet || "",
        atsKeywords: Array.isArray(feedback.atsKeywords) ? feedback.atsKeywords : [],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    res.status(500).json({ error: `Failed to generate feedback: ${message}` });
  }
}
