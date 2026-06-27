# Practice Lab — project notes for Claude

## What this is
A single-file web app that generates real exam-style practice questions for kids,
marks them, explains answers, and tracks mistakes for revision. Built for a
family (multiple children), starting with NZ maths (ICAS primary + Rangitoto
College extension), but generalised to any country / subject / exam / level.

The app is [index.html](index.html) plus a small number of sibling static files
(currently [parse.js](parse.js)). No build step, no dependencies installed
locally. It runs by double-clicking `index.html` or hosting it statically
(GitHub Pages). Setup instructions for the user are in [SETUP.md](SETUP.md).

## Hard constraints (do not break these)
- **Stay static — no build, no server.** No bundler, no framework, no
  `npm install`. Vanilla JS + CDN libraries only. Multiple static files are fine,
  but **only classic `<script src>` includes** (NOT ES modules / `fetch` / XHR) so
  it keeps working from a local `file://` double-click as well as GitHub Pages.
  Sibling scripts must guard against load failure where it matters.
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
    the tolerant parser.
  - `callGemini/callClaude/callOpenAICompatible` take a `maxTokens` arg;
    `generateQuestions` sizes it via `outTokens(count,cap)` (floor 16384; caps
    Gemini 65536 / OpenAI 16384 / Claude 8192) and bumps `usageBump(1)` per real
    call. It throws if the parser recovers nothing.
- **Parser** — [parse.js](parse.js) (`window.PLParse`, also a Node module so it's
  unit-tested in [parse.test.js](parse.test.js)). `PLParse.extractQuestions(raw)`
  is **bulletproof**: strips fences/prose, repairs raw LaTeX backslashes + control
  chars, and on malformed/**truncated** output walks the array object-by-object
  keeping every COMPLETE question (skips a bad one, stops at a truncated tail) —
  never throws, returns `[]` if nothing is recoverable. `parseQuestions()` in
  index.html just maps its output to the app shape (+`sanitizeSvg`).
- **Reliable large batches** — big single requests truncate (2.5-flash thinking
  budget can cut a 40-question response off mid-item). `generateMany(s,files,
  target,onProgress)` instead loops `GEN_CHUNK` (12)-sized calls, de-duping and
  tolerating partial chunks, until the target / an empty streak / an attempt cap
  (re-throws 429 only if nothing collected yet). The bank's manual pre-generate
  uses it for `BANK_DEEP` (40). Interactive misses still use ONE `generateQuestions`
  call of `BANK_PREFILL` (15, ≤ `GEN_CHUNK` so it won't truncate).
- **Question bank (AI-usage reduction)** — `buildPracticeSet(s,files)` is the
  entry point used by `doGenerate()`/`practiceTopic()` instead of calling
  `generateQuestions()` directly. It serves matching questions from the `bank`
  store first (0 API calls); on a miss it generates a `BANK_PREFILL` batch,
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
  into readable HTML blocks, protecting `$…$` spans (incl. escaped `\$` for money
  like `$\$5$`) so KaTeX still renders them. Prompt tells the model to write money
  as `$\$x$`. Questions may carry an optional `svg` diagram (`sanitizeSvg()` strips
  scripts / external refs / handlers); rendered in runner + results.
  - **`el()` escaping gotcha:** string children are inserted via `createTextNode`
    (already XSS-safe) — do NOT wrap child text in `esc()` (double-encodes, e.g.
    "Data &amp; graphs"). `esc()` is only for `{html:...}` / attribute strings.
- **Read-aloud** — `speak()` (Web Speech) reads a question/explanation aloud,
  using `plainMath()` to strip LaTeX/markdown. 🔊 buttons in runner + results.
  Settings → Read-aloud (`buildVoiceCard()`) picks the voice (`CFG.voiceURI`,
  device-dependent list from `speechSynthesis.getVoices()`, async via
  `voiceschanged`), speed (`CFG.voiceRate`) and pitch (`CFG.voicePitch`, higher =
  younger — the API has no age metadata). `voiceGender()` is a best-effort
  name-based label only.
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
1. **Parser tests:** `node parse.test.js` (covers the `parse.js` module: clean,
   fenced, truncated, malformed, control-chars, raw-LaTeX, money cases).
2. **Run it:** `python -m http.server 8744` in this dir, open
   `http://localhost:8744/index.html`.
3. **JS syntax check** without a browser (both files):
   `node -e "require('./parse.js');const fs=require('fs');const m=[...fs.readFileSync('index.html','utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');new Function('PLParse',m);console.log('OK')"`
4. The app needs an AI key to generate; use **Settings → Test connection**. For
   pure-logic checks without a key, extract the function from `index.html` in Node
   and stub its deps (see how `parse.test.js` is structured).

## Known limitations / future ideas
- Short-answer auto-marking is lenient; ambiguous ones fall back to self-check.
- Drive merge is last-writer-naive per record id; fine for single-family use.
- Ideas not yet built: AI-graded free-text answers, "generate similar" from a
  weak topic in review, printable/PDF worksheet mode, per-subject exam presets
  beyond maths.
