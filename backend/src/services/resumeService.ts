import axios from "axios";


export interface ResumeFeedback {
    summary: string;
    strengths: string[];
    improvements: string[];
    rewrittenBullet: string;
    atsKeywords: string[];
}

const FALLBACK_FEEDBACK: ResumeFeedback = {
    summary: "Could not parse AI response. Please review manually.",
    strengths: [],
    improvements: [],
    rewrittenBullet: "",
    atsKeywords: []
}

export async function getResumeFeedback(resumeText: string): Promise<ResumeFeedback> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct:free";

    if (!apiKey) {
        throw new Error("Missing OpenRouter API key. Please set OPENROUTER_API_KEY in your environment variables.");
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
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            timeout: 30000,
        }
    );

    const messageContent = aiResponse.data?.choices?.[0]?.message?.content;
    if(!messageContent || typeof messageContent !== "string") {
        throw new Error('AI provider returned an empty response. Please try again later.');
    }

    return parseFeedback(messageContent);
}

function parseFeedback(content: string): ResumeFeedback {
    try {
        return JSON.parse(content) as ResumeFeedback;
    } catch {
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");
        if(start !== -1 && end > start) {
            return JSON.parse(content.slice(start, end + 1)) as ResumeFeedback
        }
        return FALLBACK_FEEDBACK
    }
}