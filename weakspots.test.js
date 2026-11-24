/* Test the weak-spot drill's priority-weighting helpers extracted from index.html:
 * apportion / weightedFocusTopics / focusTopicsFor. A teacher's ordered focus themes
 * must produce a per-topic question allocation that honours the priority ORDER (earlier
 * theme => more questions) even when themes have a different number of strands — and the
 * focus must stay gated to the matching exam+subject. */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// Brace-matching extractor (same as accuracy.test.js), regex/string/comment aware.
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
const EXAMS = src.match(/const EXAMS=\{[\s\S]*?\n\};/)[0];
const STUDENT_FOCUS = src.match(/const STUDENT_FOCUS=\{[\s\S]*?\n\};/)[0];

const ctx = {};
new Function(
  EXAMS + '\n' + STUDENT_FOCUS + '\n' +
  extract('examTopics') + '\n' + extract('focusTopicsFor') + '\n' +
  extract('apportion') + '\n' + extract('weightedFocusTopics') + '\n' +
  'this.examTopics=examTopics;this.focusTopicsFor=focusTopicsFor;this.apportion=apportion;this.weightedFocusTopics=weightedFocusTopics;'
).call(ctx);
const { focusTopicsFor, apportion, weightedFocusTopics } = ctx;

let pass = 0, fail = 0;
const check = (desc, got, expected) => { if (got === expected) pass++; else { fail++; console.log(`  ✗ ${desc}\n      expected ${expected}, got ${got}`); } };
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);

// ── apportion: largest-remainder, sums to count, drops zero-weight ───────────
check('equal weights split evenly', JSON.stringify(apportion(['a', 'b'], { a: 1, b: 1 }, 10)), JSON.stringify({ a: 5, b: 5 }));
check('2:1:1 over 8 => 4/2/2', JSON.stringify(apportion(['a', 'b', 'c'], { a: 2, b: 1, c: 1 }, 8)), JSON.stringify({ a: 4, b: 2, c: 2 }));
check('3:1 over 8 (clean) => 6/2', JSON.stringify(apportion(['a', 'b'], { a: 3, b: 1 }, 8)), JSON.stringify({ a: 6, b: 2 }));
check('zero-weight topic omitted', JSON.stringify(apportion(['a', 'b', 'c'], { a: 1, b: 0, c: 1 }, 4)), JSON.stringify({ a: 2, c: 2 }));
check('always sums to count (odd split)', sum(apportion(['a', 'b', 'c'], { a: 2, b: 1, c: 1 }, 10)), 10);
check('empty topics => {}', JSON.stringify(apportion([], {}, 10)), '{}');
check('count 0 => {}', JSON.stringify(apportion(['a'], { a: 1 }, 0)), '{}');
check('earlier (higher) weight gets more', (() => { const q = apportion(['a', 'b'], { a: 3, b: 1 }, 8); return q.a > q.b; })(), true);

// ── weightedFocusTopics: theme priority honoured, strands split within a theme ──
const areas = [
  { label: 't1', topics: ['P', 'L'] }, // priority 1 (2 strands)
  { label: 't2', topics: ['G'] },      // priority 2 (1 strand)
  { label: 't3', topics: ['S', 'Pr'] },// priority 3 (2 strands)
];
const w = weightedFocusTopics(areas);
check('topics keep priority order', JSON.stringify(w.topics), JSON.stringify(['P', 'L', 'G', 'S', 'Pr']));
check('theme weight split evenly among strands (t1: 3/2=1.5 each)', w.weights.P, 1.5);
check('single-strand theme keeps full weight (t2: 2)', w.weights.G, 2);
check('theme1 total > theme2 total (5-count case? here n=3)', (w.weights.P + w.weights.L) > w.weights.G, true);
check('theme2 total > theme3 total (fixes strand-count inversion)', w.weights.G > (w.weights.S + w.weights.Pr), true);
const extras = weightedFocusTopics(areas, ['X', 'Y']);
check('extras appended after focus topics', JSON.stringify(extras.topics), JSON.stringify(['P', 'L', 'G', 'S', 'Pr', 'X', 'Y']));
check('extras carry a low weight (< lowest theme strand)', extras.weights.X < extras.weights.S, true);

// ── integration: Howard's ordered focus => strictly priority-ordered allocation ──
const hf = focusTopicsFor({ name: 'Howard' }, 'rangitoto', 'Mathematics');
check('Howard resolves 5 themes', hf.areas.length, 5);
const hw = weightedFocusTopics(hf.areas);
const alloc24 = apportion(hw.topics, hw.weights, 24); // generation batch size
const themeTotal = a => a.topics.reduce((s, t) => s + (alloc24[t] || 0), 0);
const [T1, T2, T3, T4, T5] = hf.areas.map(themeTotal);
check('alloc sums to 24', sum(alloc24), 24);
check('theme1 (Sequences/Functions/Graphs) gets the most', T1 === Math.max(T1, T2, T3, T4, T5), true);
check('priority strictly decreasing T1>=T2>=T3>=T4>=T5', T1 >= T2 && T2 >= T3 && T3 >= T4 && T4 >= T5, true);
check('theme2 (Position) NOT less than theme3 (Stats/Prob) — inversion fixed', T2 >= T3, true);

// ── focus gating still holds ─────────────────────────────────────────────────
check('icas (strand names mismatch) => no focus', focusTopicsFor({ name: 'Howard' }, 'icas', 'Mathematics').topics.length, 0);
check('English (subject gate) => no focus', focusTopicsFor({ name: 'Howard' }, 'rangitoto', 'English').topics.length, 0);
check('non-focus student => no focus', focusTopicsFor({ name: 'Unlisted' }, 'icas', 'Mathematics').areas.length, 0);
check('Howard keeps the default "Teacher’s focus" heading (no title)', hf.title, '');

// ── integration: Brendan's test-derived ICAS focus (6 themes, own title) ─────
const bf = focusTopicsFor({ name: 'Brendan' }, 'icas', 'Mathematics');
check('Brendan resolves 6 themes under ICAS', bf.areas.length, 6);
check('Brendan theme1 = Measurement', JSON.stringify(bf.areas[0].topics), JSON.stringify(['Measurement']));
check('Brendan card title (not a teacher list)', bf.title, 'Maths focus');
const bw = weightedFocusTopics(bf.areas, ['Number & place value', 'Money']); // + low-weight tail
for (const N of [10, 24]) { // drill size / generation batch size
  const al = apportion(bw.topics, bw.weights, N);
  const tt = bf.areas.map(a => a.topics.reduce((s, t) => s + (al[t] || 0), 0));
  check(`Brendan alloc sums to ${N}`, sum(al), N);
  check(`Brendan Measurement gets the most of ${N}`, tt[0] === Math.max(...tt), true);
  check(`Brendan theme totals never rise down the list (${N}: ${tt.join('/')})`, tt.every((v, i) => i === 0 || tt[i - 1] >= v), true);
}
check('Brendan: ICAS strands never leak into Rangitoto', focusTopicsFor({ name: 'Brendan' }, 'rangitoto', 'Mathematics').topics.length, 0);
check('Brendan: English (subject gate) => no focus', focusTopicsFor({ name: 'Brendan' }, 'icas', 'English').topics.length, 0);
const bg = focusTopicsFor({ name: 'Brendan' }, 'general', 'Mathematics');
const generalMaths = ctx.examTopics('general', 'Mathematics');
check('Brendan under General keeps only strands General has', bg.topics.length > 0 && bg.topics.every(t => generalMaths.includes(t)), true);
check('Brendan under General still leads with Measurement', bg.topics[0], 'Measurement');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
