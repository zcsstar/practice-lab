/* English (📘 Daily words + 🧩 Daily skills) — content + logic tests.
 * 1. english.js content: structure, bilingual fields, one correct answer per question, the 3 bold
 *    words per story, cloze/review data integrity, strict-JSON data block (the printed workbook's
 *    Python generator parses it).
 * 2. The pure helpers in index.html: spaced-review ladder, next day / due words / next skill,
 *    seeded shuffle, the four review-question builders, word highlighting.
 */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');
const EN = require('./english.js');
const D = EN.DATA;

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
const NAMES = ['wordKey', 'skillKey', 'newWordRec', 'applyWordReview', 'nextWordDay', 'dueWordRecs', 'nextSkill',
  'seedNum', 'seededShuffle', 'wordReviewKinds', 'buildWordReview', 'hiWord'];
const ctx = {};
new Function(
  src.match(/const WORD_SR_DAYS=\[[^\]]*\];/)[0] + '\n' + src.match(/const DAY_MS=\d+;/)[0] + '\n' +
  NAMES.map(extract).join('\n') + '\n' + NAMES.map(n => 'this.' + n + '=' + n + ';').join('') +
  'this.WORD_SR_DAYS=WORD_SR_DAYS;this.DAY_MS=DAY_MS;'
).call(ctx);

let pass = 0, fail = 0;
const check = (desc, cond, info) => { if (cond) pass++; else { fail++; console.log('  ✗ ' + desc + (info !== undefined ? '\n      ' + info : '')); } };
const nonEmpty = s => typeof s === 'string' && s.trim().length > 0;
const words = Object.keys(D.words);
const wc = s => s.replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length;

// ── 1. content ───────────────────────────────────────────────────────────────
check('20 days', D.days.length === 20, D.days.length);
check('60 words', words.length === 60, words.length);
check('16 skill cards', D.skills.length === 16, D.skills.length);
check('days numbered 1..20 in order', D.days.every((d, i) => d.day === i + 1));
const used = D.days.flatMap(d => d.words);
check('every word used in exactly one day', used.length === 60 && new Set(used).size === 60 && used.every(w => D.words[w]));
for (const missed of ['steadfast', 'ramshackle', 'relish', 'encase', 'obedient', 'complement'])
  check('ICAS-missed word included: ' + missed, !!D.words[missed]);

const mcOk = (q, where) => {
  check(where + ': 4 options', Array.isArray(q.opts) && q.opts.length === 4, JSON.stringify(q.opts));
  check(where + ': options distinct', new Set((q.opts || []).map(o => String(o).toLowerCase().trim())).size === 4, JSON.stringify(q.opts));
  check(where + ': answer index 0..3', Number.isInteger(q.a) && q.a >= 0 && q.a <= 3, q.a);
  check(where + ': options non-empty', (q.opts || []).every(nonEmpty));
};
for (const d of D.days) {
  const where = 'day ' + d.day;
  check(where + ': title/theme/type', nonEmpty(d.title) && nonEmpty(d.theme) && ['narrative', 'report', 'review', 'diary', 'letter', 'poem'].includes(d.type), d.type);
  check(where + ': 3 words', Array.isArray(d.words) && d.words.length === 3);
  const bold = [...d.passage.matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1]);
  const forms = d.words.map(w => D.words[w] && D.words[w].form);
  check(where + ': exactly the 3 word forms are bold, once each', bold.length === 3 && forms.every(f => bold.filter(b => b === f).length === 1), JSON.stringify(bold) + ' vs ' + JSON.stringify(forms));
  const n = wc(d.passage);
  check(where + ': passage 60–110 words', n >= 60 && n <= 110, n);
  check(where + ': 2 questions, first is vocab', d.qs.length === 2 && d.qs[0].skill === 'vocab', JSON.stringify(d.qs.map(q => q.skill)));
  d.qs.forEach((q, i) => { mcOk(q, where + ' Q' + (i + 1)); check(where + ' Q' + (i + 1) + ': bilingual why', nonEmpty(q.why) && nonEmpty(q.whyZh)); });
}
check('no straight double quotes inside any text (typographic quotes only)', !JSON.stringify(D).includes('\\"'));
const skills2 = new Set(D.days.map(d => d.qs[1].skill));
for (const s of ['main-idea', 'inference', 'evidence', 'character', 'purpose', 'sequence', 'cause-effect', 'summary', 'fact-opinion', 'compare'])
  check('reading skill covered at least once: ' + s, skills2.has(s));

for (const id of words) {
  const w = D.words[id], where = 'word ' + id;
  check(where + ': word key matches', w.word === id);
  for (const f of ['form', 'pos', 'syll', 'zh', 'def', 'defZh']) check(where + ': ' + f, nonEmpty(w[f]));
  check(where + ': parts/partsZh paired', (w.parts || '') === '' ? (w.partsZh || '') === '' : nonEmpty(w.partsZh));
  check(where + ': note/noteZh paired', (w.note || '') === '' ? (w.noteZh || '') === '' : nonEmpty(w.noteZh));
  mcOk(w.guess, where + ' guess');
  check(where + ': guess clue bilingual', nonEmpty(w.guess.clue) && nonEmpty(w.guess.clueZh));
  check(where + ': 2 examples', Array.isArray(w.ex) && w.ex.length >= 2 && w.ex.every(nonEmpty));
  check(where + ': every example uses the word (highlightable)', w.ex.every(s => /\*\*/.test(ctx.hiWord(s, w))), JSON.stringify(w.ex));
  check(where + ': syn ≥ 1', Array.isArray(w.syn) && w.syn.length >= 1 && w.syn.every(nonEmpty));
  check(where + ': ant is an array', Array.isArray(w.ant));
  check(where + ': exactly 3 distractors', Array.isArray(w.dis) && w.dis.length === 3 && w.dis.every(nonEmpty));
  const lists = [...w.syn, ...w.ant, ...w.dis].map(x => x.toLowerCase());
  check(where + ': syn/ant/dis don’t overlap or repeat the word', new Set(lists).size === lists.length && !lists.includes(id.toLowerCase()), JSON.stringify(lists));
  const c = w.cloze;
  check(where + ': cloze has exactly one gap', c && (c.s.match(/___/g) || []).length === 1, c && c.s);
  mcOk(c, where + ' cloze');
  check(where + ': cloze answer is the word', c && c.opts[c.a] && c.opts[c.a].toLowerCase().startsWith(id.toLowerCase().replace(/e$/, '').slice(0, 4)), c && c.opts[c.a]);
}
for (const s of D.skills) {
  const where = 'skill ' + s.id;
  check(where + ': kind', ['grammar', 'reading'].includes(s.kind));
  for (const f of ['title', 'titleZh', 'idea', 'ideaZh', 'tip', 'tipZh']) check(where + ': ' + f, nonEmpty(s[f]));
  check(where + ': 3–5 bilingual points', s.points.length >= 3 && s.points.length <= 5 && s.points.every(p => nonEmpty(p.en) && nonEmpty(p.zh)));
  check(where + ': 3 bilingual examples', s.examples.length === 3 && s.examples.every(x => nonEmpty(x.en) && nonEmpty(x.note) && nonEmpty(x.noteZh)));
  check(where + ': 3 questions', s.qs.length === 3);
  s.qs.forEach((q, i) => { mcOk(q, where + ' Q' + (i + 1)); check(where + ' Q' + (i + 1) + ': bilingual why', nonEmpty(q.why) && nonEmpty(q.whyZh)); });
}
check('8 grammar + 8 reading cards', D.skills.filter(s => s.kind === 'grammar').length === 8 && D.skills.filter(s => s.kind === 'reading').length === 8);
check('skill ids unique', new Set(D.skills.map(s => s.id)).size === D.skills.length);
// The DATA block must be strict JSON (the Python workbook generator reads it).
const raw = fs.readFileSync('english.js', 'utf8').split('/*BEGIN-DATA*/')[1].split('/*END-DATA*/')[0].trim().replace(/^var DATA\s*=/, '').trim().replace(/;$/, '');
let strict = true; try { JSON.parse(raw); } catch (e) { strict = false; }
check('DATA block is strict JSON', strict);

// ── 2. review questions built from every word × kind ─────────────────────────
for (const id of words) {
  const w = D.words[id];
  const kinds = ctx.wordReviewKinds(w);
  check(id + ': supports meaning + cloze', kinds.includes('meaning') && kinds.includes('cloze'));
  for (const k of kinds) {
    const R = ctx.buildWordReview(w, k, id + '|0|0');
    const expect = k === 'cloze' ? w.cloze.opts[w.cloze.a] : k === 'syn' ? w.syn[0] : k === 'ant' ? w.ant[0] : w.guess.opts[w.guess.a];
    check(id + ' ' + k + ': 4 distinct options', R.opts.length === 4 && new Set(R.opts.map(o => o.toLowerCase())).size === 4, JSON.stringify(R.opts));
    check(id + ' ' + k + ': key points at the right option', R.a >= 0 && R.opts[R.a] === expect, R.opts[R.a] + ' vs ' + expect);
    if (k === 'meaning') check(id + ' meaning: has a context sentence', nonEmpty(R.context));
  }
}

// ── 3. spaced-review ladder + progress helpers ───────────────────────────────
const T0 = Date.UTC(2026, 11, 15, 9), DAY = ctx.DAY_MS;
let r = ctx.newWordRec('u:b', 'steadfast', 1, true, T0);
check('new word: id', r.id === 'u:b|w|steadfast');
check('new word: due after 1 day', r.dueAt === T0 + DAY && r.box === 0 && !r.mastered);
const gaps = [];
let t = T0;
for (let k = 0; k < 4; k++) { t = r.dueAt; r = ctx.applyWordReview(r, true, t); gaps.push(r.mastered ? 'M' : (r.dueAt - t) / DAY); }
check('4 right reviews: 3, 7, 14 days then mastered', JSON.stringify(gaps) === JSON.stringify([3, 7, 14, 'M']), JSON.stringify(gaps));
check('mastered word has no due date', r.mastered && r.dueAt === null);
let w2 = ctx.applyWordReview(ctx.applyWordReview(ctx.newWordRec('u:b', 'x', 1, false, T0), true, T0 + DAY), false, T0 + 4 * DAY);
check('a wrong answer resets to day 1', w2.box === 0 && w2.dueAt === T0 + 5 * DAY && w2.wrong === 1 && w2.right === 1);
check('review keeps the record’s other fields', w2.word === 'x' && w2.profileId === 'u:b');

const recsOf = list => list.map(([wd, due, m]) => ({ kind: 'word', word: wd, dueAt: due, mastered: !!m }));
check('nextWordDay: nothing learned → day 1', ctx.nextWordDay(D, []) === 1);
check('nextWordDay: day 1 complete → day 2', ctx.nextWordDay(D, recsOf(D.days[0].words.map(x => [x, 0]))) === 2);
check('nextWordDay: a partly-done day comes first', ctx.nextWordDay(D, recsOf([[D.days[0].words[0], 0]])) === 1);
check('nextWordDay: all done → null', ctx.nextWordDay(D, recsOf(used.map(x => [x, 0]))) === null);
const due = ctx.dueWordRecs(recsOf([['a', T0 + 5], ['b', T0 - 5], ['c', T0 - 50], ['d', T0 - 9, true], ['e', null]]), T0);
check('dueWordRecs: only due & unmastered, oldest first', JSON.stringify(due.map(x => x.word)) === JSON.stringify(['c', 'b']), JSON.stringify(due.map(x => x.word)));
check('nextSkill: first card', ctx.nextSkill(D, []).id === D.skills[0].id);
check('nextSkill: skips finished cards', ctx.nextSkill(D, [{ kind: 'skill', skill: D.skills[0].id, done: true }]).id === D.skills[1].id);
check('nextSkill: all done → null', ctx.nextSkill(D, D.skills.map(s => ({ kind: 'skill', skill: s.id, done: true }))) === null);

const base = ['a', 'b', 'c', 'd'];
const s1 = ctx.seededShuffle(base, 'seed-1'), s2 = ctx.seededShuffle(base, 'seed-1');
check('seededShuffle is deterministic', JSON.stringify(s1) === JSON.stringify(s2));
check('seededShuffle is a permutation', JSON.stringify(s1.slice().sort()) === JSON.stringify(base));
check('seededShuffle leaves the input alone', JSON.stringify(base) === JSON.stringify(['a', 'b', 'c', 'd']));
const orders = new Set(words.map(id => ctx.seededShuffle(base, id).join('')));
check('seededShuffle varies across seeds', orders.size >= 6, orders.size);
check('hiWord bolds other endings', ctx.hiWord('She relished every bite.', { word: 'relish' }) === 'She **relished** every bite.');
check('hiWord keeps -e words (crumble → crumbling)', ctx.hiWord('The walls were crumbling.', { word: 'crumble' }).includes('**crumbling**'));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
