import { Feedback } from "../types/feedback";

interface FeedbackResultProps {
  feedback: Feedback;
}
export default function FeedbackResult({ feedback }: FeedbackResultProps) {
  return (
    <article className="result">
      <div className="card">
        <h2>Summary</h2>
        <p>{feedback.summary}</p>
      </div>
      <div className="grid">
        <div className="card">
          <h3>Strengths</h3>
          <ul>
            {feedback.strengths.map((item, index) => (
              <li key={`strength-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Improvements</h3>
          <ul>
            {feedback.improvements.map((item, index) => (
              <li key={`improvement-${index}`}>{item}</li>
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
          {feedback.atsKeywords.map((keyword, index) => (
            <span key={`keyword-${index}`}>{keyword}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
