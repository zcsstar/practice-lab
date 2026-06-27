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
- **IndexedDB** (`practicelab`, v3), four stores:
  - `attempts` — every completed practice (full question + result snapshot)
  - `review` — wrong/unsure questions for spaced revision (`mastered` after 2
    correct re-answers)
  - `refs` — uploaded reference papers (base64 + extracted text + tags)
  - `bank` — pre-generated question surplus, keyed by setup (see AI layer); cuts
    API calls by reusing one generation across many practices
  - All records are tagged with `profileId` and filtered by the active profile.
- **Profiles** — `CFG.profiles[]` + `activeProfileId`. Header chip switches
  student; each has isolated attempts/review. Each profile may carry
  `defaults` (saved practice settings); `viewSetup(mode,targetId)` pre-fills from
  the target profile and `saveDefaults()` writes them back. `mode='defaults'`
  (from Manage students → ⚙️ Defaults) edits a specific profile's defaults
  **without** changing the active profile (via `setupTarget`).
  - **Students = non-parent login users.** When the gate is on,
    `reconcileProfiles()` (run in `startApp()` and after Drive merge) seeds a
    profile per non-parent `AUTH` user and drops stray profiles (parent-named or
    legacy) that have no saved attempts. `applyAuthedProfile()` never creates a
    profile for a parent — parents land on a student and switch via the chip.
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
- **Question bank (AI-usage reduction)** — `buildPracticeSet(s,files)` is the
  entry point used by `doGenerate()`/`practiceTopic()` instead of calling
  `generateQuestions()` directly. It serves matching questions from the `bank`
  store first (0 API calls); on a miss it generates a `BANK_PREFILL` (24) batch,
  uses what's needed and banks the unused surplus (`bankAdd` de-dupes by
  `qhash`/`normQ`). The bank hub's manual pre-generate uses a bigger `BANK_DEEP`
  (40) batch. Output-token budget scales with batch size via `outTokens(count,
  cap)` (floor 16384; caps: Gemini 65536 / OpenAI 16384 / Claude 8192) so large
  batches don't truncate; `generateQuestions` passes it per provider. Bank key = `country|subject|exam|level|difficulty|style`
  (`bankKey`); `bankTake` honours selected topics strictly and rotates
  least-served-first. **Attached past papers or per-session notes always force a
  fresh generation and are NOT banked.** Daily call count lives in `localStorage`
  `practicelab.usage`; `freeDailyLimit()` is 20 for Gemini. `viewBank()` is the
  hub (usage meter, per-setup counts, manual pre-generate, clear). Bank flows
  through export/import and Drive merge like the other stores.
- **Marking** — `gradeAnswer()`: MC by index; numeric by tolerant numeric match;
  short answers that don't match become `review` (self-check toggle on results).
- **Views** — `viewHome/Setup/Run/Results/Review/History/Settings/Profiles/Refs/
  Bank/Dashboard`. `show(node)` swaps `#app` and re-runs KaTeX. No router;
  functions call each other. `viewBank` = question-bank hub; `viewDashboard` =
  parent-only all-students progress overview.
- **Explanation rendering** — `fmtExplain()` turns the stored explanation
  (plain text + `$LaTeX$` + `**bold**`/`*italic*` + numbered steps / `*` bullets)
  into readable HTML blocks, protecting `$…$` spans so KaTeX still renders them.
  Questions may carry an optional `svg` diagram (`sanitizeSvg()` strips scripts /
  external refs / handlers); rendered in runner + results.
- **Read-aloud** — `speak()` (Web Speech) reads a question/explanation aloud,
  using `plainMath()` to strip LaTeX/markdown. 🔊 buttons in runner + results.
- **Streaks / daily goal** — Home shows a 🔥 day-streak tile (`computeStreak`,
  UTC-based) and a daily-goal bar (`CFG.dailyGoal`, default 10, vs questions
  answered today). Generate-similar: `practiceTopic(topic)` builds a bank-first
  drill, surfaced from the History weak-topics list.
- **Email** — EmailJS (`buildSummary` → `sendSummaryEmail`) on submit. Template
  receives `summary_html`, `summary_text`, `to_email`, `subject`, `student_name`.
  The summary lists every wrong/self-check/flagged question with the student's
  answer, the correct answer and the explanation; `plainMath()` strips LaTeX so
  it reads cleanly in email (KaTeX doesn't render in mail clients).
- **Shared API key (KEYVAULT)** — optional parent-managed key sharing. `KEYVAULT`
  block sits next to `AUTH` at the top of the script. Holds per-user grants =
  `AES-256-GCM(apiKey, PBKDF2('plk::'+password))` (helpers `encStr`/`decStr`/
  `deriveAesKey`, base64 via `b64e`/`b64d`). Built in Settings (parent only) via
  `buildVaultInner()`. On login, `unlockSharedKey(name,password)` decrypts the
  grant and writes the key into `CFG` (persists per device, so no re-typing).
  Requires the login gate on. `isParent()` gates the key UI; non-parents see a
  locked card. Plaintext key never lives in the repo.
- **Design / theme** — iOS-style: SF system font (`-apple-system…`), iOS system
  colours (canvas `#f2f2f7`, blue `#007aff`, green/red/orange semantics), flat
  primary buttons, iOS toggle switches (`input[type=checkbox].sw`). No serif.
  References: `design/DESIGN-GUIDELINES.md` (superseded by iOS look) and
  `design/gsap-skills.md`.
- **Animation (GSAP)** — loaded from CDN. `animateIn(scope)` (called by `show()`)
  fades/rises cards on every view; results screen counts up the score and
  staggers question cards; the runner cross-fades on question swap. Transform/
  `autoAlpha` only; honours `prefers-reduced-motion` via `reduceMotion`.
- **Settings** — grouped iOS-style sections via `sec(label)`; advanced items
  (EmailJS keys, Drive, login, key sharing) live in `<details class="adv">` to
  keep the screen uncluttered. `buildAICard(parent)` / `buildVaultInner()` /
  `buildLoginInner()` build the AI + access blocks.
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
