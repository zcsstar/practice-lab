/* Test the deterministic broken-question detectors extracted from index.html:
 * explanationSelfCorrects / mcConcludesOffList / questionBroken. These drop a
 * question whose explanation admits it's wrong or whose worked conclusion isn't
 * among the options — BEFORE it's shown or marked (the reported "no correct answer
 * in the options, explanation says 'I got it wrong…'" case). Must NOT flag sound
 * questions. */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// Brace-matching extractor (same approach as repoint.test.js), regex/string/comment aware.
function extract(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('not found: ' + name);
  let i = src.indexOf('{', start), depth = 0, inStr = false, q = '', esc = false, prev = '';
  const REGEX_CTX = /[([{,;:=!&|?+\-*%~^<>]/;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; prev = c; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i++; prev = '/'; continue; }
    if (c === '/' && REGEX_CTX.test(prev || '(')) {
      let cls = false, re = false;
      for (i++; i < src.length; i++) { const d = src[i]; if (re) { re = false; continue; } if (d === '\\') re = true; else if (d === '[') cls = true; else if (d === ']') cls = false; else if (d === '/' && !cls) break; }
      while (i + 1 < src.length && /[a-z]/i.test(src[i + 1])) i++;
      prev = '/'; continue;
    }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    if (!/\s/.test(c)) prev = c;
  }
  return src.slice(start, i);
}
const selfRe = src.match(/const SELF_CORRECT_RE=[^\n]*;/)[0]; // module-level const the detector uses

const ctx = {};
new Function(
  selfRe + '\n' + extract('plainMath') + '\n' + extract('plValTokens') + '\n' +
  extract('explanationSelfCorrects') + '\n' + extract('mcConcludesOffList') + '\n' + extract('questionBroken') + '\n' +
  'this.explanationSelfCorrects=explanationSelfCorrects;this.mcConcludesOffList=mcConcludesOffList;this.questionBroken=questionBroken;'
).call(ctx);
const { explanationSelfCorrects, mcConcludesOffList, questionBroken } = ctx;

let pass = 0, fail = 0;
const check = (desc, got, expected) => { if (got === expected) pass++; else { fail++; console.log(`  ✗ ${desc}\n      expected ${expected}, got ${got}`); } };

// ── explanationSelfCorrects: the reported symptom + think-aloud tells ─────────
check('reported: "I got it wrong and the correct answer should be…"', explanationSelfCorrects('I got it wrong and the correct answer should be 12, which is not shown.'), true);
check('"None of the options are correct"', explanationSelfCorrects('None of the options are correct here.'), true);
check('"wait, let me reconsider"', explanationSelfCorrects('The answer is 5. Wait, let me reconsider this.'), true);
check('"my mistake"', explanationSelfCorrects('Sorry, my mistake — it should be 8.'), true);
check('"not one of the options"', explanationSelfCorrects('The result is 42, which is not one of the options.'), true);
// clean explanations must NOT be flagged
check('clean numbered explanation not flagged', explanationSelfCorrects('1. Add 3 and 4. 2. That gives 7. The answer is 7.'), false);
check('"the correct answer is B" (no self-correction) not flagged', explanationSelfCorrects('The correct answer is B because 3 + 4 = 7.'), false);
check('mentions "correct option" plainly, not flagged', explanationSelfCorrects('Pick the correct option by comparing the totals.'), false);

// ── mcConcludesOffList: MC whose conclusion isn't among the options ──────────
const mc = (opts, expl) => ({ type: 'multiple_choice', options: opts, answerIndex: 0, explanation: expl });
check('concludes "is 12", options 4/6/8/9 → off-list', mcConcludesOffList(mc(['4', '6', '8', '9'], 'Adding them up, the total is 12.')), true);
check('concludes "= 5", options 1/2/3/4 → off-list', mcConcludesOffList(mc(['1', '2', '3', '4'], 'So x = 5.')), true);
check('concludes an option value (9) → NOT off-list', mcConcludesOffList(mc(['4', '6', '8', '9'], 'There are 9 different values, so the answer is 9.')), false);
check('divisors: concludes 9 (an option) → not broken', mcConcludesOffList(mc(['4', '6', '8', '9'], 'Counting the unique divisors, there are 9.')), false);
check('incidental trailing number w/o conclusion cue → not judged', mcConcludesOffList(mc(['4', '6', '8', '9'], 'The answer is 8. Then you can divide by 4.')), false);
check('non-numeric options → not judged', mcConcludesOffList(mc(['Red', 'Green', 'Blue', 'Yellow'], 'Mixing gives 12 shades, so Green.')), false);
check('some option non-numeric → not judged', mcConcludesOffList(mc(['4', '6', 'eight', '9'], 'The total is 12.')), false);
check('empty explanation → not broken', mcConcludesOffList(mc(['1', '2', '3', '4'], '')), false);

// ── questionBroken combines both, and leaves sound questions alone ───────────
check('questionBroken: self-correcting explanation', questionBroken(mc(['1', '2', '3', '4'], 'Actually, the correct answer should be 9.')), true);
check('questionBroken: off-list MC conclusion', questionBroken(mc(['1', '2', '3', '4'], 'So the value is 12.')), true);
check('questionBroken: sound MC not flagged', questionBroken(mc(['4', '6', '8', '9'], 'Adding step by step, the answer is 8.')), false);
check('questionBroken: numeric/short with clean working not flagged', questionBroken({ type: 'numeric', answer: '200', explanation: '80 × 2.5 = 200.' }), false);
check('questionBroken: null-safe', questionBroken(null), false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
