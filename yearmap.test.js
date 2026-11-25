/* Tests for the 🧭 Year map (v2.62), extracted from index.html: YEAR_MAPS data integrity and the
 * live-status logic (ymMatches / ymNodeStats / ymStatus / ymResolve / ymCounts). A topic keeps the
 * parent's estimate until YM_MIN marked questions match it; then recent accuracy re-rates it.
 * Run: node yearmap.test.js */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// Brace-matching extractor (same as weakspots.test.js), regex/string/comment aware.
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
const YEAR_MAPS = src.match(/const YEAR_MAPS=\{[\s\S]*?\n\};/)[0];
const YM_CONST = src.match(/const YM_MIN=\d+,YM_RECENT=\d+;/)[0];
const ctx = {};
new Function(EXAMS + '\n' + YEAR_MAPS + '\n' + YM_CONST + '\n' +
  ['examTopics', 'yearMapsFor', 'ymMatches', 'ymNodeStats', 'ymStatus', 'ymResolve', 'ymCounts', 'ymMenuLine'].map(extract).join('\n') +
  '\nObject.assign(this,{EXAMS,YEAR_MAPS,YM_MIN,YM_RECENT,examTopics,yearMapsFor,ymMatches,ymNodeStats,ymStatus,ymResolve,ymCounts,ymMenuLine});').call(ctx);
const { EXAMS: EX, YEAR_MAPS: YM, YM_MIN: MIN, YM_RECENT: RECENT, examTopics, yearMapsFor, ymMatches, ymNodeStats, ymStatus, ymResolve, ymCounts, ymMenuLine } = ctx;

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  ✗ ' + m)); };

// ── data integrity ───────────────────────────────────────────────────────────
const STATUSES = ['secure', 'ok', 'work', 'next'];
Object.keys(YM).forEach(key => {
  yearMapsFor({ name: key }).forEach(map => {
    const tag = key + '/' + map.subject;
    ok(EX[map.exam], tag + ': exam "' + map.exam + '" exists');
    ok(Array.isArray(map.years) && map.years.length === 2, tag + ': two year labels');
    const valid = new Set(examTopics(map.exam, map.subject));
    const allStrands = new Set([].concat(...Object.keys(EX).map(e => examTopics(e, map.subject))));
    const ids = new Set();
    map.lanes.forEach(l => {
      ok(l.en && l.zh && /[㐀-鿿]/.test(l.zh), tag + ': lane ' + l.id + ' has EN + 中文 names');
      (l.alt || []).forEach(t => ok(allStrands.has(t), tag + ': lane ' + l.id + ' alt strand "' + t + '" exists in some exam'));
      ok(l.nodes.some(n => !n.year) , tag + ': lane ' + l.id + ' has a this-year topic');
      l.nodes.forEach(n => {
        ok(!ids.has(n.id), tag + ': node id ' + n.id + ' is unique'); ids.add(n.id);
        ok(n.en && n.en.length <= 40 && n.zh && n.zh.length <= 12, tag + ': ' + n.id + ' labels fit (EN ≤ 40, 中文 ≤ 12)');
        ok(STATUSES.includes(n.status), tag + ': ' + n.id + ' status "' + n.status + '" is valid');
        ok(n.year === 0 || n.year === 1, tag + ': ' + n.id + ' year is 0/1');
        ok(n.year === 0 ? n.status !== 'next' : ['next', 'ok', 'secure'].includes(n.status), tag + ': ' + n.id + ' status fits its year');
        ok(Array.isArray(n.topics) && n.topics.length && n.topics.every(t => valid.has(t)), tag + ': ' + n.id + ' topics are all ' + map.exam + ' strands');
        if (n.kw) { let good = true; try { new RegExp(n.kw, 'i'); } catch (e) { good = false; } ok(good, tag + ': ' + n.id + ' kw is a valid regex'); }
      });
      [0, 1].forEach(y => ok(l.nodes.filter(n => n.year === y).length <= (y ? 2 : 3) * 2, tag + ': lane ' + l.id + ' fits the layout'));
    });
    map.links.forEach(([a, b]) => ok(ids.has(a) && ids.has(b) && a !== b, tag + ': link ' + a + ' → ' + b + ' joins two topics'));
    // no scores / private evidence in the committed map
    ok(!/\d+\s*\/\s*\d+\s*\(|stanine|ICAS\s+\d|percentile/i.test(JSON.stringify(map)), tag + ': no test scores in the committed map');
  });
});
ok(yearMapsFor({ name: ' Howard ' }).length === 1, 'yearMapsFor trims + lowercases the login name');
ok(yearMapsFor({ name: 'Nobody' }).length === 0 && yearMapsFor(null).length === 0, 'yearMapsFor: no map → []');

// ── ymMatches: strand (or lane alt) + optional keyword ────────────────────────
const lane = { alt: ['Algebra'] };
const node = { id: 'x', topics: ['Linear relationships & graphs'], kw: 'gradient|intercept' };
ok(ymMatches(node, lane, { topic: 'Linear relationships & graphs', question: 'Find the gradient of the line.' }), 'matches strand + keyword');
ok(!ymMatches(node, lane, { topic: 'Linear relationships & graphs', question: 'Solve 2x = 6.' }), 'strand but no keyword → no');
ok(ymMatches(node, lane, { topic: 'algebra', question: 'What is the y-intercept?' }), 'lane alt strand (any case) counts');
ok(!ymMatches(node, lane, { topic: 'Probability', question: 'gradient' }), 'other strand → no');
ok(ymMatches({ topics: ['Fractions & decimals'] }, {}, { topic: 'Fractions & decimals', question: 'anything' }), 'no kw → strand alone decides');
ok(!ymMatches(node, lane, null), 'null result → no');

// ── ymStatus: estimate until YM_MIN, then re-rated ───────────────────────────
ok(MIN === 6 && RECENT === 30, 'thresholds: re-rate after 6, judge on the latest 30');
ok(ymStatus({ status: 'work' }, { n: 5, pct: 100 }).status === 'work', 'below YM_MIN the estimate stands');
ok(ymStatus({ status: 'work' }, { n: 5, pct: 100 }).live === false, '… and is not marked live');
ok(ymStatus({ status: 'work', year: 0 }, { n: 6, pct: 90 }).status === 'secure', '≥85% → secure');
ok(ymStatus({ status: 'secure', year: 0 }, { n: 10, pct: 70 }).status === 'ok', '60–84% → mostly there');
ok(ymStatus({ status: 'secure', year: 0 }, { n: 10, pct: 40 }).status === 'work', '<60% → needs work (even if estimated secure)');
ok(ymStatus({ status: 'next', year: 1 }, { n: 8, pct: 50 }).status === 'next', 'next-year topic below 60% stays "next year"');
ok(ymStatus({ status: 'next', year: 1 }, { n: 8, pct: 75 }).status === 'ok', 'next-year topic at 75% → mostly there');
ok(ymStatus({ status: 'next', year: 1 }, { n: 8, pct: 90 }).status === 'secure', 'next-year topic at 90% → secure');
ok(ymStatus({ status: 'ok' }, null).status === 'ok', 'no stats → estimate');

// ── ymNodeStats: subject filter, marked results only, newest YM_RECENT ───────
const map = { subject: 'Mathematics', lanes: [{ id: 'l', nodes: [{ id: 'g', topics: ['Linear relationships & graphs'], kw: 'gradient' }] }] };
const R = (st, q) => ({ topic: 'Linear relationships & graphs', question: q || 'gradient of a line', status: st });
const attempts = [
  { subject: 'Mathematics', startedAt: 1, results: Array.from({ length: 30 }, () => R('wrong')) },      // old: all wrong
  { subject: 'Mathematics', startedAt: 2, results: Array.from({ length: 30 }, () => R('correct')) },    // newest: all right
  { subject: 'English', startedAt: 3, results: [R('wrong'), R('wrong')] },                             // other subject
  { subject: 'Mathematics', startedAt: 0, results: [R('review'), R('correct', 'solve x')] }            // self-check / no kw
];
const st = ymNodeStats(map, attempts).g;
ok(st.n === 30 && st.c === 30 && st.pct === 100, 'only the newest 30 matching marked results count (old wrongs ignored)');
const st2 = ymNodeStats(map, [{ subject: 'Mathematics', startedAt: 1, results: [R('correct'), R('wrong'), R('review'), R('correct', 'solve for x')] }]).g;
ok(st2.n === 2 && st2.c === 1 && st2.pct === 50, 'self-check results and non-matching questions are skipped');
ok(ymNodeStats(map, []).g.pct === null, 'no practice → pct null');

// ── ymResolve / ymCounts / ymMenuLine on the real Howard map ─────────────────
const howard = yearMapsFor({ name: 'howard' })[0];
const res0 = ymResolve(howard, []);
const c0 = ymCounts(res0), total = howard.lanes.reduce((a, l) => a + l.nodes.length, 0);
ok(c0.secure + c0.ok + c0.work + c0.next === total, 'counts cover every topic');
ok(res0.lanes.every(l => l.nodes.every(n => n.live === false)), 'with no practice every status is the estimate');
const grad = { subject: 'Mathematics', startedAt: 5, results: Array.from({ length: 8 }, () => ({ topic: 'Linear relationships & graphs', question: 'What is the gradient of y = 3x + 2?', status: 'correct' })) };
const res1 = ymResolve(howard, [grad]);
const aLin = res1.lanes.find(l => l.id === 'alg').nodes.find(n => n.id === 'a_lin');
ok(aLin.status === 'secure' && aLin.live, 'practising gradients well lifts "y = mx + c" from next year to secure');
ok(howard.lanes.find(l => l.id === 'alg').nodes.find(n => n.id === 'a_lin').status === 'next', 'resolving does not mutate YEAR_MAPS');
ok(/^Year 8 → Year 9: ✓ \d+ secure/.test(ymMenuLine(howard, [])), 'menu line reads "Year 8 → Year 9: ✓ N secure …"');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
