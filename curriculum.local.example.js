/* ============================================================================
 * Practice Lab — LOCAL curriculum grounding (OPTIONAL template)
 * ----------------------------------------------------------------------------
 * The app ALREADY ships a built-in NZ Maths (Years 0–10) curriculum summary that
 * grounds the Knowledge map automatically — you do NOT need this file for that.
 *
 * Use this file ONLY to ADD your own grounding docs, e.g.:
 *   - the OFFICIAL full curriculum text (better fidelity than the built-in summary),
 *   - other subjects (English, Science),
 *   - a different country/exam.
 * A doc added here is NEWER than the built-in one, so for a matching subject it
 * takes precedence when the Knowledge map grounds.
 *
 * HOW TO USE
 *   1. COPY this file to  curriculum.local.js  (same folder as index.html).
 *        curriculum.local.js is gitignored (private) — it is NEVER committed.
 *   2. Fill in `text` (open Reference library → 🔗 Official curriculum sources →
 *        Open the source → download the PDF → copy its text → paste below).
 *   3. Reload the app, then Knowledge map → ↻ Rebuild map.
 *   NOTE: because it's gitignored it is NOT on the hosted (GitHub Pages) site — it
 *   auto-imports where the file physically sits (your local copy) and then
 *   Drive-syncs to the other devices. Keep Drive sync ON.
 *
 * COPYRIGHT: never paste ICAS's framework text into a file you might commit. This
 * .local.js stays on your machine, so your own notes / govt curriculum text are fine.
 * `id` must be stable & unique (re-seeding dedupes on it; a deleted doc won't return).
 * ========================================================================== */

window.PL_CURRICULUM = [
  {
    id: 'nz-maths-official',                    // unique id (≠ the built-in 'nz-maths-default')
    name: 'NZ Curriculum — Maths (official text)',
    subject: 'Mathematics',                     // must match the practice subject to ground it
    exam: '',                                   // optional; '' = matches any exam for this subject
    level: '',                                  // optional
    country: 'New Zealand',
    text: `PASTE THE OFFICIAL NZ MATHEMATICS CURRICULUM TEXT HERE (from the source link).
Until you do, delete this entry — the app's built-in summary already grounds the map.`
  },

  /* ---- Add more (copy the entry above with a NEW id). Examples:
  { id:'nz-english', name:'NZ Curriculum — English', subject:'English', country:'New Zealand',
    text:`... paste/summarise the English learning-area objectives ...` },
  { id:'nz-science', name:'NZ Curriculum — Science', subject:'Science', country:'New Zealand',
    text:`... Nature of Science, Living World, Physical World, Material World, Planet Earth & Beyond ...` },
  ---- */
];
