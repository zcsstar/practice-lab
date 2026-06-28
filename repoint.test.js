/* Temp test: extract plainMath + repointFromExplanation from index.html and
 * verify the mis-key backstop on the two reported questions + safety cases. */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// Pull a `function NAME(...) {...}` body out of the source by brace-matching.
function extract(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('not found: ' + name);
  let i = src.indexOf('{', start), depth = 0, inStr = false, q = '', esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
    else if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(start, i);
}

const ctx = {};
new Function(extract('plainMath') + '\n' + extract('repointFromExplanation') + '\nthis.repointFromExplanation=repointFromExplanation;').call(ctx);
const repoint = ctx.repointFromExplanation;

let pass = 0, fail = 0;
const check = (desc, q, expected) => {
  const r = repoint({ ...q });
  const got = r.answerIndex;
  if (got === expected) { pass++; }
  else { fail++; console.log(`  ✗ ${desc}\n      expected answerIndex ${expected}, got ${got}`); }
};

// ── The two reported bugs ────────────────────────────────────────────────────
// Q2: explanation concludes 200 km; key wrongly points to B (180). Options A-D.
check('Q2 speed/distance: 200 is C, key was B', {
  type: 'multiple_choice',
  options: ['160 km', '180 km', '200 km', '220 km'],
  answerIndex: 1,                       // mis-keyed to B
  answer: '180 km',
  explanation: 'Convert time to hours: 2 hours and 30 minutes is 2.5 hours. Use the formula distance = speed × time: Distance = $80$ km/h × $2.5$ h. Calculate the distance: $80 × 2.5 = 200$ km.'
}, 2);

// Q4: explanation lists 9 divisors and concludes 9; key wrongly points to B (6).
check('Q4 divisors of 36: 9 is D, key was B', {
  type: 'multiple_choice',
  options: ['4', '6', '8', '9'],
  answerIndex: 1,                       // mis-keyed to B
  answer: '6',
  explanation: 'List all pairs of positive integer factors of 36: (1, 36), (2, 18), (3, 12), (4, 9), (6, 6), (9, 4), (12, 3), (18, 2), (36, 1). Count the unique values for A: These are 1, 2, 3, 4, 6, 9, 12, 18, 36. There are 9 different possible values for A.'
}, 3);

// ── Safety: a correctly-keyed question must NOT be changed ────────────────────
check('correct key stays put (200 already C)', {
  type: 'multiple_choice',
  options: ['160 km', '180 km', '200 km', '220 km'],
  answerIndex: 2,
  answer: '200 km',
  explanation: 'Distance = $80 × 2.5 = 200$ km.'
}, 2);

// ── Safety: a distractor mention in the explanation must not mislead ──────────
check('distractor "a common mistake is 180" ignored, answer 200 → C', {
  type: 'multiple_choice',
  options: ['160 km', '180 km', '200 km', '220 km'],
  answerIndex: 1,                       // mis-keyed to B
  answer: '180 km',
  explanation: 'Distance = speed × time = $80 × 2.5 = 200$ km. A common mistake is to get 180 by forgetting the half hour.'
}, 2);

// ── Safety: "not 6, there are 9" negation ────────────────────────────────────
check('negation "not 6" ignored, concludes 9 → D', {
  type: 'multiple_choice',
  options: ['4', '6', '8', '9'],
  answerIndex: 1,
  answer: '6',
  explanation: 'The answer is not 6. Counting the divisors gives 9.'
}, 3);

// ── Safety: non-numeric options left untouched ───────────────────────────────
check('non-numeric options untouched', {
  type: 'multiple_choice',
  options: ['Red', 'Green', 'Blue', 'Yellow'],
  answerIndex: 0,
  answer: 'Red',
  explanation: 'Mixing blue and yellow makes green, so the answer is Green.'
}, 0);

// ── Safety: short-answer (non-MC) untouched ──────────────────────────────────
check('non-MC type untouched', {
  type: 'numeric', options: undefined, answerIndex: undefined, answer: '200',
  explanation: '80 × 2.5 = 200'
}, undefined);

// ── Fraction answer via \frac ────────────────────────────────────────────────
check('fraction: explanation 1/2 → option C', {
  type: 'multiple_choice',
  options: ['$\\frac{1}{4}$', '$\\frac{1}{3}$', '$\\frac{1}{2}$', '$\\frac{3}{4}$'],
  answerIndex: 0,                       // mis-keyed to A
  answer: '$\\frac{1}{4}$',
  explanation: 'Half the cake remains, so the fraction is $\\frac{1}{2}$.'
}, 2);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
