import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5050);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

type FeedbackResponse = {
  summary: string;
  strengths: string[];
  improvements: string[];
  rewrittenBullet: string;
  atsKeywords: string[];
};

const defaultFeedback: FeedbackResponse = {
  summary: "Could not parse AI response. Please review manually.",
  strengths: [],
  improvements: [],
  rewrittenBullet: "",
  atsKeywords: [],
};

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "ResumeBot API" });
});

app.post("/api/resume-feedback", upload.single("resume"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a resume file (pdf or txt)." });
    }

    const mimeType = req.file.mimetype;
    let resumeText = "";

    if (mimeType.includes("pdf")) {
      const parser = new PDFParse({ data: req.file.buffer });
      const parsed = await parser.getText();
      await parser.destroy();
      resumeText = (parsed.text || "").trim();
    } else if (mimeType.includes("text") || req.file.originalname.toLowerCase().endsWith(".txt")) {
      resumeText = req.file.buffer.toString("utf-8").trim();
    } else {
      return res.status(400).json({ error: "Only PDF and TXT files are supported." });
    }

    if (!resumeText) {
      return res.status(400).json({ error: "No readable text found in the uploaded resume." });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "Missing OPENROUTER_API_KEY in backend environment." });
    }

    const prompt = [
      "You are an expert resume reviewer.",
      "Analyze the resume text and return strict JSON only.",
      "Return keys exactly:",
      "summary (string, max 80 words)",
      "strengths (array of 3 concise strings)",
      "improvements (array of 4 concise actionable strings)",
      "rewrittenBullet (string, rewrite one weak bullet into impact-focused STAR style)",
      "atsKeywords (array of 8 relevant ATS keywords)",
      "No markdown, no extra keys.",
      "Resume text:",
      resumeText.slice(0, 12000),
    ].join("\n");

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const messageContent = aiResponse.data?.choices?.[0]?.message?.content;
    if (!messageContent || typeof messageContent !== "string") {
      return res.status(502).json({ error: "AI provider returned an empty response." });
    }

    let parsedFeedback: FeedbackResponse = defaultFeedback;
    try {
      parsedFeedback = JSON.parse(messageContent) as FeedbackResponse;
    } catch {
      const jsonStart = messageContent.indexOf("{");
      const jsonEnd = messageContent.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const possibleJson = messageContent.slice(jsonStart, jsonEnd + 1);
        parsedFeedback = JSON.parse(possibleJson) as FeedbackResponse;
      }
    }

    return res.json({
      feedback: {
        summary: parsedFeedback.summary || defaultFeedback.summary,
        strengths: Array.isArray(parsedFeedback.strengths) ? parsedFeedback.strengths : [],
        improvements: Array.isArray(parsedFeedback.improvements) ? parsedFeedback.improvements : [],
        rewrittenBullet: parsedFeedback.rewrittenBullet || "",
        atsKeywords: Array.isArray(parsedFeedback.atsKeywords) ? parsedFeedback.atsKeywords : [],
      },
    });
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error?.message || error.message
      : "Unexpected server error";

    return res.status(500).json({ error: `Failed to generate feedback: ${message}` });
  }
});

app.listen(PORT, () => {
  console.log(`ResumeBot API listening on http://localhost:${PORT}`);
});
