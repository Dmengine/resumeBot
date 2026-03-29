#!/usr/bin/env python3
"""Simple local resume checker (bonus script for ResumeBot assignment)."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

ACTION_VERBS = {
    "built",
    "created",
    "designed",
    "developed",
    "drove",
    "implemented",
    "improved",
    "increased",
    "launched",
    "led",
    "optimized",
    "reduced",
    "streamlined",
}


def read_resume(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    return path.read_text(encoding="utf-8", errors="ignore")


def analyze(text: str) -> dict[str, object]:
    words = re.findall(r"\b\w+\b", text)
    bullets = [line.strip() for line in text.splitlines() if line.strip().startswith(("-", "*", "•"))]
    lower_words = [w.lower() for w in words]

    verb_hits = sum(1 for w in lower_words if w in ACTION_VERBS)
    numeric_hits = len(re.findall(r"\b\d+(?:\.\d+)?%?\b", text))
    section_hits = {
        "education": bool(re.search(r"\beducation\b", text, flags=re.IGNORECASE)),
        "experience": bool(re.search(r"\b(experience|employment|work history)\b", text, flags=re.IGNORECASE)),
        "skills": bool(re.search(r"\bskills\b", text, flags=re.IGNORECASE)),
        "projects": bool(re.search(r"\bprojects?\b", text, flags=re.IGNORECASE)),
    }

    suggestions: list[str] = []
    if len(words) < 250:
        suggestions.append("Resume appears very short; add more measurable impact and context.")
    if len(words) > 1000:
        suggestions.append("Resume appears long; consider trimming to the most relevant impact.")
    if verb_hits < 8:
        suggestions.append("Use more strong action verbs at the start of bullet points.")
    if numeric_hits < 5:
        suggestions.append("Add more quantified achievements (%, $, time saved, users, revenue).")
    if len(bullets) < 6:
        suggestions.append("Use more concise bullet points for experience and projects.")
    for section, exists in section_hits.items():
        if not exists:
            suggestions.append(f"Consider adding a clear '{section.title()}' section.")

    if not suggestions:
        suggestions.append("Great baseline structure. Next, tailor keywords to each target role.")

    return {
        "word_count": len(words),
        "bullet_count": len(bullets),
        "action_verb_hits": verb_hits,
        "quantified_achievement_hits": numeric_hits,
        "sections": section_hits,
        "suggestions": suggestions,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze a TXT resume quickly.")
    parser.add_argument("resume_path", type=Path, help="Path to a .txt resume file")
    args = parser.parse_args()

    text = read_resume(args.resume_path)
    report = analyze(text)

    print("Resume Quick Check")
    print("=" * 40)
    print(f"Words: {report['word_count']}")
    print(f"Bullets: {report['bullet_count']}")
    print(f"Action verb hits: {report['action_verb_hits']}")
    print(f"Quantified achievement hits: {report['quantified_achievement_hits']}")
    print("Sections found:")
    for section, present in report["sections"].items():
        print(f"  - {section.title()}: {'Yes' if present else 'No'}")

    print("\nSuggestions:")
    for item in report["suggestions"]:
        print(f"  - {item}")


if __name__ == "__main__":
    main()
