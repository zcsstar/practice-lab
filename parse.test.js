/* Tests for parse.js — run with: node parse.test.js */
const P = require('./parse.js');
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  ✗ ' + m)); };
const n = (raw) => P.extractQuestions(raw).length;

// 1. Clean, well-formed
ok(n('{"questions":[{"question":"a","answer":"1"},{"question":"b","answer":"2"}]}') === 2, 'clean wrapped array');
ok(n('[{"question":"a","answer":"1"}]') === 1, 'bare array (no wrapper)');
ok(n('{"question":"solo","answer":"1"}') === 1, 'single bare object');

// 2. Markdown fences + leading prose / thinking
ok(n('```json\n{"questions":[{"question":"a","answer":"1"}]}\n```') === 1, 'fenced json');
ok(n('Here are your questions:\n{"questions":[{"question":"a","answer":"1"},{"question":"b","answer":"2"}]}') === 2, 'leading prose');
ok(n('Let me think... actually the answer is tricky.\n{"questions":[{"question":"a","answer":"1"}]}') === 1, 'thinking preamble');

// 3. Raw LaTeX backslashes (invalid JSON escapes) get repaired
ok(n('{"questions":[{"question":"What is $\\frac{1}{2}$?","answer":"0.5"}]}') === 1, 'raw \\frac repaired');
ok(n('{"questions":[{"question":"Cost is $\\$5$","answer":"5"}]}') === 1, 'raw \\$ repaired');

// 4. Raw control chars inside strings
ok(n('{"questions":[{"question":"line1\nline2","answer":"1"}]}') === 1, 'raw newline in string');

// 5. TRUNCATION — the real bug from the screenshot
// (a) cut off inside the FIRST question -> nothing complete -> [] (caller must handle)
const cutFirst = '{"questions":[{"topic":"Number","type":"multiple_choice","question":"Which number is seven hundred and three?","options":["730","703","7';
ok(n(cutFirst) === 0, 'truncated inside first object -> 0 (no complete question)');
// (b) cut off AFTER several complete questions -> keep the complete ones
const cutLater = '{"questions":[' +
  '{"question":"q1","answer":"1"},' +
  '{"question":"q2","answer":"2"},' +
  '{"question":"q3","answer":"3"},' +
  '{"question":"q4 truncated here","answer":"4';
ok(n(cutLater) === 3, 'truncated after 3 complete -> keeps 3');
// (c) truncated with no closing brackets at all but full objects present
ok(n('{"questions":[{"question":"q1","answer":"1"},{"question":"q2","answer":"2"}') === 2, 'missing closing brackets -> recovers 2');

// 6. A single malformed object in the middle is skipped, others kept
const midBad = '{"questions":[' +
  '{"question":"good1","answer":"1"},' +
  '{"question":"bad" "answer":"x"},' +     // missing comma -> unparseable object
  '{"question":"good2","answer":"2"}]}';
ok(n(midBad) === 2, 'malformed middle object skipped, neighbours kept');

// 7. Trailing comma + nested braces in strings
ok(n('{"questions":[{"question":"set {a,b}","answer":"1"},]}') === 1, 'trailing comma + braces-in-string');
ok(n('{"questions":[{"question":"if {x} then [y]","options":["{","}"],"answer":"1"}]}') === 1, 'braces/brackets inside string values');

// 8. Escaped quotes inside strings
ok(n('{"questions":[{"question":"say \\"hi\\" now","answer":"1"}]}') === 1, 'escaped quotes in string');

// 9. Garbage / empties -> [] (never throws)
ok(n('') === 0, 'empty string');
ok(n('not json at all') === 0, 'non-json text');
ok(n(null) === 0, 'null input');
ok(n('{"foo":"bar"}') === 0, 'json with no question-like objects');

// 10. Mixed shape: correctIndex / choices / stem aliases still count as questions
ok(n('{"items":[{"stem":"q","choices":["a","b"],"correctIndex":0}]}') === 1, 'alias fields (items/stem/choices)');

// 11. Large batch stays intact
const big = '{"questions":[' + Array.from({length:40},(_,i)=>`{"question":"q${i}","answer":"${i}"}`).join(',') + ']}';
ok(n(big) === 40, '40-question batch fully parsed');

// 12. Field accessors
ok(P.qText({stem:'hello'}) === 'hello', 'qText reads stem');
ok(P.qOpts({choices:['a','b']}).length === 2, 'qOpts reads choices');
ok(P.looksQ({question:'x'}) === true && P.looksQ({foo:1}) === false, 'looksQ discriminates');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
