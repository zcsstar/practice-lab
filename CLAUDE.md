# Practice Lab — project notes for Claude

## What this is
A single-file web app that generates real exam-style practice questions for kids,
marks them, explains answers, and tracks mistakes for revision. Built for a
family (multiple children), starting with NZ maths (ICAS primary + Rangitoto
College extension), but generalised to any country / subject / exam / level.

**Everything lives in [index.html](index.html)** — one self-contained file, no
build step, no dependencies installed locally. It runs by double-clicking the
file or hosting it statically (GitHub Pages). Setup instructions for the user
are in [SETUP.md](SETUP.md).

## Hard constraints (do not break these)
- **Stay a single static file.** No bundler, no framework, no `npm install`, no
  server. Vanilla JS + CDN libraries only. It must keep working when opened as a
  local `file://` and when hosted on GitHub Pages.
- **No secrets in the repo.** API keys / EmailJS keys / OAuth IDs are entered by
  the user at runtime and stored in `localStorage` only. `index.html` is safe to
  commit publicly. `exportData()` strips nothing sensitive except it never
  includes the live API key in backups.
- **Keep it kid-usable and touch-friendly.** Large tap targets, responsive,
  minimal text. Modern but not childish.

## Architecture (all inside the one `<script>`)
- **CFG** — config object in `localStorage` key `practicelab.config.v2`
  (migrates from `.v1`). Holds provider/key/model, profiles, email + drive
  settings, `webSearch`, and `examContext` (per-exam saved context text).
- **IndexedDB** (`practicelab`, v2), three stores:
  - `attempts` — every completed practice (full question + result snapshot)
  - `review` — wrong/unsure questions for spaced revision (`mastered` after 2
    correct re-answers)
  - `refs` — uploaded reference papers (base64 + extracted text + tags)
  - All records are tagged with `profileId` and filtered by the active profile.
- **Profiles** — `CFG.profiles[]` + `activeProfileId`. Header chip switches
  student; each has isolated attempts/review. Each profile may carry
  `defaults` (saved practice settings); `viewSetup()` pre-fills from them and
  `saveDefaults()` writes them back.
- **Login gate** — `AUTH` block at the very top of the `<script>` (easy to edit).
  Per-person `{name, hash}` where `hash` = SHA-256 of `'practicelab::'+password`
  (helper `plHash()` is exposed on `window` for generating hashes in the
  console). Gate is active only when `AUTH.enabled && some user has a hash`, so
  the shipped file is open until the user adds hashes. On success the matched
  name is stored in `localStorage[AUTH_KEY]` and mapped to a profile
  (`applyAuthedProfile`). `boot()` shows `viewLogin()` before `startApp()` when
  gated. Client-side only — deterrent, not real auth; no secrets live in the repo.
- **AI layer** — `buildPrompt()` builds the instruction; `generateQuestions()`
  dispatches to `callGemini` / `callOpenAICompatible` / `callClaude`. All three
  are browser-direct (Claude needs `anthropic-dangerous-direct-browser-access`).
  - Gemini is the default (free tier). It supports **web-search grounding**
    (`tools:[{google_search:{}}]`) when no past papers are attached, and
    **multimodal attachments** (PDFs + images sent inline).
  - Reference papers: PDF/text are extracted to text (pdf.js, lazy-loaded) and
    injected into the prompt for ALL providers; raw files are additionally sent
    inline to Gemini, images inline to OpenAI/Claude.
  - When search is on, JSON mime-type is dropped (incompatible) and we rely on
    `parseQuestions()`'s tolerant JSON extraction.
- **Marking** — `gradeAnswer()`: MC by index; numeric by tolerant numeric match;
  short answers that don't match become `review` (self-check toggle on results).
- **Views** — `viewHome/Setup/Run/Results/Review/History/Settings/Profiles/Refs`.
  `show(node)` swaps `#app` and re-runs KaTeX. No router; functions call each other.
- **Email** — EmailJS (`buildSummary` → `sendSummaryEmail`) on submit. Template
  receives `summary_html`, `summary_text`, `to_email`, `subject`, `student_name`.
  The summary lists every wrong/self-check/flagged question with the student's
  answer, the correct answer and the explanation; `plainMath()` strips LaTeX so
  it reads cleanly in email (KaTeX doesn't render in mail clients).
- **Design** — warm "Claude-style" theme (cream `#faf9f5` canvas, coral `#cc785c`
  accent, serif headings at weight 500) per `design/DESIGN-GUIDELINES.md`. Colours
  are CSS variables in `:root`; keep coral for primary actions only.
- **Drive sync** — optional; Google Identity token client + Drive `appDataFolder`
  REST. Merge-on-id (no conflict resolution beyond "keep both / first wins").
  Only works on an https origin. `scheduleDriveSync()` debounces writes.

## Conventions
- Tiny DOM helper `el(tag, attrs, ...children)`; `$`/`$$` for queries. Keep using
  these rather than introducing a framework.
- All maths uses `$...$` LaTeX; KaTeX auto-render runs via `renderMath(scope)`
  after every `show()`. New views with maths must be inside `show()` or call
  `renderMath` themselves.
- User-entered HTML is always `esc()`-aped before insertion.

## Verifying changes
There are no automated tests. To verify:
1. `python -m http.server 8744` in this dir, open `http://localhost:8744/index.html`.
2. JS syntax check without a browser:
   `node -e "const fs=require('fs');const m=[...fs.readFileSync('index.html','utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');new Function(m);console.log('OK')"`
3. The app needs an AI key to generate; use **Settings → Test connection**.

## Known limitations / future ideas
- Short-answer auto-marking is lenient; ambiguous ones fall back to self-check.
- Drive merge is last-writer-naive per record id; fine for single-family use.
- Ideas not yet built: AI-graded free-text answers, "generate similar" from a
  weak topic in review, printable/PDF worksheet mode, per-subject exam presets
  beyond maths.
