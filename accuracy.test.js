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
  extract('figureContradictsKey') + '\n' + extract('figureAnswerBroken') + '\n' +
  extract('orderingPuzzleSolve') + '\n' + extract('orderingPuzzleBroken') + '\n' +
  extract('questionBroken') + '\n' +
  extract('validateTree') + '\n' + extract('formulaCautions') + '\n' +
  'this.explanationSelfCorrects=explanationSelfCorrects;this.mcConcludesOffList=mcConcludesOffList;this.figureContradictsKey=figureContradictsKey;this.figureAnswerBroken=figureAnswerBroken;this.orderingPuzzleSolve=orderingPuzzleSolve;this.orderingPuzzleBroken=orderingPuzzleBroken;this.questionBroken=questionBroken;this.validateTree=validateTree;this.formulaCautions=formulaCautions;'
).call(ctx, PLDiagram);
const { explanationSelfCorrects, mcConcludesOffList, figureContradictsKey, figureAnswerBroken, orderingPuzzleSolve, orderingPuzzleBroken, questionBroken, validateTree, formulaCautions } = ctx;

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

// ── figureAnswerBroken: aggregate figure question whose answer isn't an option ──
// Reported pictograph bug: both months drawn with one icon (=5), so "how many more in April than
// March" is 0 — not among 5/10/15/20 → broken. Difference/total wording is what figureContradictsKey
// skips, so this sibling covers it, DROP-only when the computed value is off every option.
const pic = (rows, per, q, opts, ai) => ({ type: 'multiple_choice', options: opts, answerIndex: ai, question: q, diagram: { type: 'pictogram', icon: '🏈', per, rows } });
check('reported: April(5)−March(5)=0, options 5/10/15/20 → broken',
  figureAnswerBroken(pic([{ label: 'Jan', value: 5 }, { label: 'Feb', value: 0 }, { label: 'Mar', value: 5 }, { label: 'Apr', value: 5 }], 5, 'How many more balls were sold in April than in March?', ['5', '10', '15', '20'], 2)), true);
check('sound difference: April(20)−March(5)=15 IS an option → not broken',
  figureAnswerBroken(pic([{ label: 'Mar', value: 5 }, { label: 'Apr', value: 20 }], 5, 'How many more balls were sold in April than in March?', ['5', '10', '15', '20'], 2)), false);
check('sound total: 5+5+10=20 IS an option → not broken',
  figureAnswerBroken(pic([{ label: 'Mon', value: 5 }, { label: 'Tue', value: 5 }, { label: 'Wed', value: 10 }], 5, 'How many balls were sold altogether?', ['15', '20', '25', '30'], 1)), false);
check('broken total: rows sum to 20 but options 15/25/30/35 → broken',
  figureAnswerBroken(pic([{ label: 'Mon', value: 5 }, { label: 'Tue', value: 5 }, { label: 'Wed', value: 10 }], 5, 'How many balls were sold altogether?', ['15', '25', '30', '35'], 0)), true);
check('single-row read (no aggregate word) → figureAnswerBroken abstains',
  figureAnswerBroken(pic([{ label: 'Mar', value: 5 }, { label: 'Apr', value: 5 }], 5, 'How many balls were sold in April?', ['5', '10', '15', '20'], 0)), false);
check('difference with only one named row matched → abstains',
  figureAnswerBroken(pic([{ label: 'Mar', value: 5 }, { label: 'Apr', value: 5 }], 5, 'How many more were sold in April than the month before?', ['1', '2', '3', '4'], 0)), false);
check('figureAnswerBroken null-safe', figureAnswerBroken(null), false);
check('questionBroken folds figureAnswerBroken (reported pictograph)',
  questionBroken(pic([{ label: 'Mar', value: 5 }, { label: 'Apr', value: 5 }], 5, 'How many more balls were sold in April than in March?', ['5', '10', '15', '20'], 2)), true);

// ── orderingPuzzleSolve / orderingPuzzleBroken: line-ordering logic puzzles ──
// Reported Q10: "second in line" has multiple valid orderings → ambiguous → drop.
const Q10 = { type: 'multiple_choice', question: 'Four friends are standing in a line. Liam is not first. Mia is behind Noah. Oscar is in front of Liam. Noah is not last. Who is second in line?', options: ['Liam', 'Mia', 'Noah', 'Oscar'], answerIndex: 3 };
check('reported Q10 ambiguous line puzzle → broken', orderingPuzzleBroken(Q10), true);
check('Q10 solve status is ambiguous', orderingPuzzleSolve(Q10).status, 'ambiguous');
// A SOUND unique-answer puzzle must NOT be dropped, and the winner is read correctly.
const sound = { type: 'multiple_choice', question: 'Three friends stand in a line. Ann is first. Bob is behind Ann. Cara is behind Bob. Who is last?', options: ['Ann', 'Bob', 'Cara', 'Nobody'], answerIndex: 0 };
check('sound unique puzzle → not broken', orderingPuzzleBroken(sound), false);
check('sound puzzle solve = unique', orderingPuzzleSolve(sound).status, 'unique');
check('sound puzzle winner index = Cara (2)', orderingPuzzleSolve(sound).index, 2);
// A contradictory puzzle (no valid ordering) is unanswerable → broken.
const contra = { type: 'multiple_choice', question: 'Three friends stand in a line. Ann is first. Bob is in front of Ann. Cara is behind Bob. Who is last?', options: ['Ann', 'Bob', 'Cara', 'Nobody'], answerIndex: 0 };
check('contradictory puzzle → broken', orderingPuzzleBroken(contra), true);
// Non-puzzle / unparseable → abstain (never drop a question we can't fully read).
check('non-puzzle "which number is first" → abstains', orderingPuzzleSolve({ type: 'multiple_choice', options: ['1', '2', '3', '4'], answerIndex: 0, question: 'What is the first even number greater than 5?' }).status, 'none');
check('too few names → abstains', orderingPuzzleSolve({ type: 'multiple_choice', options: ['a', 'b'], answerIndex: 0, question: 'Ann is in a line. Ann is first. Who is first in line?' }).status, 'none');

// ── Review-hardening: false-drop guards for the ordering solver + figure guard ──
const bars = (rows, q, opts, ai) => ({ type: 'multiple_choice', options: opts, answerIndex: ai, question: q, diagram: { type: 'bar', bars: rows } });
// A TOTAL question carrying a comparative narrative clause ("B read fewer than A") must NOT be
// hijacked into the difference branch and dropped (aggregate wording takes precedence).
check('total question with "fewer than" narrative → NOT broken',
  figureAnswerBroken(bars([{ label: 'Room A', value: 7 }, { label: 'Room B', value: 5 }], 'Room B read fewer books than Room A. How many books did the two rooms read altogether?', ['10', '12', '14', '16'], 1)), false);
// A "how many more ... than twice B" comparison is not a raw row difference → abstain, don't drop.
check('difference "than twice B" (not raw |A-B|) → NOT broken',
  figureAnswerBroken(bars([{ label: 'Room A', value: 10 }, { label: 'Room B', value: 4 }], 'How many more books did Room A read than twice Room B?', ['1', '2', '3', '4'], 1)), false);
// A capitalised temporal/framing/title word inside a clue must not become a phantom person that
// turns a UNIQUE puzzle into a false ambiguous drop.
check('temporal phantom ("On Tuesday") → unique, not broken',
  orderingPuzzleBroken({ type: 'multiple_choice', options: ['Amy', 'Ben', 'Cara', 'None'], answerIndex: 1, question: 'Three children line up. Amy is first. On Tuesday Ben is behind Cara. Who is last?' }), false);
check('framing phantom ("Standing quietly") → unique, not broken',
  orderingPuzzleBroken({ type: 'multiple_choice', options: ['Amy', 'Bob', 'Cara', 'None'], answerIndex: 2, question: 'Amy is first. Bob is behind Cara. Standing quietly, who is second in line?' }), false);
check('title phantom ("Mr Ken") → unique, not broken',
  orderingPuzzleBroken({ type: 'multiple_choice', options: ['Ken', 'Amy', 'Ben', 'None'], answerIndex: 2, question: 'Three people stand in a line. Mr Ken is first. Ben is behind Amy. Who is last in line?' }), false);
// Compound relational clause ("Amy is behind Ben and Cara") must keep BOTH constraints → unique.
check('compound clause "behind Ben and Cara" → unique, not broken',
  orderingPuzzleBroken({ type: 'multiple_choice', options: ['Amy', 'Ben', 'Cara', 'Dan'], answerIndex: 0, question: 'Four friends stand in a line. Dan is first. Amy is behind Ben and Cara. Ben is second. Who is fourth?' }), false);
check('compound clause solves to unique index (Amy=3)',
  orderingPuzzleSolve({ type: 'multiple_choice', options: ['Amy', 'Ben', 'Cara', 'Dan'], answerIndex: 0, question: 'Four friends stand in a line. Dan is first. Amy is behind Ben and Cara. Ben is second. Who is fourth?' }).status, 'unique');
// The DOMINANT phrasing (intro sentence lists the people) must actually be solved, not abstained.
check('named-intro roster ("Ivy, Jon and Kim wait…") → solves unique',
  orderingPuzzleSolve({ type: 'multiple_choice', options: ['Ivy', 'Jon', 'Kim', 'None'], answerIndex: 1, question: 'Ivy, Jon and Kim wait in a queue. Ivy is first. Jon is in front of Kim. Who is second?' }).status, 'unique');
// Round-2: an elimination person named ONLY in the roster (not in a clue, not an option) must be KEPT
// so the puzzle isn't mis-keyed. Fully-determined ⇒ unique, winner not an option ⇒ index null ⇒ no repoint.
const detElim = { type: 'multiple_choice', options: ['Kim', 'Leo', 'Max', 'None of these'], answerIndex: 3, question: 'Four runners line up. Kim, Leo, Max and Sam are the runners. Kim is first. Leo is second. Max is third. Who is last?' };
check('elimination roster person kept → unique', orderingPuzzleSolve(detElim).status, 'unique');
check('elimination winner not an option → index null (no repoint)', orderingPuzzleSolve(detElim).index, null);
check('elimination puzzle → not broken', orderingPuzzleBroken(detElim), false);
// Round-2: a "how many more" DIFFERENCE question that merely mentions "total"/"combined" in narrative
// must NOT be dropped when the true difference IS an option (total-word no longer force-drops it).
check('difference question with "total" narrative (diff 3 is an option) → NOT broken',
  figureAnswerBroken(bars([{ label: 'March', value: 5 }, { label: 'April', value: 2 }], 'The pictograph shows the total number of books read. How many more books did March have than April?', ['3', '1', '2', '4'], 0)), false);
// still catches genuinely broken (neither the diff nor the sum is a selectable option)
check('figure broken when neither diff nor sum is an option',
  figureAnswerBroken(bars([{ label: 'March', value: 5 }, { label: 'April', value: 2 }], 'The pictograph shows the total. How many more did March have than April?', ['9', '10', '11', '12'], 0)), true);

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
