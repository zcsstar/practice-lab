# 🧪 Practice Lab

A single-file web app that generates **real exam-style practice questions** for
kids, times them, marks them, explains every answer, and tracks mistakes for
revision. Built for a family, starting with NZ maths (ICAS primary + Rangitoto
College extension), but works for any **country / subject / exam / level**.

No installation, no build step — it's one `index.html`. Open it locally or host
it on GitHub Pages and use it from any device (laptop, iPad, phone).

## Features

- ✍️ **AI-generated questions** — Google Gemini (free tier) by default; OpenAI,
  Claude, or any OpenAI-compatible API also supported.
- 🎯 **Targeted** — pick country, subject, exam (ICAS / Rangitoto extension /
  NCEA / general) and year level; choose topics, difficulty, count and timer.
- 📄 **Real past papers** — upload genuine past papers (PDF / image / text); the
  AI matches their style. No papers? Gemini web-search grounding fills in.
- ⏱️ **Exam runner** — countdown timer, question navigator, edit answers, 🚩 flag
  unsure questions, submit at the end.
- ✅ **Marking + learning** — score, correct answers, and kid-friendly
  step-by-step explanations (maths rendered with KaTeX).
- 🔁 **Mistake tracking** — wrong/unsure questions saved for spaced revision.
- 👦👧 **Multiple students** — separate progress per child, with saved practice
  defaults.
- 📧 **Email summaries** — a recap (including the questions to go over) is emailed
  to a parent after each practice.
- 🔒 **Password login** — optional family-only access gate.
- ☁️ **Sync** — optional Google Drive sync across devices; plus export/import.

## Getting started

See **[SETUP.md](SETUP.md)** — get a free Gemini key (~2 min), optionally set up
email, login and Drive sync, then publish to GitHub Pages.

## For developers / AI agents

See **[CLAUDE.md](CLAUDE.md)** for architecture and constraints, and
**[design/DESIGN-GUIDELINES.md](design/DESIGN-GUIDELINES.md)** for the UI design
system.
