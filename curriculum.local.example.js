/* ============================================================================
 * Practice Lab — LOCAL curriculum grounding (TEMPLATE)
 * ----------------------------------------------------------------------------
 * WHAT THIS IS
 *   Curriculum / syllabus TEXT that the app auto-imports on load and uses to
 *   GROUND the Knowledge map (its strands, formulas and concept cards) in real
 *   objectives instead of pure AI memory. It becomes a shared "Curriculum"
 *   reference (Reference library → 📘 syllabus) and syncs to your other devices.
 *
 * HOW TO USE (one-time, ~2 minutes)
 *   1. COPY this file to  curriculum.local.js  (same folder as index.html).
 *        - curriculum.local.js is gitignored (private) — it is NEVER committed.
 *        - curriculum.local.example.js (this file) is just the template.
 *   2. (Optional but best) Replace the `text` below with the REAL syllabus text:
 *        open the official source (Reference library → 🔗 Official curriculum
 *        sources → Open), download the PDF, copy its text, and paste it in.
 *        The summary already here works fine as a starting point.
 *   3. Reload the app. Then open the Knowledge map → ↻ Rebuild map.
 *        It now shows "Grounded on: 📄 <name>".
 *
 * NOTES
 *   - TEXT only (no PDFs) — keeps it light and lets it sync across devices.
 *   - Do NOT paste copyrighted framework text (e.g. ICAS's) into a file you
 *     might commit. This .local.js stays on your machine, so your own notes are
 *     fine; just never commit it. Government curriculum text (NZ Curriculum,
 *     NZQA) is fine to keep locally.
 *   - `id` must be stable & unique (re-seeding dedupes on it). Deleting the doc
 *     in the app keeps it deleted (it won't re-seed).
 *   - Add as many entries as you like (per subject / exam / level).
 * ========================================================================== */

window.PL_CURRICULUM = [
  {
    id: 'nz-maths-y0-10',                       // stable unique id
    name: 'NZ Curriculum — Maths (Years 0–10) summary',
    subject: 'Mathematics',                     // must match the practice subject to ground it
    exam: '',                                   // optional; '' = matches any exam for this subject
    level: '',                                  // optional
    country: 'New Zealand',
    text: `NEW ZEALAND MATHEMATICS & STATISTICS — Years 0–10 (curriculum levels 1–5). Summary of strands and progression, for grounding practice questions and learn cards. (Replace with the official curriculum text for best fidelity — see 🔗 Official curriculum sources.)

STRANDS
1. Number & Algebra — number knowledge & strategies; place value; whole numbers, fractions, decimals, percentages, integers; the four operations; ratio, rate & proportion; patterns & relationships; expressions & equations (early algebra).
2. Measurement & Geometry — length, area, volume/capacity, mass, temperature, time and money; metric units & conversions; perimeter/area/volume; 2D & 3D shapes; angles; symmetry; position, coordinates, transformations (reflection, rotation, translation), scale.
3. Statistics & Probability — posing questions & collecting data; displaying data (tables, pictographs, bar/column graphs, dot plots, line graphs); interpreting & comparing data; measures (mean, median, mode, range); chance & probability (likelihood, simple experiments, theoretical vs experimental).

PROGRESSION (approximate)
- Years 0–3 (L1–2): count, read, write and order whole numbers to ~1000; addition/subtraction basic facts; skip-counting & early multiplication; simple fractions (½, ¼); measure & compare with informal then standard units; tell time (hours, half/quarter hours); name and sort 2D/3D shapes; collect and display simple data; describe events as likely/unlikely.
- Years 4–6 (L2–3): place value to millions and 3 decimal places; +, −, ×, ÷ with whole numbers; equivalent fractions, decimals & simple percentages; multiplicative & proportional thinking; perimeter and area of rectangles; measure angles; lines of symmetry; grid coordinates; interpret bar graphs, dot plots, pictographs and tables; express simple probabilities as fractions.
- Years 7–8 (L4): integers (incl. negatives); fractions/decimals/percentages and conversions between them; ratio, rate and proportion; linear number patterns and solving for an unknown (one- and two-step equations); area of triangles/parallelograms/trapezia and volume of cuboids; angle rules (on a line, at a point, in triangles); enlargement & scale; interpret and compare data sets using mean/median/mode/range; probability of single events.
- Years 9–10 (L5): rational numbers, powers and square roots; algebraic manipulation, linear equations and their graphs; Pythagoras' theorem; area, surface area and volume of prisms and cylinders; similarity and scale factor; bivariate and time-series data; theoretical vs experimental probability.

KEY FORMULAS (primary → lower secondary)
- Perimeter = total distance around a shape.
- Area: rectangle = length × width; triangle = ½ × base × height; parallelogram = base × height; trapezium = ½ × (a + b) × height; circle area = π × r²; circle circumference = 2 × π × r (= π × diameter).
- Volume: cuboid = length × width × height.
- Average (mean) = sum of values ÷ number of values.
- Percentage of an amount = (percent ÷ 100) × amount.
- Pythagoras: a² + b² = c² (right-angled triangles).`
  },

  /* ---- ADD MORE (copy an entry above). Examples:
  {
    id: 'nz-english-y0-10',
    name: 'NZ Curriculum — English (Years 0–10) summary',
    subject: 'English', exam: '', country: 'New Zealand',
    text: `... paste or summarise the English learning-area objectives ...`
  },
  {
    id: 'nz-science-y0-10',
    name: 'NZ Curriculum — Science (Years 0–10) summary',
    subject: 'Science', exam: '', country: 'New Zealand',
    text: `... science strands: Nature of Science, Living World, Physical World, Material World, Planet Earth & Beyond ...`
  },
  ---- */
];
