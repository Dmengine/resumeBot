import { FormEvent, useMemo } from "react";

interface FileUploadProps {
  isLoading: boolean;
  error: string;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: FormEvent) => void;
  file: File | null;
}

export default function FileUpload({ isLoading, error, onFileChange, onSubmit, file }: FileUploadProps) {
  const fileLabel = useMemo(() => {
    if (!file) return "Upload your resume (PDF or TXT)";
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
  }, [file]);

  return (
    <section className="panel">
      <form onSubmit={onSubmit}>
        <label className="upload">
          <input
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />
          <span>{fileLabel}</span>
        </label>

        <button disabled={isLoading} type="submit">
          {isLoading ? "Analyzing resume..." : "Generate Feedback"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
