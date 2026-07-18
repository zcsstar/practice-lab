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
const PLDiagram = require('./diagram.js'); // real renderer/decoder, so figureContradictsKey reads true drawn values

const ctx = {};
new Function('PLDiagram',
  selfRe + '\n' + extract('plainMath') + '\n' + extract('plValTokens') + '\n' +
  extract('explanationSelfCorrects') + '\n' + extract('mcConcludesOffList') + '\n' +
  extract('figureContradictsKey') + '\n' + extract('questionBroken') + '\n' +
  extract('validateTree') + '\n' + extract('formulaCautions') + '\n' +
  'this.explanationSelfCorrects=explanationSelfCorrects;this.mcConcludesOffList=mcConcludesOffList;this.figureContradictsKey=figureContradictsKey;this.questionBroken=questionBroken;this.validateTree=validateTree;this.formulaCautions=formulaCautions;'
).call(ctx, PLDiagram);
const { explanationSelfCorrects, mcConcludesOffList, figureContradictsKey, questionBroken, validateTree, formulaCautions } = ctx;

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

// ── figureContradictsKey: pictogram/bar figure disagrees with the keyed answer ──
// The reported bug: a pictogram drawn with 1 banana icon (=3) but keyed to 9 (option C).
const picto = (rows, per, q, opts, ai) => ({ type: 'multiple_choice', options: opts, answerIndex: ai, question: q, diagram: { type: 'pictogram', icon: '🍎', per, rows } });
check('reported: pictogram draws Banana=3 but key on 9 → contradicts',
  figureContradictsKey(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }, { label: 'Orange', value: 3 }], 3, 'How many students chose Banana?', ['3', '6', '9', '12'], 2)), true);
check('correct pictogram (Banana=9), key on 9 → not flagged',
  figureContradictsKey(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 9 }, { label: 'Orange', value: 3 }], 3, 'How many students chose Banana?', ['3', '6', '9', '12'], 2)), false);
check('difference question ("how many more") not flagged even if key off',
  figureContradictsKey(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }], 3, 'How many more students chose Apple than Banana?', ['1', '3', '6', '9'], 3)), false);
check('total question ("altogether") not flagged',
  figureContradictsKey(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }], 3, 'How many students voted altogether?', ['3', '6', '9', '12'], 0)), false);
check('two labels in question (Apple or Banana) → not a single-row read',
  figureContradictsKey(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }], 3, 'How many chose Apple or Banana?', ['3', '6', '9', '12'], 1)), false);
check('non-numeric options → not judged',
  figureContradictsKey(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }], 3, 'Which fruit did Banana beat?', ['Apple', 'Orange', 'Kiwi', 'Pear'], 0)), false);
check('no diagram → not judged', figureContradictsKey({ type: 'multiple_choice', options: ['1', '2', '3', '4'], answerIndex: 0, question: 'How many chose Banana?' }), false);
check('figureContradictsKey null-safe', figureContradictsKey(null), false);

// ── questionBroken combines both, and leaves sound questions alone ───────────
check('questionBroken: pictogram figure contradicts key', questionBroken(picto([{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }], 3, 'How many students chose Banana?', ['3', '6', '9', '12'], 2)), true);
check('questionBroken: self-correcting explanation', questionBroken(mc(['1', '2', '3', '4'], 'Actually, the correct answer should be 9.')), true);
check('questionBroken: off-list MC conclusion', questionBroken(mc(['1', '2', '3', '4'], 'So the value is 12.')), true);
check('questionBroken: sound MC not flagged', questionBroken(mc(['4', '6', '8', '9'], 'Adding step by step, the answer is 8.')), false);
check('questionBroken: numeric/short with clean working not flagged', questionBroken({ type: 'numeric', answer: '200', explanation: '80 × 2.5 = 200.' }), false);
check('questionBroken: null-safe', questionBroken(null), false);

// ── validateTree: clean the knowledge tree into a foundational→advanced DAG ──
{
  const r = validateTree([{ id: 'a', prereq: [] }, { id: 'b', prereq: ['a', 'zzz'] }]);
  check('validateTree drops a dangling prereq', JSON.stringify(r.points[1].prereq), JSON.stringify(['a']));
  check('validateTree flags repaired on dangling', r.repaired, true);
}
check('validateTree drops a self-prereq', validateTree([{ id: 'a', prereq: ['a'] }]).points[0].prereq.length, 0);
check('validateTree drops a forward/cyclic prereq', validateTree([{ id: 'a', prereq: ['b'] }, { id: 'b', prereq: [] }]).points[0].prereq.length, 0);
{
  const r = validateTree([{ id: 'a', prereq: [] }, { id: 'b', prereq: ['a'] }]); // clean foundational→advanced
  check('validateTree keeps a valid earlier prereq', JSON.stringify(r.points[1].prereq), JSON.stringify(['a']));
  check('validateTree: clean tree not flagged repaired', r.repaired, false);
}
check('validateTree: non-array → empty+repaired', validateTree(null).points.length, 0);

// ── formulaCautions: flag known-wrong primary formulas (best-effort, no rewrite) ──
check('formula: triangle area ½(b+h) is flagged', formulaCautions('Area of a triangle', ['$A=\\frac{1}{2}(b+h)$']).length > 0, true);
check('formula: triangle area ½bh is NOT flagged', formulaCautions('Area of a triangle', ['$A=\\frac{1}{2}bh$']).length, 0);
check('formula: circle area 2πr is flagged', formulaCautions('Area of a circle', ['$A=2\\pi r$']).length > 0, true);
check('formula: circle area πr² is NOT flagged', formulaCautions('Area of a circle', ['$A=\\pi r^2$']).length, 0);
check('formula: circumference using r² is flagged', formulaCautions('Circumference of a circle', ['$C=\\pi r^2$']).length > 0, true);
check('formula: unrelated point is NOT flagged', formulaCautions('Add fractions with unlike denominators', ['$\\frac{a}{b}+\\frac{c}{d}$']).length, 0);
check('formula: no formulas → no cautions', formulaCautions('Area of a triangle', []).length, 0);
// correct area formula alongside a perimeter note (which contains b+h) must NOT false-flag
check('formula: triangle ½bh + perimeter note NOT flagged', formulaCautions('Area of a triangle', ['$A=\\frac{1}{2}bh$', '$P=a+b+h$']).length, 0);
check('formula: triangle ½×b×h NOT flagged', formulaCautions('Area of a triangle', ['$A=\\frac{1}{2}\\times b\\times h$']).length, 0);
// extended signatures (v2.45): parallelogram / rectangle area & perimeter
check('formula: parallelogram area b+h flagged', formulaCautions('Area of a parallelogram', ['$A=b+h$']).length > 0, true);
check('formula: parallelogram area b×h NOT flagged', formulaCautions('Area of a parallelogram', ['$A=b\\times h$']).length, 0);
check('formula: rectangle area l+w flagged', formulaCautions('Area of a rectangle', ['$A=l+w$']).length > 0, true);
check('formula: rectangle area l×w NOT flagged', formulaCautions('Area of a rectangle', ['$A=l\\times w$']).length, 0);
check('formula: rectangle perimeter l×w flagged', formulaCautions('Perimeter of a rectangle', ['$P=l\\times w$']).length > 0, true);
check('formula: rectangle perimeter 2(l+w) NOT flagged', formulaCautions('Perimeter of a rectangle', ['$P=2(l+w)$']).length, 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
