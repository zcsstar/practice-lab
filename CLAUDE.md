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
  `packsDeleted`/`refsDeleted` (tombstones) and `cleared` (`"store:profileId"→ts`
  for Clear-bank/Clear-history) — see Drive sync.
- **IndexedDB** (`practicelab`, v3), four stores:
  - `attempts` — every completed practice (full question + result snapshot)
  - `review` — wrong/unsure questions for spaced revision (`mastered` after 2
    correct re-answers; carry a `dueAt` for spaced repetition — see Mistakes notebook)
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
  `practicelab.usage`; `freeDailyLimit()` is 20 for Gemini. `viewBank()` is the
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
- **Views** — `viewHome/Setup/Run/Results/Review/History/Settings/Profiles/Refs/
  Bank/Dashboard/Skills/Guide`. `show(node)` swaps `#app` and re-runs KaTeX. No router;
  functions call each other. `viewBank` = question-bank hub; `viewDashboard` =
  parent-only all-students progress overview; `viewSkills` = exam-topic coverage map;
  `viewGuide` = "How it works" guide (header ❓ + auto-shows on first run via the
  `practicelab.guideSeen` flag). **`viewHome` groups the menu into labelled section
  cards** via a `sectionCard()` helper: **Practise** (Start a practice · 🎯 weak spots ·
  Mistakes notebook · Question bank), **Track progress** (Progress · Skills map · My
  cards · All students) and **Exam content** (Reference library · Exam packs); empty /
  parent-only sections are dropped.
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
    verdict can't slip a wrong answer through) — a `fix` still repoints. The verify + AI-grade
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
    section and atop the Skills map.
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
  to `.figure` max-width 420px, centred).
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
  sugar refining, ethanol production, food chains, life cycles). Aliases tolerated
  (e.g. `map`→routemap, `process`/`foodchain`→flow). Pure string output
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
  minor on each release (currently at **v2.30**). Claude suggests the next number on
  each deploy; Chi decides. **Push only to the personal `zcsstar` GitHub** (never the
  work account) — headless method: `git push "https://x-access-token:$(gh auth token
  --user zcsstar)@github.com/zcsstar/practice-lab.git" main` (the GCM popup can't reach
  the desktop from this environment). Packs/refs are gitignored (copyright); committed
  files are `index.html` + sibling scripts + docs.

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
