/* Temp test: extract plainMath + repointFromExplanation from index.html and
 * verify the mis-key backstop on the two reported questions + safety cases. */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// Pull a `function NAME(...) {...}` body out of the source by brace-matching.
// Regex-aware: skips string/template literals, // and /* */ comments, and REGEX
// literals (incl. their [char classes] and {quantifiers}) so braces/quotes inside
// them don't throw off the depth count.
function extract(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('not found: ' + name);
  let i = src.indexOf('{', start), depth = 0, inStr = false, q = '', esc = false, prev = '';
  const REGEX_CTX = /[([{,;:=!&|?+\-*%~^<>]/; // a `/` here starts a regex, not division
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; prev = c; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i++; prev = '/'; continue; }
    if (c === '/' && REGEX_CTX.test(prev || '(')) {
      let cls = false, re = false;                 // skip a regex literal to its closing '/'
      for (i++; i < src.length; i++) {
        const d = src[i];
        if (re) { re = false; continue; }
        if (d === '\\') { re = true; }
        else if (d === '[') cls = true;
        else if (d === ']') cls = false;
        else if (d === '/' && !cls) break;
      }
      while (i + 1 < src.length && /[a-z]/i.test(src[i + 1])) i++; // flags
      prev = '/'; continue;
    }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    if (!/\s/.test(c)) prev = c;
  }
  return src.slice(start, i);
}

const ctx = {};
new Function(
  extract('plainMath') + '\n' + extract('plValTokens') + '\n' +
  extract('repointFromExplanation') + '\n' + extract('repointFromNumericCondition') + '\n' +
  extract('repointFromSequence') + '\n' + extract('dedupeOptions') + '\n' +
  extract('repointFromWhyWrong') + '\n' +
  'this.repointFromExplanation=repointFromExplanation;this.repointFromNumericCondition=repointFromNumericCondition;this.repointFromSequence=repointFromSequence;this.dedupeOptions=dedupeOptions;this.repointFromWhyWrong=repointFromWhyWrong;'
).call(ctx);
const repoint = ctx.repointFromExplanation;
const numCond = ctx.repointFromNumericCondition;
const seq = ctx.repointFromSequence;
const dedupe = ctx.dedupeOptions;
const whyWrong = ctx.repointFromWhyWrong;

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

// ── Counting questions ("how many …"): the concluded COUNT is followed by an
//    enumeration of the counted items and a "N-digit" descriptor, so a naive
//    scan-from-end grabs a listed code / the "4" of "4-digit" instead of the
//    count. (Reported: the ?37? lock-code question.) ──────────────────────────
check('lock code "how many": concludes 3 codes, key wrongly D (4)', {
  type: 'multiple_choice',
  question: 'A code for a lock is a 4-digit number shown as ?37?. Less than 5000, even, divisible by 3, made of 4 different digits. How many possible 4-digit codes are there?',
  options: ['1', '2', '3', '4'],
  answerIndex: 3,                       // mis-keyed to D (4)
  answer: '4',
  explanation: 'The code is ?37?, so A37B. Less than 5000: A can be 1, 2, 3, 4. Even: B is 0, 2, 4, 6, 8. 4 different digits: 3 and 7 are used, so A is 1, 2 or 4. Divisible by 3: A + 3 + 7 + B = A + B + 10. There are 3 possible 4-digit codes: 1374, 2370, 2376.'
}, 2);

// Safety: the same counting question correctly keyed to C (3) must not move.
check('lock code correctly keyed C (3) stays put', {
  type: 'multiple_choice',
  question: 'How many possible 4-digit codes are there?',
  options: ['1', '2', '3', '4'],
  answerIndex: 2,
  answer: '3',
  explanation: 'There are 3 possible 4-digit codes: 1374, 2370, 2376.'
}, 2);

// Safety: a distractor count inside a counting explanation is ignored.
check('counting: distractor "a common mistake is 4" ignored, concludes 3', {
  type: 'multiple_choice',
  question: 'How many valid numbers are there?',
  options: ['2', '3', '4', '5'],
  answerIndex: 2,                       // mis-keyed to 4
  answer: '4',
  explanation: 'Checking each case, there are 3 valid numbers. A common mistake is 4 numbers.'
}, 1);

// Non-counting: a trailing "4-digit" descriptor must not be read as the result.
check('non-counting: trailing "4-digit" descriptor skipped, concludes 8', {
  type: 'multiple_choice',
  question: 'Which number works?',
  options: ['4', '8', '12', '16'],
  answerIndex: 0,                       // mis-keyed to 4
  answer: '4',
  explanation: 'Testing values, only 8 works. Remember the code is a 4-digit number.'
}, 1);

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

// ── "cannot" is a real negation the \b-anchoring must still catch ─────────────
check('"cannot be 8" distractor skipped, concludes 6 → B', {
  type: 'multiple_choice',
  options: ['4', '6', '7', '8'],
  answerIndex: 3,                       // mis-keyed to D (8)
  answer: '8',
  explanation: 'The answer is 6. It cannot be 8.'
}, 1);

// ── "trapezoid"/"trapezium" must NOT be mistaken for the "trap" distractor word ─
check('geometry "trapezoid area is 24" not treated as distractor → repoints to 24 (B)', {
  type: 'multiple_choice',
  options: ['12', '24', '30', '36'],
  answerIndex: 0,                       // mis-keyed to A (12)
  answer: '12',
  explanation: 'The trapezoid area is 24.'
}, 1);

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

// ── Time answers: 8:00/8:10/8:15 must stay distinct (was: all collapsed to "8") ─
check('time: leaves 7:30 + 45min → 8:15 is C, key was B (8:10)', {
  type: 'multiple_choice',
  options: ['7:45 am', '8:10 am', '8:15 am', '8:20 am'],
  answerIndex: 1,                       // mis-keyed to B (8:10)
  answer: '8:10 am',
  explanation: 'Start time is $7:30$ am. Add 30 minutes to reach $8:00$ am. There are 15 minutes left ($45-30=15$). Add the remaining 15 minutes to $8:00$ am. Whaea Mere arrives at $8:15$ am.'
}, 2);

check('time: correctly keyed 8:15 stays put', {
  type: 'multiple_choice',
  options: ['7:45 am', '8:10 am', '8:15 am', '8:20 am'],
  answerIndex: 2,
  answer: '8:15 am',
  explanation: 'Whaea Mere arrives at $8:15$ am.'
}, 2);

// ── Mixed numbers: 3/4 × 2½ = 15/8 = 1⅞ is A, key wrongly on B (2¼) ────────────
check('mixed number: 15/8 = 1 7/8 is A, key was B', {
  type: 'multiple_choice',
  options: ['$1\\frac{7}{8}$ cups', '$2\\frac{1}{4}$ cups', '$1\\frac{1}{2}$ cups', '$2\\frac{1}{2}$ cups'],
  answerIndex: 1,                       // mis-keyed to B
  answer: '$2\\frac{1}{4}$ cups',
  explanation: 'Convert mixed numbers to improper fractions: $2\\frac{1}{2} = \\frac{5}{2}$. Multiply the fractions: $\\frac{3}{4} \\times \\frac{5}{2} = \\frac{15}{8}$. Convert back to a mixed number: $\\frac{15}{8} = 1\\frac{7}{8}$.'
}, 0);

// ── Duplicate options: two identical "3/8" collapse; key follows survivor ──────
{
  const d = dedupe({
    type: 'multiple_choice',
    options: ['$\\frac{3}{8}$', '$\\frac{2}{8}$', '$\\frac{3}{5}$', '$\\frac{3}{8}$'],
    answerIndex: 3,                     // keyed to the DUPLICATE copy
    answer: '$\\frac{3}{8}$',
    whyWrong: ['', 'too few', 'wrong denom', '']
  });
  const ok = d.options.length === 3 && d.answerIndex === 0 && d.whyWrong.length === 3;
  if (ok) { pass++; } else { fail++; console.log(`  ✗ duplicate options collapse\n      got options=${JSON.stringify(d.options)} answerIndex=${d.answerIndex}`); }
}
// Non-duplicate options must be left untouched (identity)
{
  const d = dedupe({ type: 'multiple_choice', options: ['1', '2', '3', '4'], answerIndex: 2 });
  if (d.options.length === 4 && d.answerIndex === 2) { pass++; }
  else { fail++; console.log('  ✗ non-duplicate options changed'); }
}

// ── whyWrong ↔ key consistency: keyed option has a "why wrong" reason (contradiction)
//    and exactly one option is blank → repoint to the blank (model's real "correct") ──
{
  const q = whyWrong({ type: 'multiple_choice', options: ['A', 'B', 'C', 'D'], answerIndex: 1, whyWrong: ['', 'off by one', 'forgot to carry', 'used wrong op'] });
  if (q.answerIndex === 0) pass++; else { fail++; console.log('  ✗ whyWrong repoints to the blank option, got ' + q.answerIndex); }
}
// Safety: a cleanly-keyed question (correct option blank) must NOT change.
{
  const q = whyWrong({ type: 'multiple_choice', options: ['A', 'B', 'C', 'D'], answerIndex: 2, whyWrong: ['wrong', 'wrong', '', 'wrong'] });
  if (q.answerIndex === 2) pass++; else { fail++; console.log('  ✗ whyWrong changed a clean key, got ' + q.answerIndex); }
}
// Safety: two blanks (convention not followed) → no-op.
{
  const q = whyWrong({ type: 'multiple_choice', options: ['A', 'B', 'C', 'D'], answerIndex: 1, whyWrong: ['', '', 'wrong', 'wrong'] });
  if (q.answerIndex === 1) pass++; else { fail++; console.log('  ✗ whyWrong acted on ambiguous blanks, got ' + q.answerIndex); }
}
// Safety: no whyWrong / mismatched length → no-op.
{
  const q = whyWrong({ type: 'multiple_choice', options: ['A', 'B', 'C', 'D'], answerIndex: 1, whyWrong: ['only one'] });
  if (q.answerIndex === 1) pass++; else { fail++; console.log('  ✗ whyWrong acted on mismatched-length array'); }
}

// ── Word-boundary distractor fix: "aNOTher" must not trip the "not" filter ─────
// Reported Q14: "…minus another 5 minutes is 8:15 AM" — "another" contains "not", so the
// concluding 8:15 was wrongly skipped and the key stayed on the wrong 8:20.
check('time: "another" no longer masks the concluding 8:15 (C)', {
  type: 'multiple_choice',
  question: 'You need to be at school by 8:40 AM. The walk takes 25 minutes. What is the latest time you should leave?',
  options: ['8:05 AM', '8:10 AM', '8:15 AM', '8:20 AM'],
  answerIndex: 3,                       // mis-keyed to D (8:20, an intermediate step)
  answer: '8:20 AM',
  explanation: '8:40 AM minus 20 minutes is 8:20 AM. Minus another 5 minutes is 8:15 AM.'
}, 2);

// repointFromExplanation must BAIL on sequence options (leave them to repointFromSequence),
// so it can't mis-fire by matching the last number to an option that merely starts with it.
check('sequence options → repointFromExplanation is a no-op', {
  type: 'multiple_choice',
  question: 'Order the angles from smallest to largest.',
  options: ['1, 2, 3, 4', '2, 1, 3, 4', '4, 3, 2, 1', '1, 3, 2, 4'],
  answerIndex: 2,
  answer: '4, 3, 2, 1',
  explanation: 'Therefore the order from smallest to largest is 1, 2, 3, 4.'
}, 2);   // unchanged by repointFromExplanation; repointFromSequence handles it (tested below)

// ── repointFromNumericCondition: select-the-value questions grounded in the question ──
const nc = (desc, q, expected) => { const r = numCond({ ...q }); if (r.answerIndex === expected) pass++; else { fail++; console.log(`  ✗ ${desc}\n      expected answerIndex ${expected}, got ${r.answerIndex}`); } };
// Reported Q1: elimination explanation ends on the rejected 0.30; only 0.6 is in (0.3, 0.75).
nc('decimals: only 0.6 is >0.3 and <0.75 → C', {
  type: 'multiple_choice',
  question: 'Which decimal is larger than 0.3 but smaller than 0.75?',
  options: ['0.25', '0.8', '0.6', '0.30'], answerIndex: 3, answer: '0.30'
}, 2);
nc('between 20 and 30: only 24 qualifies → repoint', {
  type: 'multiple_choice',
  question: 'Which number is between 20 and 30?',
  options: ['12', '24', '35', '40'], answerIndex: 0
}, 1);
nc('at least 100: only 120 qualifies → repoint', {
  type: 'multiple_choice',
  question: 'Which value is at least 100?',
  options: ['50', '75', '99', '120'], answerIndex: 0
}, 3);
// Safety: two options satisfy → ambiguous → abstain (leave the key).
nc('two options satisfy → abstain', {
  type: 'multiple_choice',
  question: 'Which number is greater than 5?',
  options: ['3', '7', '9', '2'], answerIndex: 1
}, 1);
// Safety: already correctly keyed → no change.
nc('correctly keyed selection stays put', {
  type: 'multiple_choice',
  question: 'Which decimal is larger than 0.3 but smaller than 0.75?',
  options: ['0.25', '0.8', '0.6', '0.30'], answerIndex: 2
}, 2);
// Safety: not a "which value" question → abstain.
nc('non-selection question → abstain', {
  type: 'multiple_choice',
  question: 'What is 4 plus 5?',
  options: ['7', '8', '9', '10'], answerIndex: 3
}, 3);
// Safety: non-numeric options → abstain.
nc('non-numeric options → abstain', {
  type: 'multiple_choice',
  question: 'Which colour is warmer than blue?',
  options: ['red', 'green', 'grey', 'black'], answerIndex: 1
}, 1);
// Safety: negated comparison ("no more than") inverts the sense → abstain, never mis-repoint.
nc('"no more than 10" negated comparison → abstain', {
  type: 'multiple_choice',
  question: 'Which number is no more than 10?',
  options: ['8', '12', '15', '20'], answerIndex: 1
}, 1);
nc('"not greater than 10" negated comparison → abstain', {
  type: 'multiple_choice',
  question: 'Which value is not greater than 10?',
  options: ['8', '12', '15', '20'], answerIndex: 2
}, 2);
// Safety: an INCIDENTAL threshold in the scenario ("a whale weighs more than 40 tonnes") is NOT the
// selection rule — restricting the scan to the pick clause + bailing on factor/even keeps the key.
nc('incidental scenario threshold + "factor of 12" → abstain', {
  type: 'multiple_choice',
  question: 'A whale weighs more than 40 tonnes. Which number is a factor of 12?',
  options: ['4', '44', '5', '7'], answerIndex: 0
}, 0);
nc('incidental "scored more than 15" + "which is even" → abstain', {
  type: 'multiple_choice',
  question: 'Ana scored more than 15 points. Which number is even?',
  options: ['4', '20', '7', '9'], answerIndex: 0
}, 0);
// Safety: "somewhat"/"whatever" must not truncate the pick slice (word-boundary head match).
nc('"somewhat" does not truncate pick → key stays', {
  type: 'multiple_choice',
  question: 'Which value is less than 5 for a class that is somewhat more than 30 pupils?',
  options: ['3', '40', '2', '1'], answerIndex: 0
}, 0);
// Safety: an incidental comparison about a DIFFERENT noun (in a sub-clause) → abstain.
nc('"the shop with more than 50 boxes" incidental (different noun) → abstain', {
  type: 'multiple_choice',
  question: 'Which number of apples did the shop with more than 50 boxes sell?',
  options: ['55', '12', '30', '44'], answerIndex: 1
}, 1);

// ── repointFromSequence: ordering answers matched as full tuples ──────────────
const sq = (desc, q, expected) => { const r = seq({ ...q }); if (r.answerIndex === expected) pass++; else { fail++; console.log(`  ✗ ${desc}\n      expected answerIndex ${expected}, got ${r.answerIndex}`); } };
// Reported Q4: explanation concludes "1, 2, 3, 4" (A); key wrongly on C (4,3,2,1).
sq('angles order 1,2,3,4 is A, key was C', {
  type: 'multiple_choice',
  question: 'What is the order of the angles from smallest to largest?',
  options: ['1, 2, 3, 4', '2, 1, 3, 4', '4, 3, 2, 1', '1, 3, 2, 4'], answerIndex: 2, answer: '4, 3, 2, 1',
  explanation: 'Angle 1 is smallest and angle 4 is largest. Therefore the order from smallest to largest is 1, 2, 3, 4.'
}, 0);
// Safety: correctly keyed ordering stays put.
sq('correctly keyed ordering stays put', {
  type: 'multiple_choice',
  question: 'Order them.',
  options: ['1, 2, 3, 4', '4, 3, 2, 1'], answerIndex: 1,
  explanation: 'Largest first: the order is 4, 3, 2, 1.'
}, 1);
// Safety: single-value options → not a sequence → no-op.
sq('single-value options → sequence no-op', {
  type: 'multiple_choice',
  question: 'Which is largest?',
  options: ['1', '2', '3', '4'], answerIndex: 0,
  explanation: 'The largest is 4.'
}, 0);
// Safety: a REJECTED sequence stated last ("…is 1,2,3,4, not 4,3,2,1") must not win — the negation
// guard skips it and the correct order (A) still gets keyed.
sq('rejected trailing sequence ignored → keeps correct order A', {
  type: 'multiple_choice',
  question: 'Order the angles from smallest to largest.',
  options: ['1, 2, 3, 4', '2, 1, 3, 4', '4, 3, 2, 1', '1, 3, 2, 4'], answerIndex: 2, answer: '4, 3, 2, 1',
  explanation: 'The correct order from smallest to largest is 1, 2, 3, 4, not 4, 3, 2, 1.'
}, 0);
// Safety: a trailing REVERSED-order aside ("Reversed that would be 8,6,4,2") must not win.
sq('reversed-order aside ignored → correct key stays', {
  type: 'multiple_choice',
  question: 'Which row shows 2, 4, 6, 8 in order?',
  options: ['2, 4, 6, 8', '8, 6, 4, 2', '4, 2, 8, 6', '6, 8, 2, 4'], answerIndex: 0,
  explanation: 'Counting by twos the order is 2, 4, 6, 8. Reversed that would be 8, 6, 4, 2.'
}, 0);
// Safety: an incidental number run with NO ordering cue ("the ends are 1 and 3") must not repoint.
sq('incidental run without conclusion cue → no repoint', {
  type: 'multiple_choice',
  question: 'Order these from least to greatest.',
  options: ['1, 2, 3', '3, 2, 1', '2, 1, 3'], answerIndex: 0,
  explanation: 'The middle value is 2 and the ends are 1 and 3.'
}, 0);
// Safety: for an ASCENDING question, a "descending order is 4,3,2,1" restatement must be treated as a
// contrast (wrong direction) and NOT beat the un-cued-adjacent true conclusion "…they are 1,2,3,4".
sq('descending restatement not chosen for ascending Q → key stays', {
  type: 'multiple_choice',
  question: 'Which shows them smallest to largest?',
  options: ['1, 2, 3, 4', '4, 3, 2, 1', '3, 1, 2, 4'], answerIndex: 0,
  explanation: 'Their descending order is 4, 3, 2, 1. So smallest to largest, they are 1, 2, 3, 4.'
}, 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
