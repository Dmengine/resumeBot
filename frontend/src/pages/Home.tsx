import { FormEvent, useState } from "react";
import FeedbackResult from "../components/FeedbackResult";
import FileUpload from "../components/FileUpload";
import { Feedback } from "../types/feedback";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setError("");
    setFeedback(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_BASE}/api/resume-feedback`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json() as { feedback?: Feedback; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume feedback.");
      }

      setFeedback(data.feedback as Feedback);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />
      <main className="shell">
        <section className="hero">
          <p className="eyebrow">ResumeBot</p>
          <h1>Drop your resume, get interview-ready feedback in seconds.</h1>
          <p className="sub">
            Smart AI review with strengths, improvement ideas, one rewritten bullet, and ATS keyword
            suggestions.
          </p>
        </section>

        <FileUpload
          file={file}
          isLoading={isLoading}
          error={error}
          onFileChange={setFile}
          onSubmit={onSubmit}
        />

        {feedback ? <FeedbackResult feedback={feedback} /> : null}
      </main>
    </div>
  );
}
