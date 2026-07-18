# Practice Lab — project notes for Claude

## What this is
A single-file web app that generates real exam-style practice questions for kids,
marks them, explains answers, and tracks mistakes for revision. Built for a
family (multiple children), starting with NZ maths (ICAS primary + Rangitoto
College extension), but generalised to any country / subject / exam / level.

The app is [index.html](index.html) plus a small number of sibling static files
([parse.js](parse.js), [battle.js](battle.js), [diagram.js](diagram.js)). No build step, no dependencies installed
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
  settings, `webSearch`, `examContext` (per-exam saved context text), and the
  learning toggles `verify` (double-check answers, default on), `autoDifficulty`
  (auto-apply adaptive level vs suggest, default off) and `aiGrade` (AI-mark
  written answers, default off). Also holds the sync deletion bookkeeping
  `packsDeleted`/`refsDeleted` (tombstones), `cleared` (`"store:profileId"→ts`
  for Clear-bank/Clear-history) and `blocked` (`"profileId|qhash"→ts` for the
  "remove this question everywhere" block-list) — see Drive sync.
- **IndexedDB** (`practicelab`, **v8**), stores:
  - `attempts` — every completed practice (full question + result snapshot)
  - `review` — wrong/unsure questions for spaced revision (`mastered` after 2
    correct re-answers; carry a `dueAt` for spaced repetition — see Mistakes notebook)
  - `refs` — uploaded reference papers (base64 + extracted text + tags)
  - `bank` — pre-generated question surplus, keyed by setup (see AI layer); cuts
    API calls by reusing one generation across many practices
  - `cards`/`trainer`/`trades` — Poké-Pack collection, XP/candy ledger, trading post
  - `packs` — SHARED transcribed real past-paper packs (see Past papers)
  - `curriculum` — SHARED AI-generated knowledge-point trees + concept cards, keyed
    by `country|subject|exam|level` (see Knowledge map)
  - Per-student stores are tagged with `profileId`; `packs`/`curriculum` are shared.
    `dbGet(store,id)` fetches one record by key.
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
  `unmangleLatex` un-corrupts commands whose first letter is a JSON escape (`\frac`→form-feed
  "rac", `\times`→tab, `\beta`→backspace) AND rewrites `\frac(a)(b)`→`\frac{a}{b}` (models
  sometimes use parens → "rac(1)(2)"). Because stored bank/review data predates this,
  index.html re-applies it on serve via `repairQ` (inside `fixQuestion` + `startPaper`), so old
  items and packs self-heal too.
- **Reference library + grounding** — `viewRefs` ("📚 Reference library", home menu)
  manages real past papers in the `refs` store, **shared** (`profileId:'all'`) and
  tagged `{exam,subject,level,year}`. Import auto-tags from the filename
  (`autoTagFromName`, e.g. "ICAS Maths Paper C 2019.pdf"); tags are editable.
  Scanned PDFs yield no pdf.js text, so for grounding they're rendered to ~10
  downscaled JPEGs SAMPLED EVENLY ACROSS the whole paper (`pdfPagesToImages`
  spread-samples; `refToInlineFiles`) — small enough not to overload Gemini (a
  whole multi-MB PDF 503s) yet representing the paper's full topic + easy→hard
  range. `buildPrompt` adds a `s.paperImages` instruction telling the model the
  images are sampled from a complete paper and to span all topics/difficulties.
  `bestRef(s,refs)`
  picks the closest paper to a practice setup (subject required; then exam, level
  overlap, newest year; null if no subject match — which is also the *fallback*
  for exams without papers, e.g. ground Rangitoto Maths on an ICAS Maths paper).
  `topUpBank` auto-grounds: if `bestRef` hits, it makes ONE grounded
  `generateQuestions` call (the paper is sent once → fresh questions in its style)
  and banks them — frugal (no per-practice image sends; reused from the bank).
  Import the working subset, NOT the whole multi-GB archive (IndexedDB/Drive-sync
  size). 25 MB/file cap.
- **Reliable large batches** — big single requests truncate (2.5-flash thinking
  budget can cut a 40-question response off mid-item). `generateMany(s,files,
  target,onProgress)` instead loops `GEN_CHUNK` (12)-sized calls, de-duping and
  tolerating partial chunks, until the target / an empty streak / an attempt cap
  (re-throws 429 only if nothing collected yet). The bank's manual pre-generate
  uses it for `BANK_DEEP` (40). Interactive misses use ONE `generateQuestions`
  call of `BANK_PREFILL` (24) — the daily free limit is REQUESTS not tokens, so we
  maximise yield per call and bank the surplus (the tolerant parser keeps whatever
  returns if it truncates). So every practice a kid does grows the bank.
- **Question bank (AI-usage reduction)** — `buildPracticeSet(s,files)` is the
  entry point used by `doGenerate()`/`practiceTopic()` instead of calling
  `generateQuestions()` directly. It serves matching questions from the `bank`
  store first (0 API calls); on a miss it generates a `BANK_PREFILL` batch,
  uses what's needed and banks the unused surplus (`bankAdd` de-dupes by
  `qhash`/`normQ`, then `bankPrune` caps each key at `BANK_CAP` 60, dropping
  most-served/oldest). The bank hub's manual pre-generate uses a bigger `BANK_DEEP`
  (40) batch. Output-token budget scales with batch size via `outTokens(count,
  cap)` (floor 16384; caps: Gemini 65536 / OpenAI 16384 / Claude 8192) so large
  batches don't truncate; `generateQuestions` passes it per provider. Bank key = `country|subject|exam|level|difficulty|style`
  (`bankKey`); `bankTake` honours selected topics strictly; when NO topics are
  chosen it **round-robins across distinct topics** (least-practised topic first)
  for variety, and `buildPrompt` likewise tells the generator to spread widely
  (≤~2 per topic) across the exam's topic list. **Attached past papers or per-session notes always force a
  fresh generation and are NOT banked.** Daily call count lives in `localStorage`
  `practicelab.usage`; `freeDailyLimit()` is 20 for Gemini.
  - **Unseen-first + Auto-fresh variety (v2.31)** — fixes "the questions are almost
    all ones I've done before". `bankTake(s,count,{allowSeen,exclude})` now serves
    **UNSEEN** questions (`servedCount===0`) FIRST and only dips into already-seen ones
    when `allowSeen` (fallback). `buildPracticeSet` is **Auto**: (1) fill from unseen
    bank (0 calls); (2) if short AND under the daily free limit, **generate fresh** —
    passing `recentStems(s)` as an `avoid` list so `buildPrompt` makes GENUINELY
    different questions (new scenarios/numbers, same style) — and bank the surplus (not
    the just-served ones); (3) only if still short (limit hit / offline) rotate in
    already-seen bank items; (4) never show a blank practice. A final `qhash` de-dupe
    guarantees no repeat within one practice. `viewBank()` is the
  hub (usage meter, per-setup counts, manual pre-generate, clear). Bank flows
  through export/import and Drive merge like the other stores.
- **Marking** — `gradeAnswer()`: MC by index; numeric by tolerant numeric match; plus a
  **fraction/mixed/money-equivalence** pass (v2.28) via `answerNum` (reuses `plValTokens`) so
  "1/2"↔"0.5", "1 3/4"↔"1.75", "$5"↔"5" all count as correct;
  short answers that don't match become `review` (self-check toggle on results).
  The AI occasionally mis-keys a question (right explanation, wrong `answerIndex`).
  Mitigations: (1) prompt has a CRITICAL self-check requiring key == explanation
  result; (2) `parseQuestions` re-points `answerIndex` if the model's `answer`
  TEXT matches a different option (handles LaTeX-fraction vs plain); (3)
  `repointFromExplanation(q)` is the stronger backstop for when the model keys
  BOTH `answer` and `answerIndex` to the same wrong option while the worked
  explanation reaches a different value (e.g. explains "80×2.5=200 km" but keys
  180; lists 9 divisors of 36 then keys 6). It scans the explanation's numbers
  from the END and re-points the key to the option that UNIQUELY matches the last
  concluding value — skipping distractor mentions ("a common mistake is 180",
  "not 6") and no-op'ing when the key already agrees (so correct questions are
  never touched; non-numeric/non-MC are left to guard 2). **Counting-aware
  (v2.30):** for "how many…" questions the concluded COUNT is usually FOLLOWED by an
  enumeration of the counted items (themselves numbers) and/or a descriptor
  ("…3 possible **4-digit** codes: 1374, 2370, 2376"), so the plain scan-from-end
  grabbed a listed code / the "4" of "4-digit" and confirmed the wrong key. Fix:
  a counting-conclusion detector (`there are N` / `N possible|ways|codes|…`) runs
  FIRST and wins when it uniquely maps to an option, and the general scan now skips
  hyphenated `N-digit(s)` descriptors. Value parsing goes
  through `plValTokens` (v2.26), which reads **times** ("8:15 am" → 495 min so
  8:00/8:10/8:15 stay distinct instead of collapsing to the hour "8"), **mixed
  numbers** ("1 7/8" → 1.875, incl. `\frac`), fractions and decimals — earlier
  versions scanned digit-by-digit and mis-keyed time/mixed-number answers.
  On serve, `fixQuestion(q)` = `dedupeOptions(q)` → `repointFromWhyWrong(q)` → `repointFromExplanation(q)`,
  applied at parse time AND on serve (`buildPracticeSet`, `startReview`) so
  already-banked mis-keys are fixed too. **`repointFromWhyWrong` (v2.28, free signal):** the
  model marks the correct option with an EMPTY `whyWrong`; if the KEYED option instead carries
  a "why it's wrong" reason (self-contradiction) and exactly one option is blank, repoint to
  that blank. Tight conditions → never fires on a clean key; explanation-repoint runs after and
  can override. **`dedupeOptions` (v2.26)** collapses
  **duplicate MC options** (models sometimes emit two identical choices, e.g. two
  "3/8" — confusing, and unanswerable when the key is on the copy): keep the first,
  drop later copies, re-point answerIndex/whyWrong to the survivor. The generation
  prompt now requires 4 DISTINCT options and the verifier "drop"s a question with
  duplicate choices. Tested in [repoint.test.js](repoint.test.js); (4) results show
  **"✓ My answer was actually right"** on wrong items (and "Mark as wrong" on
  correct) → `regrade()` recomputes the score and removes the matching mistakes-
  notebook entry. So a bad key is always correctable by the parent/student.
- **Broken-question detection (v2.31)** — the reported failure: a question with NO
  correct option got served AND marked wrong, its explanation rambling "I got it wrong
  and the correct answer should be…". `questionBroken(q)` catches this **deterministically
  (no API call)**: `explanationSelfCorrects(expl)` (tight regex for self-correction /
  think-aloud / "none of the options" admissions — the same phrases the prompt forbids)
  OR `mcConcludesOffList(q)` (an all-numeric MC whose explanation, at an explicit
  conclusion cue, reaches a value matching NONE of the options; conservatively gated so an
  incidental trailing number can't false-positive a sound question). It runs **before
  display** (`buildPracticeSet`'s `clean()` drops broken+blocked and backfills; `bankAdd`
  skips them; `startReview` filters them) AND **before marking** (`submitSession`
  downgrades a broken item to self-check — never WRONG — flags it for the parent via
  `logFlag`, and keeps it out of the notebook). The verifier also now receives a trimmed
  `explanation` and is told to "drop" a self-contradictory/uncertain one. Tested in
  [accuracy.test.js](accuracy.test.js).
  - **Figure-vs-key + ambiguity hardening (v2.45)** — two reported "my answer was right but
    marked wrong" cases. (1) A **pictogram whose drawn figure contradicts the key**: the renderer
    draws `round(value/per)` icons, so a spec with Banana `value:3,per:3` shows 1 icon = 3, but the
    key/explanation intended 9 — the kid reads the figure correctly and is marked wrong.
    `figureContradictsKey(q)` (folded into `questionBroken`) catches it **deterministically**:
    `PLDiagram.figureRows(spec)` (a NEW shared decoder in [diagram.js](diagram.js) that mirrors the
    pictogram/bar/tally renderers exactly) gives the true drawn per-row values; when an all-numeric MC
    reads exactly ONE labelled row (no compare/aggregate/fraction wording) and the key ≠ that row's
    value while the value IS a selectable option, it's a provable mis-key → dropped/self-check.
    Conservative by construction so difference/sum/"how many more" questions are never false-dropped.
    `verifyQuestions` also now passes decoded `figureRows` + a decode rule to the AI checker (catches it
    at generation before banking, which the deterministic guard alone can't for banked/imported items).
    (2) An **ambiguous logic puzzle** ("Ana not at front, Ben behind Cara — who's in the middle?" has
    TWO valid orderings) can't be caught deterministically (arbitrary word-problem semantics), so the
    fix is prompt-side: `buildPrompt` gained a "exactly ONE correct option — for logic/ordering puzzles
    ENUMERATE all arrangements; if >1 fits, it's ambiguous" clause + a "diagram must match the key"
    clause + a pictogram-convention note (`value` is the data total; the app draws `value ÷ per` icons).
    The human escape hatch ("✓ My answer was actually right" → `regrade`) remains the backstop.
    `formulaCautions` also gained curated wrong-signature flags for parallelogram / rectangle area &
    perimeter. Tested in [accuracy.test.js](accuracy.test.js) + [diagram.test.js](diagram.test.js).
- **Remove a question everywhere (v2.31)** — the fix for "a bad question (wrong image /
  no correct answer) keeps coming back even after clearing the bank" (it also lived in the
  notebook or re-synced from another device). A **🗑 Remove** control on the runner
  (⚠️ Report a problem), results and mistakes notebook calls `removeQuestionEverywhere(q)`:
  it deletes the active student's `bank` + `review` copies by `qhash` and adds a
  `CFG.blocked["profileId|qhash"]` tombstone. `isBlockedHash`/`isBlockedQ`/`blockQuestion`
  gate every serve path (`bankTake`/`bankAdd`, generated sets, `startReview`,
  `startPaper`) so it never returns — and the flat tombstone map syncs like `packsDeleted`
  (max-wins in `mergeRemote`, which also drops any now-blocked bank/review item), so a
  Drive merge can't resurrect it.
- **Accuracy hardening (v2.36, "make the taught knowledge correct")** — layered on the
  honest premise that an LLM can't be 100% right (its own self-check can share its bias),
  so stack checks of DIFFERENT kinds + surface + let a human correct:
  - **Numeric verify symmetry:** `verifyQuestions`' numeric/short `ok` branch now cross-checks
    the verifier's own `solved` against the key (mirrors the MC `solvedIndex` guard). DELIBERATELY
    conservative to avoid false-dropping CORRECT questions (this was the code-review's top risk):
    accepts the key + all `acceptedAnswers`, compares EVERY numeric token of `solved` (so working
    like "240×0.15=36" matches the concluding 36), ~2% tolerance (rounded/π/recurring agree), and
    SKIPS time answers (`:` → minutes mis-parse). Only drops on a clear no-overlap dispute.
  - **Real web-search grounding:** `callGemini(prompt,files,maxTokens,temp,grounded)` now sends
    `tools:[{google_search:{}}]` (dropping JSON mode, which is incompatible → the tolerant PLParse
    recovers) when `s.webSearch` is on AND nothing else grounds it. `generateQuestions` computes
    the `grounded` flag. A model that rejects the tool (e.g. Gemini 1.5 → 400) **retries once
    without it** (prompt-only fallback) instead of failing. (Previously the toggle was prompt-text
    only — CLAUDE.md claimed a feature the code didn't implement.)
  - **Concept-card safety** (LEARN content had NO checks): `ensureConceptCard` runs `formulaCautions`
    (deterministic known-wrong-formula flags for triangle/circle area & circumference — no rewrite),
    `explanationSelfCorrects` on the card text, and a self-consistency prompt clause; `viewConcept`
    KaTeX-validates each `$…$` span (`latexValid`) and shows a caution instead of a red error, a
    permanent "🤖 AI-generated — double-check" note, and a **🚩 Looks wrong** report (`reportCard`
    → `flagLog`). `generateKnowledgeTree` runs `validateTree` (drops dangling/forward/self prereqs,
    breaks cycles → `rec.needsReview`) + a level-scope prompt clause.
  - **Observable quality:** `qualityBump`/`qualityRecent` (`practicelab.quality`, device-local)
    tally verify drops/fixes; the parent dashboard shows "N double-checked, X fixed, Y dropped"
    (only counted when the filtered set is actually served, not the all-dropped fallback).
  - All deterministic pieces (`validateTree`/`formulaCautions`) unit-tested in
    [accuracy.test.js](accuracy.test.js); the diff was reviewed by an adversarial code-review
    workflow and all confirmed findings fixed.
  - **Tier-2 grounding (v2.37) — anchor the LEARN layer in authoritative sources:**
    `learnGrounding(s,topics)` returns `{text,source}` in priority order: an uploaded
    **curriculum/syllabus doc** (`curriculumRefText` — a ref marked `kind:'curriculum'` in the
    Reference library; TEXT-only so it syncs and grounds on every device, unlike paper images) →
    matching **past-paper packs** (`packGroundingText`, now **topic-relevance-ranked** — shuffle-
    then-stable-sort so a "fractions" card grounds on fraction questions yet keeps run-to-run
    variety) → none. `generateKnowledgeTree`/`ensureConceptCard` inject `g.text` and stamp
    `rec.source`/`card.source`, shown as a **"Grounded on: …"** provenance line on the map + cards.
    Text-only grounding keeps JSON mode reliable (no web-search for the structured LEARN calls).
    `packGroundingText(s,opts)` gained `{topics,limit,includeAnswers}`; the topic ranking also
    sharpens QUESTION grounding for topic-scoped drills. **Still Tier-3** (concept-card AI verify,
    cross-provider adjudication, parent approval queue) remains the follow-up. Caveat (pre-existing
    refs first-wins merge): set the Curriculum toggle on the device that imported the doc.
  - **Built-in curriculum source links (v2.38):** `CURRICULUM_SOURCES` is a curated list of
    OFFICIAL syllabus / exam-skills URLs (NZ Curriculum Maths on Tāhūrangi, the NZ Curriculum
    portal, ICAS maths + all-subjects on icasassessments.com, NCEA Maths on NZQA), rendered by
    `curriculumSourcesCard()` in the Reference library with `Open ↗` links (new tab, noopener) +
    import guidance. LINKS ONLY — never scraped content, so copyright frameworks (ICAS) stay
    off-repo; the parent opens → downloads → imports → marks Curriculum. An ungrounded map shows a
    "🔗 Add a curriculum source" button → `viewRefs`. (Runtime auto-fetch of these pages isn't
    possible — CORS + the static/file:// constraint — hence the open-download-import flow.)
  - **Auto-import curriculum (v2.39–v2.40):** `seedLocalCurriculum()` (boot, next to
    `seedLocalPacks`) seeds the Knowledge map's grounding with ZERO manual import. It seeds the
    **committed built-in `DEFAULT_CURRICULUM`** (v2.40 — a self-authored NZ Maths Years 0–10 summary,
    no copyright, so it's LIVE on GitHub Pages for everyone) PLUS any **gitignored
    `curriculum.local.js`** (`window.PL_CURRICULUM`, copy of the committed
    [curriculum.local.example.js](curriculum.local.example.js), loaded via a `<script src>` that
    404s harmlessly when absent — same accepted pattern as `papers.local.js`). Each becomes a shared
    `refs` record `kind:'curriculum'`; the map grounds via `learnGrounding`→`curriculumRefDocs`,
    which (v2.44) **COMBINES** the matching curriculum docs, exam-relevant first (a doc tagged for
    the practice's exam scores highest, then a general/no-exam doc like the built-in NZ default,
    then others; recency tiebreaks; capped ~9000 chars total). So a Rangitoto maths map grounds on
    **NZ (content scope) + ICAS (competition style)** together, an ICAS map on ICAS + NZ — more
    comprehensive than picking one. Provenance shows all docs used ("Grounded on: 📄 A + B"). Idempotent (dedupe by `id`), skips `refsDeleted`-tombstoned ids, and Drive-syncs
    (text-only) to the family's other devices. Copyright-sensitive text (ICAS) stays in the private
    `curriculum.local.js` only.
- **Views** — `viewHome/Setup/Run/Results/Review/History/Settings/Profiles/Refs/
  Bank/Dashboard/Guide/Study/AllQuestions/KnowledgeMap/Concept/FormulaSheet`. `show(node)` swaps
  `#app` and re-runs KaTeX. No router; functions call each other. `viewBank` = question-bank hub;
  `viewStudy` = focused single-question learning page; `viewAllQuestions` = searchable
  browser of every past question; `viewDashboard` =
  parent-only all-students progress overview;
  `viewGuide` = "How it works" guide (header ❓ + auto-shows on first run via the
  `practicelab.guideSeen` flag). **The standalone Skills map was RETIRED (v2.45)** — its coverage
  heatmap folded into the Knowledge map (`coverageListCard(s)` is the reusable body; the map header
  now shows the "N of M strands practised" meter + an "Other topics you've practised" off-syllabus
  card, and the map's empty state shows the coverage list so the zero-setup value survives). **`viewHome`
  groups the menu into labelled section cards** via a `sectionCard()` helper: **Practise** (Start a
  practice · 🎯 weak spots · Mistakes notebook · Question bank), **Track progress** (Progress · Past
  questions · Knowledge map · 📐 Formula sheet · My cards · All students) and **Exam content**
  (Reference library · Exam packs); empty / parent-only sections are dropped.
- **Formula sheet (v2.45, home "📐 Formula sheet", `viewFormulaSheet`)** — a printable "key formulas
  for your level" page answering "a knowledge/formula center with 精准易懂 explanations + 图形解释".
  Two layers: (1) **`FORMULA_GRAPHICS`** — a CURATED, illustrated maths-formula library (rectangle/
  square/triangle/parallelogram/trapezium/circle area, perimeter, circumference, cuboid volume,
  Pythagoras, triangle angles), each `{minYear,title,latex,plain,why,diagram}` where `diagram` is a
  LABELLED `PLDiagram` shape spec — so the figure is CORRECT by construction (never AI-drawn), the
  formulas come from `DEFAULT_CURRICULUM`'s KEY FORMULAS (accurate), and `why` is the plain-language
  reason. Filtered by `levelYear(s.level)` so it shows only level-appropriate formulas. (2) The AI
  concept-card `formulas[]` (Knowledge map), flattened per strand — reuses the SAME cache + safety
  (`latexValid` guard, `card.cautions` from `formulaCautions`, provenance). `practiceFormula(entry)`
  drills a curated formula (notes-scoped, fresh, not banked); `practiceKnowledgePoint` drills an AI one;
  `fillFormulas(rec,s)` generates any missing cards (reuses `ensureConceptCard`, confirms the call
  count); `printFormulaSheet(illus,rec,title)` prints (reuses the `printWorksheet` pattern, `plainMath`
  for the print window). Only maths gets the illustrated layer; other subjects show the AI formulas.
  Reached from the home menu AND a "📐 Formula sheet" button on the Knowledge map.
- **Mistakes notebook + spaced repetition** (`viewReview`, home "📓 Mistakes notebook") —
  browses the `review` items grouped by topic, each expandable to its worked answer +
  mastery progress (`timesCorrect`/2). `startReview(items)` re-tests all/one topic
  (review-mode session; the global `submitSession` **wrapper** at the bottom of the
  script updates mastery AND reschedules the spaced-repetition `dueAt` — correct →
  `srNext(timesCorrect)` on the `SR_DAYS=[1,3,7,14]` ladder, wrong → due again soon,
  mastered at 2). Practice-mode `submitSession` files NEW notebook items (due now) but
  NOT during review re-tests (no duplicates). `reviewDue(r)` = not mastered & due;
  home shows a "Due now" tile and the notebook re-tests due items first. **NOTE:** core
  `submitSession` only FILES items; the wrapper does the mastery/SR update — don't
  duplicate that increment (it caused a double-count bug, fixed with a `S.committed`
  re-entry guard).
  - **Understand-it-better (v2.31)** — for questions a kid doesn't get even with the
    explanation. Each notebook item AND each wrong/self-check result carries a
    `learnActions(q,ctx,base,save,onRemove)` row: **🧒 Explain it simpler** →
    `explainSimpler(q,ctx,host,save)` makes ONE AI call for a very-simple, age-matched,
    analogy-friendly re-explanation, renders it via `fmtExplain`, and **caches** it on the
    item (`simpleExplanation`, persisted to `review`/the attempt) so re-opening is free;
    **🔁 Practise similar** → `practiceLikeQuestion(q,base)` builds a fresh 6-question
    drill grounded on THAT specific question via a new `buildPrompt` **`exemplar`** field
    ("same skill, new numbers/context") — treated as `wantsFresh` (never banked). Small
    text calls go through the `callAI(prompt,maxTokens,temp)` provider-dispatch helper.
  - **De-dupe (v2.32)** — the notebook was filling with repeats of the SAME question (one
    `review` row per wrong encounter). Filing in `submitSession` now upserts by
    `profileId+qhash` (bump `timesSeen`, re-open for revision) instead of inserting;
    `mergeReviewDuplicates(profileId)` collapses existing dupes (keeps the freshest
    un-mastered row, sums `timesSeen`) and runs on `viewReview` open + after every Drive
    merge (cross-device same-question dupes).
  - **Study view + add-to-notebook + past-questions browser (v2.32)** —
    `viewStudy(q,ctx,opts)` is a focused single-question page (question, figure, worked
    explanation, read-aloud + the `learnActions` row); reached from a **📖 Study** button
    on each notebook row, from the all-questions browser, and via `learnActions`'
    `opts.study`. `addToNotebook(q,ctx,reason)` files a question the student got RIGHT but
    wants to understand (Howard) as a neutral **`learn`** item (`reasonTag.learn`
    "📖 to learn" — revised like a mistake but not mislabelled one; clears any block).
    Surfaced as **➕ Add to notebook** via `learnActions` `opts.addToNotebook` on CORRECT
    results and in the Study view. `viewAllQuestions()` (home Track-progress "📚 Past
    questions") lists EVERY answered question (de-duped by qhash, most-recent wins),
    filterable by text/topic/result, each row opening `viewStudy`.
- **Knowledge map + concept cards (v2.35, home "🗺️ Knowledge map")** — the "learn,
  don't just drill" layer. A curriculum-aligned **knowledge-point tree** per
  `country|subject|exam|level`, AI-generated ONCE and cached in the shared, synced
  `curriculum` store (`generateKnowledgeTree` — points grouped under the exam's known
  strands so mastery lines up; each point has `id`/`name`/`group`/`prereq`/`card`).
  `viewKnowledgeMap` renders a 思维导图 overview (a new `diagram.js` **`mindmap`** type:
  root → strands, coloured by mastery) + per-strand cards with mastery bars (from
  `strandStats`, computed live per student) and each knowledge point's prerequisites +
  **📖 Learn** / **✏️ Practise** buttons. `viewConcept` shows the point's concept card
  (key idea + formulas + worked example + common mistakes), generated lazily on first
  open (`ensureConceptCard`) and cached on the point. `practiceKnowledgePoint` builds a
  fresh drill scoped to that exact skill (via `notes`, so it's not banked). Curriculum
  syncs via Drive (merge by id, newest `updatedAt` wins — keeps the copy with more cards
  filled). **`el()` escaping gotcha applies:** strand/point NAMES are `el()` text
  children → pass them raw (never `esc()`, which double-encodes `&`→`&amp;`); `esc()` is
  only for the `html:` option (question/formula spans). The map header ALSO carries the
  topic-coverage meter + off-syllabus card (the former Skills map, folded in v2.45; see Views)
  and a "📐 Formula sheet" button.
- **Progress & stats** (`viewHistory`, home "📈 Progress & stats") — analytics
  dashboard: at-a-glance tiles (questions/accuracy/time/streak), a score-trend
  line and per-day activity bars (`chartLine`/`chartBars` — tiny inline-SVG
  helpers; colours are literal since CSS vars don't resolve in SVG attributes),
  accuracy-by-topic bars (weakest first, each with a `practiceTopic` drill), then
  the past-practices list and export/import/clear.
- **Learning & exam-prep features (added v2.15–v2.25)** —
  - **Hints + distractor rationales**: `buildPrompt` asks for `hint` (one-line nudge, no
    spoiler) and `whyWrong` (per-option reason); `parseQuestions` threads both through the
    bank/attempt/review spreads; runner shows a 💡 Hint button, results show a "Why the
    other answers are wrong" block. Optional → packs/old data without them render fine.
  - **Answer verification** (`CFG.verify`, default on): `verifyQuestions(s,qs)` inside
    `generateQuestions` makes ONE extra AI call that re-solves each generated question and
    keeps / repoints (MC) / drops it (`parseChecks` = tolerant `{checks:[…]}` parse).
    **It's figure-aware (v2.27):** a question's structured `diagram` spec is passed as a
    `figure` field so the checker solves chart/table/number-line questions against the
    actual figure values and drops ones where the figure supports no option.
    **It reports its INDEPENDENT solve (v2.28):** `solvedIndex` (MC) / `solved` (numeric); if
    that disagrees with the key even on a "ok" verdict, the item is DROPPED (a mislabelled
    verdict can't slip a wrong answer through) — a `fix` still repoints. **It now sees the
    `explanation` (v2.31):** a trimmed copy is sent so the checker can "drop" a question whose
    own working is self-contradictory/uncertain or concludes a value not among the options
    (belt-and-braces with the deterministic `questionBroken` guard). The verify + AI-grade
    calls run at **temperature 0.2** and generation at **0.5** (fewer arithmetic/keying slips).
    Best-effort — any failure returns the originals. Settings → AI toggle.
  - **AI-marked written answers** (`CFG.aiGrade`, default off): `aiGradeFreeText(s,results)`
    in `submitSession` batch-grades short/numeric self-check answers (accepts equivalent
    wording/units/rounding) BEFORE the score is computed; practice-mode only.
  - **Adaptive difficulty** (`CFG.autoDifficulty`, default off = SUGGEST): after two same-
    subject/level practices ≥85% (or <50%), `difficultySuggestion()` proposes a level change
    on results (`diffSuggestCard`); off = tap to apply, on = auto-apply (announced, never
    silent). `applyDifficulty()` writes the active profile's `defaults.difficulty`. Friendly
    names via `diffLabel()` (`DIFF_NAMES`: L1 Starter…L5 Challenge); shown on runner/bank.
  - **Weak-spot practice** (`practiceWeakSpots()`): a bank-first drill weighted to the
    student's lowest-scoring practised topics + untried `examTopics()`; on the home Practise
    section and atop the Knowledge map's coverage view.
  - **Timed mock-exam mode**: `startPaper(pk, timed)` sets a countdown (`paperMins()`,
    ~1 min/Q clamped 10–75) reusing the existing `S.limitSec` timer + auto-submit; runner
    shows a "⏱ Timed exam" pill, results show a per-topic exam report (`topicReport()`).
  - **Printable worksheet** (`printWorksheet(questions,title)`): a print window with the
    questions (LaTeX flattened via `plainMath`) + a separate answer key; button on results.
- **Explanation rendering** — `fmtExplain()` turns the stored explanation
  (plain text + `$LaTeX$` + `**bold**`/`*italic*` + numbered steps / `*` bullets)
  into readable HTML blocks, protecting `$…$` spans (incl. escaped `\$` for money
  like `$\$5$`) so KaTeX still renders them. Prompt tells the model to write money
  as `$\$x$`. Questions may carry a diagram, rendered in runner + results (capped
  to `.figure` max-width 420px, centred). **v2.33:** after protecting math spans it
  normalises LITERAL `\n`/`\t` escape artifacts (some models return steps as `"…\n2. …"`
  rather than real breaks) into real whitespace so numbered steps split; `explainSimpler`
  also unwraps a quoted/JSON blob (`JSON.parse`) and its prompt asks for real line breaks
  and plain `×`/`÷` (not `$\times$`).
- **Diagrams ([diagram.js](diagram.js), `PLDiagram.render(spec)`)** — models are
  unreliable at hand-drawing SVG (pie arcs especially), so the prompt asks for a
  STRUCTURED `diagram` spec `{type,...}` and this module draws correct, tested SVG.
  Covers ~17 types: pie/fraction-circle, bar, numberline, fractionbar (tape/bar
  model), shape (rectangle/square/triangle/right-triangle/parallelogram/trapezoid/
  circle/polygon with side+angle labels), clock, pictogram, array/grid, coordinate
  plane, angle, lineplot/dotplot, venn, tally, plus SCHEMATIC types that let the AI
  GENERATE figure-heavy questions (not just reuse real ones): **routemap** (places +
  routes with distances + scale — the "how much further" map category), **table**,
  **scale** (vertical measuring scale / thermometer — "read the scale", growth),
  **balance** (equality / simple algebra), **timeline** (a time arrow with dated
  events alternating above/below — "history of …" / order-of-events) and **flow**
  (process boxes joined by arrows with optional `branches` for by-products/inputs —
  sugar refining, ethanol production, food chains, life cycles) and **mindmap**
  (v2.35 — root → branches with per-branch colour + count, for the Knowledge map's
  思维导图 overview). Aliases tolerated
  (e.g. `map`→routemap, `process`/`foodchain`→flow, `knowledgemap`/`conceptmap`→mindmap). Pure string output
  (no DOM) → Node-testable + works on file://. **Integration is near-zero-blast:**
  `parseQuestions` renders `q.diagram` (object) via `PLDiagram` into the existing
  `svg` field (so every downstream path is unchanged); a raw inline-`svg` string
  still works as the fallback, and an unknown/empty spec returns `''` → no diagram,
  no crash. Output is sanitiser-safe. Tested in [diagram.test.js](diagram.test.js).
- **Question figures** — `figureEl(q)` builds a question's `.figure`: its diagram/`svg`
  AND/OR a cropped **`image`** (a `data:` URL; `safeImage()` allows only
  `data:image/*;base64` — never external/js). Used for things the diagram engine
  can't draw — maps, puzzles, clip-art, photos (esp. real past papers / Science).
  `image` is threaded through the same spreads as `svg` (parse, bank add/take,
  attempt results, review). Rendered in runner/results/review, capped to 420px.
- **Past papers / real-question packs (`viewPapers`/`startPaper`, `packs` store)**
  — PRIVATE transcribed real exam questions, real ICAS content is copyright so NEVER
  in the repo. They live in a **SHARED, Drive-synced `packs` store** (DB **v7**; merged
  by id, newer `updatedAt` wins) so they reach the **public Pages app on every device**
  without being committed. Delivery: `importPacks(file)` reads a **`.json` pack file**
  via the "📄 Past papers" screen's file picker → writes to the store → `scheduleDriveSync`
  → syncs everywhere. **On import, `packIssues(p)` (v2.27) validates each MC question**
  (duplicate options, out-of-range `answerIndex`, answer-text ≠ keyed option) and, being
  non-blocking, still imports but `console.warn`s + toasts the count so transcription slips
  surface. `seedLocalPacks()` also seeds from a bundled gitignored
  `papers.local.js` (`window.PL_QUESTION_PACKS`) for local/dev. The home item always
  shows (so import is reachable). `startPaper(pack)` drills directly (NOT via the
  difficulty-keyed bank), rendering `diagram` specs and sanitising `image`s, and
  **trusts the curated `answerIndex`** (does NOT run `repointFromExplanation`, which
  can mis-fire on non-numeric answers like "leave out the + card") — but it DOES run
  `dedupeOptions` (v2.27) as cheap insurance against a duplicate-option transcription.
  Pack file shape:
  `{title,subject,level,year,exam,setup,questions:[…]}`. Transcribed from `papers/`
  (gitignored) by rendering each scanned page (PyMuPDF, a local dev tool) and reading
  it — bespoke figures cropped to `image` (compressed), standard/schematic figures as
  `diagram` specs. NZ ICAS levels: Paper B=Y5, C=Y6, D=Y7, E=Y8, F=Y9 (AU is one lower).
  Answer keys are at the END of each paper (with strands + skill descriptions).
  - **Packs GROUND generation (v2.9).** `packGroundingText(s)` finds packs matching the
    practice's subject + year level (`packSubj`/`packLvl`) and returns their question
    lines; `generateQuestions` injects them as the reference text when no paper is
    attached, so the AI mirrors the real exam's style/topics/difficulty. Packs beat
    generic web-knowledge (used when a match exists); levels/subjects without a pack
    fall back to the web-knowledge prompt. So the parent uploads packs for all
    years/subjects once and each child's generated questions are auto-grounded at
    their level. The "📄 Exam packs" home item + import/manage are **parent-only**
    (`isParent()`); packs are shared (not per-student).
  - **`el()` escaping gotcha:** string children are inserted via `createTextNode`
    (already XSS-safe) — do NOT wrap child text in `esc()` (double-encodes, e.g.
    "Data &amp; graphs"). `esc()` is only for `{html:...}` / attribute strings.
- **Read-aloud** — `speak()` (Web Speech) reads a question/explanation aloud,
  using `plainMath()` to strip LaTeX/markdown. 🔊 buttons in runner + results.
  A floating control bar (`#speakbar`, `refreshSpeakBar`/`speakPauseToggle`/
  `speakStop`) auto-appears while speaking with Pause⇄Resume + Stop, and hides when
  idle (event-driven + 400ms poll, since Chrome speech events are flaky). `show()`
  cancels speech on view change. Settings → Read-aloud (`buildVoiceCard()`) picks
  the voice (`CFG.voiceURI`,
  device-dependent list from `speechSynthesis.getVoices()`, async via
  `voiceschanged`), speed (`CFG.voiceRate`) and pitch (`CFG.voicePitch`, higher =
  younger — the API has no age metadata). `voiceGender()` is a best-effort
  name-based label only.
- **Poké-Packs (collectible reward)** — finishing a practice (≥`PACK_MIN_Q` 5
  questions, ≤`PACK_DAILY_CAP` 5/day) earns a card. `rollCard()` rolls a rarity
  tier 1-5 from a luck score (accuracy-dominant + difficulty + streak), then a
  random Pokémon of that tier from `POKEDEX` (~64, 5 tiers); small shiny chance.
  Rolled in `submitSession`, stored on `attempt.reward`, revealed on results
  (`packRevealCard` → `cardFace`, confetti for tier≥4). Cards persist per-profile
  in the `cards` store (id `profileId:dexId`, count + shiny), shown in `viewCards`
  (Pokédex grid: owned in colour + rarity border + ×count, unowned as
  silhouettes). Sprites are **hotlinked** from the public PokéAPI mirror
  (`pokeSprite`) — NO copyrighted images in the repo (private family use). `cards`
  flows through Drive sync (merge keeps higher count + any shiny) + export/import.
- **Trainer progression (Phase A meta-game)** — every practice grants **XP**
  (`correct × (2+difficulty)` — quality) and **candy** (effort; even low accuracy
  earns some) via `trainerAdd`, stored in the `trainer` store (per-profile). **Candy is a
  monotonic ledger (v2.28): `candyEarned`/`candySpent`, with `candy = earned − spent`**
  (`normTrainer`) so a spend survives Drive's MAX-merge (see Drive sync). `trainerLevel(xp)`
  is an infinite curve (L1→2 = 100 XP, +50 each). On a **duplicate** pack, the extra copy is
  KEPT by default (adds to ×count) and the results reveal (`packRevealCard`) lets the kid
  **choose: keep it or convert to `tier×4` candy** (`reward.dupe`/`dupeCandy`/`resolved`
  stamped on the attempt; convert calls `cardTakeFrom`+`trainerCandyMove` on the earner). Candy is spent in
  `viewCards` to **train** a card up a level (`trainCard`; `trainCost(level)` is
  QUADRATIC `8+4L+L²` so higher levels cost meaningfully more, v2.27; cap
  `CARD_MAX_LEVEL` 20) or to **make a card shiny** (`makeCardShiny`; `shinyCost(tier)`
  = `60+tier×30` so rarer shinies cost more, v2.27). Rewards shown on results
  (`xpGain`/`candyGain`/`levelUp`).
  `trainer` syncs (merge keeps higher xp/candy) + export/import; card `level`
  merges by max.
- **Card detail (`viewCard`)** — tapping an owned dex cell opens a detail screen:
  the Pokémon's real **type chips**, derived **stats** (`cardStats` →
  HP/Attack/Defense/Speed from tier+level) and its **3-move kit** (`cardMoves` — a
  same-type STAB attack, a risky `Take Down`, and a status move; see Battle) shown
  with type/power/accuracy/effect — plus flexible candy actions: **Power Up**
  (`trainCard`, returns bool; callers refresh) and **Make shiny** (`makeCardShiny`,
  `SHINY_COST` 40).
- **Trading Post (`viewTrades`/`viewTradeNew`, async stall)** — a kid offers one
  owned Pokémon (escrowed via `cardTakeFrom`) and a requirement (`want`: candy
  amount OR a specific dexId); anyone in the family can `acceptTrade` later (no
  simultaneous online needed). Cross-profile transfers use `cardGiveTo`/
  `cardTakeFrom`/`trainerCandyMove`. `trades` store (DB v6) syncs (merge: resolved
  status wins over open) + export/import. **Cross-device spends now propagate (v2.28)** —
  cards carry a monotonic `gained`/`lost` ledger (`count = gained − lost`, `normCard`; a spent
  pile is kept at count 0, not deleted, so the merge can't resurrect it) and candy uses
  `candyEarned`/`candySpent`, both MAX-merged (`mergeCardRec`/`mergeTrainerVals`). Concurrent
  OFFLINE edits on two devices still take the higher total (inherent additive limit), but a
  taken trade / trained card / converted duplicate no longer reappears.
  - **Simulated trade market — NPC traders (v2.46)** — a kid posts offers faster than family
    members take them, so the post can feel dead. NPC "traders" (`NPC_TRADERS`) occasionally
    accept a student's OPEN offers so the market stays lively, and a trader only VISITS when the
    kid **finishes a practice** (primary trigger, in `submitSession`: `visitProb`=0.4→0.7 by
    accuracy) — turning market activity into a reason to practise more. `runNpcMarket(profileId,
    {max})` takes up to `max` of the student's fair open offers (oldest first), daily-capped
    (`NPC_DAILY_CAP`=3, device-local `practicelab.npc` counter). Fairness/pricing:
    `cardValue`/`wantValue` (rarity `TIER_VALUE` × level/shiny) feed `npcAcceptProb` — a GOOD deal
    for the taker (offered worth ≥ ask) is taken ~92%, a greedy ask ~6% (gently teaches fair
    pricing). `npcFulfill` pays the seller the `want` (candy or the requested card) and the offered
    (escrowed) card leaves play; the trade becomes a normal `done` record (`takenBy:'npc'`,
    `npc:true`) that syncs like any other. Results screen shows a "🔔 A trader visited" card
    (`attempt.npcTrades`); `viewTrades` also runs a cooldown-gated `npcMaybeVisit()` on open (≤ once
    / 20 min) and shows a "🧾 Recent deals" activity list. Pure pricing helpers unit-tested in
    [economy.test.js](economy.test.js).
  - **Market Coach — teach values + how markets work (v2.47)** — makes the trade flow an
    interactive money lesson. **Bundles are now first-class:** a trade can offer ONE card (`t.card`)
    or a BUNDLE (`t.cards[]`, up to `BUNDLE_MAX`=3); `tradeCards(t)` unifies both and is used
    everywhere (post/accept/cancel/npcFulfill/render) — `t.card` kept as `cards[0]` for
    backward-compat with pre-v2.47 records. `viewTradeNew` rewritten: multi-select grid (each card
    shows its 🍬 `cardValue`), a **bundle tip** with a bulk discount (`bundlePrice` ≈6–20% off,
    teaching "buy more, save more"), a **fair-price coach** ("~🍬X is fair"), value-scaled candy
    options **rounded to clean tens**, a **live deal meter** (`dealRating` — 🎁 generous / ⚖️ fair /
    🙈 too steep, aligned with `npcAcceptProb` so advice matches the market), and a **charm-pricing
    (价格心理) toggle** (`charmPrice`: 60→59 — "ending in 9 FEELS cheaper; don't be fooled either").
    Each offer in `viewTrades` shows its deal-quality chip; a collapsible **🎓 Market School**
    `<details>` card teaches value / fair pricing / the 9-trick / bundles / upsell / supply-demand /
    win-win. `npcAcceptProb` now values a bundle by `tradeValue` (summed). New pure helpers
    (`tradeCards`/`sumValue`/`tradeValue`/`bundlePrice`/`charmPrice`/`dealRating`) unit-tested in
    [economy.test.js](economy.test.js).
  - **Money Lab — saving, term deposits & investing (v2.48, My cards → 💰 Money, `viewMoney`)** — a
    SAVE→GROW financial-literacy layer on the candy economy, teaching the risk/reward ladder. **🎯
    Savings goal:** pin a dream card (`setGoalCard`), progress bar vs `shopPrice` (tier value +50%
    markup) using total net worth (wallet+bank+fund), "≈ N practices away" (`candyInPractices`), and
    a **buy** when affordable (`buyGoalCard`, spend→`cardGiveTo`) — delayed gratification. **🟢 Candy
    Bank (term deposit):** one active deposit; `BANK_TERMS` (1d +5% / 3d +12% / 7d +25%), locked,
    GUARANTEED `bankPayout`; collecting early forfeits interest (`bankCollect(early)`) — patience &
    %. **🟡 Candy Fund (investing):** `fundBuy`/`fundSellAll` units at a daily price that moves
    −6%…+14% (`fundStep`, expected +~4%/day so it trends up but with real DOWN days), advanced once
    per calendar day (`fundEnsureDaily`, catch-up capped at 7 days then snap), with a live
    `chartLine` history + today's %; teaches volatility, patience ("time in the market"),
    diversification and "only invest spare candy" — deliberately HIGHER expected return than the
    safe bank so the trade-off is felt. **Sync:** wallet candy stays the monotonic
    `candyEarned`/`candySpent` ledger (a deposit is a SPEND, a withdrawal an EARN → always correct
    cross-device); the `vault` (bank/fund/goal) on the trainer doc syncs newest-wins by `vaultAt`
    (`mergeRemote`). `moneyMutate` does candy+vault atomically. Pure helpers (`bankPayout`/`fundStep`/
    `fundValue`/`shopPrice`/`candyInPractices`) unit-tested in [economy.test.js](economy.test.js).
  - **Deal-math + pricier dream cards (v2.49)** — the market feeds the app's core (learning).
    **🧮 Shopkeeper's Challenge** (Money Lab): `moneyMathQuestion()` generates a shop-style money
    problem (% of an amount, interest, sale/discount price, unit price, profit) with 4 clean integer
    options (answer + plausible distractors, always well-formed — fuzz-tested); `moneyQuizCard`
    renders it, a correct answer pays +🍬2 up to `MATH_BONUS_CAP`=12/day (`mathBonusToday`, so it's a
    nudge not a farm), and shows the concept. **Unit-price** teaching added to the bundle coach
    ("🍬X each"). **Dream-card prices raised** via a per-tier `SHOP_MARKUP` (t1≈20 … t4≈175 …
    **t5≈385**, rounded to 🍬5) so a legendary is a real ~55-practice save. Pure helpers unit-tested
    in [economy.test.js](economy.test.js).
  - **Dynamic market + P&L + reflection (v2.50)** — supply & demand made real. A deterministic
    daily **hot** type (worth +25%) and **cold** type (−20%), picked from the date with zero
    storage/sync (`MARKET_TYPES`, `dayHash`, `todayMarket(d?)` — hot AND cold each an independent
    date-hash so both change daily; 'normal' is never hot/cold → stable baseline). `marketMult`/
    `marketValue`/`tradeMarketValue` adjust CARD trade values (NOT the shop/goal/fund, which stay
    stable). The Trading Post shows a **📊 Today's Market** board (sell-hot/buy-cold guidance), the
    trade builder shows today's prices + per-card 🔥/❄️ hints + a market-aware fair-price coach, and
    `npcAcceptProb` + the deal meter value BOTH sides at market (`askMarketValue` makes card-for-card
    asks market-aware too) so buy-low/sell-high actually pays off. A **"good deal?" reflection** on
    `acceptTrade` (compares candy paid vs today's market worth) and a **📈 Your trading** cash-flow
    card (candy sold − bought, from done trades) teach evaluating decisions + P&L. UI polish: Money
    School moved to the top of the Money Lab, 价格心理 → "price psychology", and a **💰 Money &
    trading** intro added to the ❓ guide. Adversarially code-reviewed (the sticky-cold bug it found
    is fixed); market helpers unit-tested in [economy.test.js](economy.test.js).
  - **Haggling + auctions (v2.51)** — two negotiation surfaces in the Trading Post. **💬 Haggle**
    (`viewHaggle`, `startHaggle`, `makeOffer`, `closeHaggle`) is a self-contained mini-game: an NPC
    shopkeeper sells a random card at a marked-up price; you counter, `haggleReply(reservation,
    sellerPrice,yourOffer,round,maxRounds)` (pure) accepts at/above the reservation, else meets in
    the middle, else walks away after `HAGGLE_MAX_ROUNDS`. Teaches negotiation + walking away. **🔨
    Auctions** (`postAuction`, `auctionBidStep` (pure — bumps ~15% toward a soft cap just above
    market), `runAuctionBids`, `resolveAuctions`, `endAuctionNow`): list a card (a `trades` record
    with `kind:'auction'`, escrowed, opens at ~half market), NPC bidders drive it up on practice +
    on opening the post, and you collect the winning bid when it ends or you End-now. Auctions are
    filtered OUT of the fixed-price offer lists (`tradesOpen` consumers + `runNpcMarket` guard
    `kind!=='auction'`), fold into the cash-flow (P&L) + Recent-deals, and — like all trades — sync
    by status (intermediate live-bid updates are seller-device-local, which is fine since auctions
    resolve on the seller's device). Pure logic unit-tested in [economy.test.js](economy.test.js).
  - **Give/charity + Smart-Shopper badges + parent money report (v2.52)** — the values + oversight
    layer. **🎁 Give a card** (`giveCard`/`viewGive`, gated on >1 profile) transfers a card to a
    family member (`cardTakeFrom`→`cardGiveTo`) — teaches generosity. **🏅 Badges** (`BADGES`/
    `earnedBadges`) — Saver, Investor, Goal Getter, Negotiator, Bargain Hunter, Auctioneer, Maths
    Whiz, Generous, Profit Trader — computed from money-skill counters on the synced vault
    (`vault.stats`, bumped via `bumpStat`/`statBump` in bankDeposit/fundBuy/buyGoalCard/closeHaggle/
    resolveAuctions/the math challenge/giveCard) plus `tradeNetFor` (trading P&L). Shown in the Money
    Lab. **Parent money report** — each student's card on `viewDashboard` gets a 💰 line (total net
    worth, saved, trading net, badges earned, gifts) read from their synced trainer vault + trades.
    Pure `earnedBadges`/`tradeNetFor` unit-tested in [economy.test.js](economy.test.js).
  - **🔴 Star Card bet — the spicy investing rung (v2.53)** — completes the risk ladder (🟢 bank →
    🟡 fund → 🔴 single card). Pick ONE Pokémon and bet candy on its price (`vault.stock={dexId,name,
    units,history}`); it swings much WIDER than the diversified fund (−18%…+22%/day via `stockStep`,
    floor 8 vs the fund's 20 so it can really crash) plus a ±6% tilt when its type is today's hot/cold
    — teaching concentration risk / "all your eggs in one basket". Mirrors the fund
    (`stockEnsureDaily`/`stockPrice`/`stockBuy`/`stockSellAll`/`pickStock`; switch cards only when
    units=0), rendered as a volatile chart in the Money Lab next to the calmer fund. Adds a **🎲 High
    Roller** badge (`stockBet` stat). Pure `stockStep` unit-tested in [economy.test.js](economy.test.js).
    The money-education ladder (earn → budget → save → invest → trade/haggle/auction → give, + applied
    money-math, badges, and a parent report) is now COMPLETE.
- **Battle vs PC ([battle.js](battle.js), `viewBattle`)** — practice-GATED: each
  practice grants `⚡ energy` (`battleAddEnergy`, +1, +1 at ≥80%, cap 12, stored on
  the trainer doc); a battle costs 1. `viewBattle` is a **team builder**: pick up
  to `TEAM_MAX` (3) Pokémon → fight a wild side that fields a **matched team** the
  same size (`wildTeam`, scaled to your average level / lead tier, distinct
  species). Win when the foe's WHOLE team faints; lose when yours does. Flashy 2D
  arena (GSAP lunges/hits/particles/HP-drain/faint, confetti) — no true 3D since we
  only have 2D sprites. `🍬 Potion` spends candy.
  - **Teams & switching (v2.4).** State is `myTeam`/`foeTeam` arrays + `meIdx`/
    `foeIdx`; `MA()`/`FA()` are the active fighters and `paintSide(side)` repaints a
    side from them (sprite/name/types/HP/`bt-badge`/`bt-pip` team dots). **Switch**
    (`🔄`, capped at `SWITCHES` 4 voluntary/battle) **costs your turn** — the switch
    resolves first, then the foe gets a free move; `doSwitch` resets the outgoing
    Pokémon's stat stages (status persists). When a Pokémon faints, `faint(side)`
    sends the next: the foe auto-picks its best type-matchup (`pickFoeNext`), the
    player chooses via `playerPick` (forced, free, doesn't use the cap); a faint
    ends the round (`roundBreak`). All-fainted → `endBattle`. Win rewards sum XP/
    candy across the defeated foe team + 35% to catch one of them.
  - **Real-battle depth (tuned for ~13-15 y/o).** Every Pokémon has
    HP/Attack/Defense/Speed (`cardStats`) and a 3-move kit (`cardMoves`): a
    same-type **STAB** attack, a risky **Take Down** (75% acc, high crit), and a
    **status move** (buff self / debuff foe / heal, from `UTIL_MOVES`, deterministic
    per dexId). A round = the foe's AI move + the player's, resolved in **Speed
    order** (15% upset chance). Attacks can **MISS** (per-move accuracy) or be
    **DODGED** (faster defender evades more); **DEFENSE** soaks damage
    (`50/(50+def)` so higher level = tankier); **real TYPE effectiveness** via
    `typeMult` (the standard chart in `TYPE_FX`, softened to ×1.6 / ×0.62 / 0 for
    feel by `dmgTypeMult`) + **STAB ×1.5** + crit; **stat stages** (`stage.atk/def/
    acc/spd`, `stageMul` ±25%/step capped) from buff/debuff moves; **status**:
    burn 🔥 (end-of-turn chip + cuts Attack) and paralysis ⚡ (25% skip + half Speed).
    The wild `aiChoose` picks its best-matchup move, heals when low, finishes you
    when you're low. `endBattle` rewards as before (XP+candy, 30% catch, 20%
    `dblPack`). Floating labels show Super-effective / Not very effective / Miss /
    Dodge / Critical; `bt-badge` shows BRN/PAR.
  - **Real types** live in `index.html` (so `viewCard` can show them too):
    `POKE_TYPES` (canonical type[] per dex id — Charmander Fire, Garchomp
    Dragon/Ground, etc.), `TYPE_COLOR`/`typeChip` (type pills), `TYPE_FX` (standard
    effectiveness chart) + `typeMult`, `TYPE_MOVE` (signature same-type move per
    type) and `UTIL_MOVES`. Tested in [battle.test.js](battle.test.js) (types,
    chart, stat/move shapes).
  - Classic script using main-script globals at call-time. Energy/dblPack live on
    the trainer doc (xp/candy sync by max; energy stays device-local).
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
- **Design / theme** — iOS-style: **Inter** webfont app-wide via the `--font` CSS var
  (Google Fonts `<link>` in `<head>`; system font `-apple-system…` is the offline /
  `file://` fallback). **`.katex{font-family:var(--font)}`** (no `!important`) renders
  maths NUMBERS in Inter too so they match the text, while KaTeX keeps its own
  italic-variable / symbol / delimiter fonts (√, big brackets). **Maths is sized
  `1.08em` (v2.34)** — a touch bigger than the text, not KaTeX's default `1.21em`
  (which made numbers look oversized). **Question text is ONE size everywhere: the
  `.qtext` class = 16px; do NOT override it inline** (v2.34 removed per-view 15/16/18px
  overrides in results / notebook / study / browser that made question size inconsistent
  page-to-page). iOS system colours (canvas `#f2f2f7`, blue `#007aff`, green/red/orange
  semantics), flat primary buttons, iOS toggle switches (`input[type=checkbox].sw`). No
  serif. References: `design/DESIGN-GUIDELINES.md` (superseded by iOS look) and
  `design/gsap-skills.md`.
- **Animation (GSAP)** — loaded from CDN. `animateIn(scope)` (called by `show()`)
  fades/rises cards on every view; results screen counts up the score and
  staggers question cards; the runner cross-fades on question swap. Transform/
  `autoAlpha` only; honours `prefers-reduced-motion` via `reduceMotion`.
- **Settings** — grouped iOS-style sections via `sec(label)`; advanced items
  (EmailJS keys, Drive, login, key sharing) live in `<details class="adv">` to
  keep the screen uncluttered. `buildAICard(parent)` / `buildVaultInner()` /
  `buildLoginInner()` build the AI + access blocks.
- **Parent dashboard** — a logged-in parent LANDS on `viewDashboard` (and the 🏠
  button returns there); students land on their own `viewHome`. Each student card
  shows tiles + streak + **Open** (`openStudent(id,view)` switches active profile →
  their home) / **Progress** / **Mistakes**. Cross-device data requires Drive sync.
  Also shows a **🚩 Corrected answers** card (v2.28) — a device-local capped log
  (`flagLog`/`logFlag`, written by `regrade`) of manual mark overrides, so a parent can
  spot topics the AI keys/marks badly.
- **Daily goal setting (v2.28)** — parent-only Settings control writes the global
  `CFG.dailyGoal` (already in `SYNC_SETTINGS`); the home goal bar reads it.
- **Synced settings** — a whitelist `SYNC_SETTINGS` (emailEnabled, emailTo,
  emailjs, dailyGoal, webSearch, examContext — NOT the API key, NOT device-specific
  voice/active-student) syncs via Drive with newest-edit-wins: `markSettingsChanged()`
  stamps `CFG.settingsAt` on Settings-save; `driveSyncNow` uploads `{settings,
  settingsAt}`; `mergeRemote` adopts remote settings if `settingsAt` is newer. So
  turning on email summaries on one device propagates to the others.
- **Drive sync** — optional; Google Identity token client + Drive `appDataFolder`
  REST. **Ref papers are synced WITHOUT their base64 binary** (text + tags only;
  `refsLite` in `driveSyncNow`) to keep the blob light — the PDF/image stays on
  the importing device, so `bestRef`/`refToInlineFiles` require `dataB64` and a
  metadata-only ref shows "synced — file on another device" and can't ground there.
  REST. Merge-on-id (no conflict resolution beyond "keep both / first wins").
  Only works on an https origin. `scheduleDriveSync()` debounces writes.
  - **Deletions propagate (don't resurrect).** The merge is additive, so a delete used to
    come back from the synced blob. Fixed two ways, both carried in the blob + applied in
    `mergeRemote`: (1) **tombstones** `CFG.packsDeleted`/`refsDeleted` `{id:deletedAt}` for
    per-item deletes (`delPack` / the ref 🗑) — merge drops & skips tombstoned ids; a
    re-import wins (packs by newer `updatedAt`; refs get a fresh `uid` so the id never
    recurs). (2) **clear stamps** `CFG.cleared` `{"store:profileId":clearedAt}` for wholesale
    Clear-bank / Clear-history — merge drops any bank/attempts/review item created at/before
    the stamp and skips re-adding it, while items generated AFTER the clear survive.
    The stamp is written BEFORE the sync so a clear is immediate locally and propagates.

## Conventions
- Tiny DOM helper `el(tag, attrs, ...children)`; `$`/`$$` for queries. Keep using
  these rather than introducing a framework.
- All maths uses `$...$` LaTeX; KaTeX auto-render runs via `renderMath(scope)`
  after every `show()`. New views with maths must be inside `show()` or call
  `renderMath` themselves.
- User-entered HTML is always `esc()`-aped before insertion.
- **Versioning** (`APP_VERSION`, shown in the footer; cache-busting is via headers,
  so the string is just a visible deploy marker): scheme is **v2.x** — bump the
  minor on each release (currently at **v2.54**). Claude suggests the next number on
  each deploy; Chi decides. **Push only to the personal `zcsstar` GitHub** (never the
  work account) — headless method: `git push "https://x-access-token:$(gh auth token
  --user zcsstar)@github.com/zcsstar/practice-lab.git" main` (the GCM popup can't reach
  the desktop from this environment). Packs/refs are gitignored (copyright); committed
  files are `index.html` + sibling scripts + docs.
  - **Deploy = GitHub Pages (branch `main`, `/`).** A committed **`.nojekyll`** (v2.42) makes
    Pages serve files STATICALLY — do NOT remove it; without it Pages runs legacy Jekyll, which
    is pointless here and once failed a build ("Page build failed" → the site got stuck on an old
    version). After a push, a Pages build runs (~30–60s) then the Fastly CDN caches ~10 min, so a
    new version can take a few minutes to appear even on a hard refresh. Check deploy state with
    `gh api repos/zcsstar/practice-lab/pages/builds/latest` and the live version with
    `curl -s https://zcsstar.github.io/practice-lab/index.html | grep APP_VERSION`.

## Verifying changes
1. **Parser tests:** `node parse.test.js` (covers the `parse.js` module: clean,
   fenced, truncated, malformed, control-chars, raw-LaTeX, money cases).
   **Mis-key backstop:** `node repoint.test.js` (extracts `repointFromExplanation`
   from index.html; covers the explanation-vs-key re-point + safety cases).
   **Battle types:** `node battle.test.js` (extracts the type system from
   index.html; covers canonical types, the effectiveness chart, stat/move shapes).
   **Diagrams:** `node diagram.test.js` (the `diagram.js` renderer: every type makes
   valid safe SVG; pie/array/clock geometry; aliases; bad specs → '' fallback).
   **Economy ledger:** `node economy.test.js` (extracts `normCard`/`normTrainer`/
   `mergeCardRec`/`mergeTrainerVals`; verifies spends survive the additive MAX-merge).
   **Broken-question detection:** `node accuracy.test.js` (extracts
   `explanationSelfCorrects`/`mcConcludesOffList`/`questionBroken`; verifies the "no
   correct answer / self-correcting explanation" catch fires and never flags a sound one).
2. **Run it:** `python -m http.server 8744` in this dir, open
   `http://localhost:8744/index.html`.
3. **JS syntax check** without a browser:
   `node -e "new Function(require('fs').readFileSync('battle.js','utf8'))"` and
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
