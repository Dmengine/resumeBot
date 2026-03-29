import { FormEvent, useMemo, useState } from "react";

type Feedback = {
  summary: string;
  strengths: string[];
  improvements: string[];
  rewrittenBullet: string;
  atsKeywords: string[];
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const fileLabel = useMemo(() => {
    if (!file) return "Upload your resume (PDF or TXT)";
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
  }, [file]);

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

      const data = await response.json();
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

        <section className="panel">
          <form onSubmit={onSubmit}>
            <label className="upload">
              <input
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <span>{fileLabel}</span>
            </label>

            <button disabled={isLoading} type="submit">
              {isLoading ? "Analyzing resume..." : "Generate Feedback"}
            </button>
          </form>

          {error ? <p className="error">{error}</p> : null}

          {feedback ? (
            <article className="result">
              <div className="card">
                <h2>Summary</h2>
                <p>{feedback.summary}</p>
              </div>

              <div className="grid">
                <div className="card">
                  <h3>Strengths</h3>
                  <ul>
                    {feedback.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <h3>Improvements</h3>
                  <ul>
                    {feedback.improvements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card">
                <h3>Rewritten Bullet</h3>
                <p>{feedback.rewrittenBullet}</p>
              </div>

              <div className="card">
                <h3>ATS Keywords</h3>
                <div className="tags">
                  {feedback.atsKeywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </div>
            </article>
          ) : null}
        </section>
      </main>
    </div>
  );
}
