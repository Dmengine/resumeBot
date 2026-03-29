import { PDFParse } from "pdf-parse";

/**
 * Extracts plain text from an uploaded resume buffer.
 * Supports PDF and plain-text (TXT) files.
 */
export async function extractResumeText(buffer: Buffer, mimetype: string, filename: string): Promise<string> {
  if (mimetype.includes("pdf")) {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return (parsed.text || "").trim();
  }

  if (mimetype.includes("text") || filename.toLowerCase().endsWith(".txt")) {
    return buffer.toString("utf-8").trim();
  }

  throw new Error("Only PDF and TXT files are supported.");
}
