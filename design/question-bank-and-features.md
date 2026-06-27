# Practice Lab — Question Bank & feature design (v9)

Design notes for the features added in `v9`. The north star was **cutting AI
usage without reducing question quality or accuracy**, plus a few learning /
engagement wins. Everything lives in the single `index.html`.

## 1. AI usage reduction — the Question Bank

### Problem
Gemini's free tier allows ~20 generations/day. A family of three burns through
that fast, and every practice was a fresh API call.

### Core idea
**One API call should feed several practices.** When we must call the model, we
ask for a *batch* (more than the session needs) and keep the surplus. Later
practices with the same setup are served from that surplus for free.

### Data model
New IndexedDB store **`bank`** (DB bumped to **v3**). Each record is a full
question snapshot plus:

| Field | Purpose |
|---|---|
| `profileId` | per-student isolation (same as other stores) |
| `key` | `country\|subject\|exam\|level\|difficulty\|style`, lowercased — the match key |
| `topic` | used for strict topic filtering when a topic is selected |
| `qhash` | normalized-text hash for de-duplication |
| `servedCount`, `lastServedAt` | least-served-first rotation so repeats are rare |

### Orchestration — `buildPracticeSet(s, files)`
1. **Bank-first.** `bankTake()` pulls matching questions (honouring selected
   topics strictly), marking them served.
2. **Full hit → 0 API calls** (`source:'bank'`). Toast: *"⚡ From your saved
   bank — no AI used today."*
3. **Miss / partial → 1 call** for a `BANK_PREFILL` (20) batch; the session uses
   what it needs and **only the unused surplus is banked** (avoids immediate
   repeats). `source:'mixed'` or `'generated'`.
4. **Past papers attached OR per-session notes → always fresh, never banked**
   (`source:'fresh'`) — accuracy/specificity when the user explicitly wants it
   is never compromised by stale bank content.

### Supporting pieces
- **`viewBank()`** — the bank hub: a daily AI-usage meter (`X / 20 free
  generations today`), banked counts per setup, a **Pre-generate (1 AI call)**
  button to stock up during downtime, and Clear.
- **Usage meter** — `localStorage` `practicelab.usage`, last ~21 days, surfaced
  on the bank screen and used to warn as the free limit approaches.
- Bank flows through **export/import** and **Drive sync** like the other stores.

### Other quality-neutral usage savers
- Review mode and bank practice make **zero** generation calls.
- Topic drills are bank-first (below).
- Marking remains fully local — no AI grading was added (it would *increase*
  calls).

### Two correctness rules learned the hard way (unit-tested)
- **`normQ` keeps math content** (strips only `$` delimiters). Stripping the
  whole `$…$` made `$2+2$` and `$3+3$` hash identically → false de-dupe.
- **`computeStreak` is UTC-throughout.** Attempt dates are stored via
  `todayISO()` (UTC); a local-midnight cursor mismatches by a day in NZ (+12).

## 2. Learning & engagement additions

| Feature | Where | Notes |
|---|---|---|
| **Generate-similar / topic drills** | History → weak topics "Practice" | `practiceTopic()` builds an 8-Q drill on one topic, bank-first |
| **Read-aloud** | runner + results (🔊) | Web Speech; `plainMath()` strips LaTeX/markdown so it sounds natural |
| **Day streak** | Home tile (🔥) | consecutive days ending today/yesterday |
| **Daily goal** | Home progress bar | `CFG.dailyGoal` (default 10) vs questions answered today |
| **All-students dashboard** | Home → parent only | per-kid practices, avg, streak, weakest topic |

## 3. UI conventions used
- Progress bars use `.gbar` / `.gbar-fill`; streak chip uses `.streak`.
- New views follow the existing `viewX()` + `show()` pattern and re-run KaTeX.
- Read-aloud and pre-generate buttons reuse the existing `.iconbtn` / `.btn`
  styles — no new visual language introduced.

## Testing
- Node unit tests against the *real* extracted functions (bank serve /
  over-generate / dedup / mixed / fresh, key matching, topic filter, streak).
- Browser (Playwright) end-to-end: seeded bank → practice served with 0 API
  calls → submit → results → streak/goal/dashboard/topic-drill verified.
