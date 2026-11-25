/* Tests for the 🚀 Year 9 Head Start preview pack (v2.62): preview.js content rules (the same rules the
 * printed books and the app rely on) + the pure helpers extracted from index.html (pvDayOf, pvNextLesson,
 * pvQuizReady, pvProgress, pvMenuLine, pvItemMarks). Run: node preview.test.js */
const fs = require('fs');
const P = require('./preview.js');
const D = P.DATA;
const src = fs.readFileSync('index.html', 'utf8');

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
const ctx = {};
const ESC = src.match(/const esc=s=>[^\n]+/)[0];
new Function(ESC + '\n' + ['pvDayOf', 'pvDoneSet', 'pvNextLesson', 'pvQuizReady', 'pvProgress', 'pvMenuLine', 'pvItemMarks', 'engMd'].map(extract).join('\n') +
  '\nObject.assign(this,{pvDayOf,pvDoneSet,pvNextLesson,pvQuizReady,pvProgress,pvMenuLine,pvItemMarks,engMd});').call(ctx);
const { pvDayOf, pvNextLesson, pvQuizReady, pvProgress, pvMenuLine, pvItemMarks, engMd } = ctx;

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  ✗ ' + m)); };
const CJK = /[㐀-鿿]/;
const isStr = s => typeof s === 'string' && s.trim().length > 0;
const enOk = s => isStr(s) && !CJK.test(s) && !/<\/?[a-z][^>]*>/i.test(s) && !/\\frac|\$[^$\s][^$]*\$/.test(s);
const zhOk = s => isStr(s) && CJK.test(s);

// ── the DATA block is strict JSON (the Python book generator parses it) ─────────
{
  const txt = fs.readFileSync('preview.js', 'utf8');
  let blob = txt.split('/*BEGIN-DATA*/')[1].split('/*END-DATA*/')[0].trim().replace(/^var DATA\s*=/, '').trim().replace(/;$/, '');
  let parsed = null; try { parsed = JSON.parse(blob); } catch (e) { }
  ok(parsed && parsed.lessons && parsed.lessons.length === D.lessons.length, 'DATA between the markers is strict JSON');
}

// ── shape ───────────────────────────────────────────────────────────────────
ok(D.students.includes('howard'), 'pack is for Howard');
ok(D.subjects.map(s => s.id).join() === 'English,Science', 'two subjects: English, Science');
ok(D.lessons.length === 24, '24 lessons (12 per subject)');
ok(D.quizzes.length === 6, '6 quizzes (3 per subject)');
ok(D.schedule.length === 15 && D.schedule.filter(x => x.kind === 'Q').length === 3, '15-day schedule with 3 quiz days');
ok(D.schedule.every((x, i) => x.day === i + 1 && /^2027-01-\d\d$/.test(x.date)), 'schedule days are numbered and dated in January 2027');
ok(D.schedule.filter(x => x.kind === 'L').map(x => x.n).join() === '1,2,3,4,5,6,7,8,9,10,11,12', 'schedule covers lessons 1–12 in order');
ok(D.method.length >= 4 && D.method.every(m => enOk(m.en) && zhOk(m.zh)), '"how this pack works" is bilingual');
['English', 'Science'].forEach(s => ok(D.weeks[s].length === 3 && D.weeksZh[s].length === 3, s + ': 3 week titles (EN + 中文)'));

const letters = { English: [0, 0, 0, 0], Science: [0, 0, 0, 0] };
function checkItem(tag, it, owner, quiz, lessonIds) {
  ok([1, 2, 3].includes(it.lv), tag + ' lv 1–3');
  ok(enOk(it.q), tag + ' question is English');
  if (it.fig) ok(owner.figs && owner.figs[it.fig], tag + ' figure exists');
  if (it.type === 'mc') {
    ok(Array.isArray(it.opts) && it.opts.length === 4 && it.opts.every(enOk), tag + ' 4 English options');
    ok(new Set(it.opts.map(o => o.trim().toLowerCase())).size === 4, tag + ' options are distinct');
    ok([0, 1, 2, 3].includes(it.a), tag + ' answer index 0–3');
    ok(enOk(it.why) && zhOk(it.whyZh), tag + ' explanation EN + 中文');
    letters[owner.subject][it.a]++;
  } else if (it.type === 'match') {
    ok(it.pairs.length >= 4 && it.pairs.length <= 6, tag + ' 4–6 pairs');
    ok(it.pairs.every(p => p.length === 2 && enOk(p[0]) && enOk(p[1])), tag + ' pairs are English');
    ok(it.zh && it.zh.length === it.pairs.length && it.zh.every(p => zhOk(p[1])), tag + ' 中文 mirrors the pairs');
    ok(new Set(it.pairs.map(p => p[1].toLowerCase())).size === it.pairs.length, tag + ' meanings are distinct');
  } else if (it.type === 'short' || it.type === 'write') {
    ok(it.type === 'short' ? it.lines >= 1 && it.lines <= 4 : it.lines >= 6 && it.lines <= 12, tag + ' writing lines in range');
    ok(enOk(it.model) && zhOk(it.modelZh), tag + ' model answer EN + 中文');
    if (it.type === 'write') ok(Array.isArray(it.check) && it.check.length >= 3 && it.check.length === (it.checkZh || []).length, tag + ' marking checklist (EN + 中文)');
  } else ok(false, tag + ' unknown item type ' + it.type);
  if (quiz) {
    ok(it.marks >= 1 && it.marks <= 4, tag + ' marks 1–4');
    ok(lessonIds.includes(it.review), tag + ' "review" points to a lesson of the same subject');
  }
}
function checkFigs(tag, owner) {
  Object.keys(owner.figs || {}).forEach(k => {
    const s = owner.figs[k].svg || '';
    ok(k.startsWith(owner.id + '-'), tag + ' fig id ' + k + ' is prefixed with the lesson id');
    ok(/^<svg[\s>]/.test(s.trim()) && /<\/svg>\s*$/.test(s) && /viewBox=/.test(s), tag + ' fig ' + k + ' is one complete svg with a viewBox');
    ok(!/<script|<foreignObject|<style|<image|\son[a-z]+=|href=/i.test(s), tag + ' fig ' + k + ' is safe');
    (s.match(/\sid="([^"]+)"/g) || []).forEach(m => ok(m.split('"')[1].startsWith(k), tag + ' fig ' + k + ' inner ids are prefixed'));
  });
}
const ids = new Set();
D.lessons.forEach(L => {
  const tag = L.id;
  ok(!ids.has(L.id), tag + ' id unique'); ids.add(L.id);
  ok(L.id === (L.subject === 'English' ? 'e' : 's') + String(L.num).padStart(2, '0'), tag + ' id matches subject + num');
  ok(L.week === Math.floor((L.num - 1) / 4) + 1, tag + ' week matches num');
  ok(enOk(L.title) && L.title.length <= 42 && zhOk(L.titleZh), tag + ' title EN (≤ 42) + 中文');
  ok(enOk(L.intention) && zhOk(L.intentionZh), tag + ' learning intention EN + 中文');
  ok(L.criteria.length >= 2 && L.criteria.length <= 4 && L.criteria.length === L.criteriaZh.length, tag + ' 2–4 success criteria, mirrored');
  ok(enOk(L.hook.q) && zhOk(L.hook.zh), tag + ' hook EN + 中文');
  ok(L.recall.length >= 2 && L.recall.length <= 3 && L.recall.every(r => enOk(r.q) && enOk(r.a) && zhOk(r.zh)), tag + ' 2–3 recall questions');
  ok(L.words.length >= 4 && L.words.length <= 8 && L.words.every(w => enOk(w.term) && enOk(w.def) && zhOk(w.zh)), tag + ' 4–8 key words (EN + 中文)');
  ok(L.learn.length >= 2 && L.learn.length <= 4, tag + ' 2–4 learn sections');
  L.learn.forEach((s, i) => {
    ok(enOk(s.h) && zhOk(s.hZh) && s.p.length === (s.pZh || []).length && s.p.every(enOk) && s.pZh.every(zhOk), tag + ' learn[' + i + '] paragraphs EN + 中文, mirrored');
    if (s.list) ok(s.list.length === (s.listZh || []).length, tag + ' learn[' + i + '] list mirrored');
    if (s.table) ok(s.table.rows.every(r => r.length === s.table.head.length) && (s.table.rowsZh || []).length === s.table.rows.length, tag + ' learn[' + i + '] table well-formed + mirrored');
    if (s.fig) ok(L.figs && L.figs[s.fig], tag + ' learn[' + i + '] figure exists');
  });
  ok(enOk(L.example.task) && L.example.steps.length >= 2 && L.example.steps.length === L.example.stepsZh.length && enOk(L.example.answer) && zhOk(L.example.answerZh), tag + ' worked example EN + 中文');
  ok(L.byHeart.length >= 2 && L.byHeart.length === L.byHeartZh.length, tag + ' learn-by-heart list mirrored');
  ok(L.practice.length >= 5 && L.practice.length <= 7, tag + ' 5–7 practice items');
  ok(L.practice.filter(x => x.type === 'mc').length >= 2 && L.practice.some(x => x.type === 'short') && L.practice.filter(x => x.lv === 3).length === 1, tag + ' practice mix: ≥2 mc, ≥1 short, exactly one ★★★');
  L.practice.forEach((it, i) => { ok(it.id === String(i + 1), tag + ' practice ids 1..n'); checkItem(tag + ' #' + it.id, it, L, false); });
  ok(enOk(L.deeper.q) && enOk(L.deeper.hint) && enOk(L.deeper.model) && zhOk(L.deeper.modelZh), tag + ' think-deeper with hint + model');
  if (L.home) ok(L.home.steps.length >= 2 && L.home.steps.length === L.home.stepsZh.length, tag + ' try-at-home steps mirrored');
  ok(zhOk(L.parent.summaryZh) && L.parent.teachZh.length >= 2 && L.parent.misconceptions.length >= 2 && L.parent.ask.length >= 2, tag + ' parent notes complete');
  checkFigs(tag, L);
});
D.quizzes.forEach(Q => {
  const tag = Q.id, lessonIds = D.lessons.filter(l => l.subject === Q.subject).map(l => l.id);
  ok(Q.id === (Q.subject === 'English' ? 'eq' : 'sq') + Q.week, tag + ' id matches subject + week');
  ok(Q.questions.length >= 10 && Q.questions.length <= 14, tag + ' 10–14 questions');
  Q.questions.forEach((it, i) => { ok(it.id === String(i + 1), tag + ' ids 1..n'); checkItem(tag + ' #' + it.id, it, Q, true, lessonIds); });
  const total = Q.questions.reduce((a, x) => a + x.marks, 0);
  ok(total >= 18 && total <= 34, tag + ' total marks ' + total + ' in range');
  ok(Q.summary && Q.summary.branches.length >= 4 && Q.summary.branches.every(b => enOk(b.h) && zhOk(b.hZh) && b.items.length >= 2), tag + ' week mind map (4+ branches)');
  ok(zhOk(Q.scoringZh), tag + ' Chinese marking notes');
  checkFigs(tag, Q);
});
['English', 'Science'].forEach(s => {
  const n = letters[s].reduce((a, b) => a + b, 0), pct = letters[s].map(x => Math.round(100 * x / Math.max(1, n)));
  ok(n >= 40 && pct.every(p => p >= 15 && p <= 35), s + ': MC answer letters balanced (' + letters[s].join('/') + ')');
});

// ── helpers ─────────────────────────────────────────────────────────────────
ok(pvDayOf('L', 1) === 1 && pvDayOf('L', 4) === 4 && pvDayOf('L', 5) === 6 && pvDayOf('L', 9) === 11 && pvDayOf('L', 12) === 14, 'pvDayOf: lessons skip the quiz day each week');
ok(pvDayOf('Q', 1) === 5 && pvDayOf('Q', 2) === 10 && pvDayOf('Q', 3) === 15, 'pvDayOf: quizzes on days 5, 10, 15');
ok(D.schedule.every(x => x.day === pvDayOf(x.kind, x.n)), 'pvDayOf agrees with the printed schedule');
const rec = (lesson, done = true) => ({ kind: 'pv', lesson, done });
ok(pvNextLesson(D, [], 'English').id === 'e01', 'next English lesson with nothing done = e01');
ok(pvNextLesson(D, [rec('e01'), rec('e02')], 'English').id === 'e03', 'next lesson skips the done ones');
ok(pvNextLesson(D, [rec('e01', false)], 'English').id === 'e01', 'an unfinished record does not count as done');
ok(pvNextLesson(D, D.lessons.filter(l => l.subject === 'Science').map(l => rec(l.id)), 'Science') === null, 'all Science done → null');
const eq1 = D.quizzes.find(q => q.id === 'eq1');
ok(!pvQuizReady(D, [rec('e01'), rec('e02'), rec('e03')], eq1), 'quiz not ready after 3 of 4 lessons');
ok(pvQuizReady(D, [rec('e01'), rec('e02'), rec('e03'), rec('e04')], eq1), 'quiz ready after the week’s 4 lessons');
const prog = pvProgress(D, [rec('e01'), rec('s01'), rec('s02'), { kind: 'pvq', quiz: 'eq1', best: 15, total: 20 }]);
ok(prog.by.English.done === 1 && prog.by.Science.done === 2 && prog.quizzes === 1 && prog.quizAvg === 75, 'pvProgress counts lessons per subject + quiz average');
ok(pvMenuLine(D, [rec('e01')]) === 'English 1/12 · Science 0/12', 'pvMenuLine: "English 1/12 · Science 0/12"');
ok(pvItemMarks({ type: 'mc', a: 2, marks: 1 }, 2) === 1 && pvItemMarks({ type: 'mc', a: 2, marks: 1 }, 1) === 0, 'pvItemMarks: mc right / wrong');
ok(pvItemMarks({ type: 'match', marks: 2, pairs: [['a', 'x'], ['b', 'y'], ['c', 'z'], ['d', 'w']] }, ['x', 'y', 'z', 'q']) === 1.5, 'pvItemMarks: match gives part marks (3 of 4 → 1.5 of 2)');
ok(pvItemMarks({ type: 'write', marks: 4 }, 3) === 3 && pvItemMarks({ type: 'write', marks: 4 }, 9) === 4 && pvItemMarks({ type: 'short', marks: 2 }, undefined) === 0, 'pvItemMarks: self-marked, clamped, unmarked = 0');

// engMd: **bold**, *italic* titles, line breaks — but a lone * (maths, "a*b") stays literal and HTML is escaped
ok(engMd('Read *Twelfth Night* now.') === 'Read <i>Twelfth Night</i> now.', 'engMd: *title* → italic');
ok(engMd('**bold** and *it*') === '<b>bold</b> and <i>it</i>', 'engMd: bold + italic together');
ok(engMd('2 * 3 * 4') === '2 * 3 * 4' && engMd('a*b*c') === 'a*b*c', 'engMd: stray asterisks stay literal');
ok(engMd('<b>x</b>\ny') === '&lt;b&gt;x&lt;/b&gt;<br>y', 'engMd: escapes HTML, keeps line breaks');
// every italic span in the pack renders (no unmatched single asterisks left in English text)
{
  const bad = [];
  const walk = (o, p) => { if (typeof o === 'string') { if (/Zh$|^zh$|svg$/.test(p.split('.').pop())) return; const out = engMd(o); if (/(^|[^*])\*(?!\*)/.test(out.replace(/<[^>]+>/g, '')) && !/\d\s*\*\s*\d/.test(o)) bad.push(p); return; } if (Array.isArray(o)) return o.forEach((x, i) => walk(x, p + '[' + i + ']')); if (o && typeof o === 'object') for (const k in o) walk(o[k], p ? p + '.' + k : k); };
  D.lessons.forEach(L => walk(L, L.id)); D.quizzes.forEach(Q => walk(Q, Q.id));
  ok(bad.length === 0, 'no unrendered asterisks in lesson text' + (bad.length ? ': ' + bad.slice(0, 5).join(', ') : ''));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
