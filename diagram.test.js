/* Tests for diagram.js — run with: node diagram.test.js
 * Each renderer must produce a valid, SAFE <svg> for a representative spec, and
 * unknown/garbage specs must return '' so the caller falls back to raw svg. */
const D = require('./diagram.js');
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  ✗ ' + m)); };
const svgOk = (s) => typeof s === 'string' && /^<svg[\s>]/.test(s.trim()) && /<\/svg>$/.test(s.trim());
const safe = (s) => !/<script|<foreignObject|xlink:href|href=|onload|onclick/i.test(s);

const specs = {
  pie: { type: 'pie', parts: [{ label: 'Red', value: 3 }, { label: 'Blue', value: 1 }] },
  bar: { type: 'bar', title: 'Pets', bars: [{ label: 'Cat', value: 4 }, { label: 'Dog', value: 7 }, { label: 'Fish', value: 2 }] },
  numberline: { type: 'numberline', min: 0, max: 10, step: 1, points: [{ value: 7, label: 'A' }] },
  fractionbar: { type: 'fractionbar', parts: 4, shaded: 3, label: '3/4' },
  shape_rect: { type: 'shape', kind: 'rectangle', labels: { width: '8 cm', height: '5 cm' } },
  shape_tri: { type: 'shape', kind: 'right-triangle', labels: { base: '6', height: '8', hyp: '10' } },
  shape_circle: { type: 'shape', kind: 'circle', labels: { radius: 'r = 5' } },
  shape_poly: { type: 'shape', kind: 'polygon', sides: 6, label: 'hexagon' },
  clock: { type: 'clock', h: 3, m: 15 },
  pictogram: { type: 'pictogram', icon: '⚽', per: 2, rows: [{ label: 'Y5', value: 6 }, { label: 'Y6', value: 4 }] },
  array: { type: 'array', rows: 3, cols: 4, shaded: 5 },
  coordinate: { type: 'coordinate', min: 0, max: 10, points: [{ x: 2, y: 3, label: 'P' }, { x: 6, y: 8 }], path: true },
  angle: { type: 'angle', degrees: 120 },
  lineplot: { type: 'lineplot', min: 0, max: 6, data: [2, 2, 3, 3, 3, 5] },
  venn: { type: 'venn', onlyA: 5, both: 3, onlyB: 4, labelA: 'Maths', labelB: 'Art' },
  tally: { type: 'tally', rows: [{ label: 'Red', value: 7 }, { label: 'Blue', value: 12 }] },
  routemap: { type: 'routemap', title: 'Journey', scaleLabel: '100 km', places: [{ name: 'A', x: 10, y: 20 }, { name: 'B', x: 80, y: 30 }, { name: 'C', x: 60, y: 85 }], legs: [{ from: 'A', to: 'B', dist: '300 km' }, { from: 'B', to: 'C', dist: '250 km' }] },
  table: { type: 'table', headers: ['Day', 'Sales'], rows: [['Mon', 12], ['Tue', 9], ['Wed', 15]] },
  scale: { type: 'scale', min: 0, max: 150, step: 25, unit: ' cm', markers: [{ value: 95, label: 'school' }, { value: 140, label: 'birthday' }] },
  balance: { type: 'balance', left: '2 ▲', right: '10' },
  timeline: { type: 'timeline', title: 'History of science', events: [{ label: 'writing', date: '3000 BC' }, { label: 'printing press', date: '1440' }, { label: 'steam engine', date: '1770' }, { label: 'telephone', date: '1876' }] },
  flow: { type: 'flow', title: 'Refining sugar', steps: ['sugar cane', 'raw sugar juice', 'clarified juice', 'sugar crystals'], branches: [{ after: 0, label: 'bagasse' }, { after: 1, label: 'mill mud' }, { after: 2, label: 'molasses' }] }
};

Object.keys(specs).forEach(name => {
  const out = D.render(specs[name]);
  ok(svgOk(out), name + ' renders a valid <svg>');
  ok(safe(out), name + ' output is safe (no script/external refs)');
});

// pie geometry: 2 slices → 2 wedge <path>s; a single 100% slice → a <circle>
ok((D.render(specs.pie).match(/<path/g) || []).length === 2, 'pie draws one path per slice');
ok(/<circle/.test(D.render({ type: 'pie', parts: [{ label: 'all', value: 1 }] })), 'pie with one part draws a full circle');
// bar: one <rect> per bar (+ no crash with a 0 value)
ok((D.render(specs.bar).match(/<rect/g) || []).length >= 3, 'bar draws a rect per bar');
ok(svgOk(D.render({ type: 'bar', bars: [{ label: 'a', value: 0 }, { label: 'b', value: 5 }] })), 'bar handles a zero value');
{ // friendly axis: 190 → ticks 0/50/100/150/200 (no 47.5 / 142.5), and the top value label is not clipped
  const out = D.render({ type: 'bar', bars: [{ label: 'a', value: 20 }, { label: 'b', value: 190 }] });
  ok(/>200</.test(out) && />150</.test(out) && !/47\.5|142\.5/.test(out), 'bar axis uses round tick values (0/50/…/200)');
  const top = Math.min(...[...out.matchAll(/<text x="[\d.]+" y="([\d.]+)"[^>]*font-weight="700"/g)].map(m => +m[1]));
  ok(top >= 12, 'bar value label above the tallest bar stays inside the svg (y = ' + top + ')');
  ok(/>40</.test(D.render({ type: 'bar', bars: [{ label: 'x', value: 40 }, { label: 'y', value: 3 }] })), 'bar axis keeps an already-round top (40)');
  ok(/>8</.test(D.render({ type: 'bar', bars: [{ label: 'x', value: 7 }] })), 'bar axis rounds 7 up to 8 (steps of 2)');
}
// fractionbar: 4 parts → 4 cells; title adds a title text
ok((D.render(specs.fractionbar).match(/<rect/g) || []).length === 4, 'fractionbar draws one cell per part');
ok(/font-weight="700"/.test(D.render({ type: 'pie', parts: [{ value: 1 }], title: 'Hi' })), 'title row is rendered');
// array: rows*cols cells
ok((D.render(specs.array).match(/<rect/g) || []).length === 12, 'array draws rows×cols cells');
// clock has two hands (hour + minute lines) + face circle
ok((D.render(specs.clock).match(/<circle/g) || []).length >= 1 && (D.render(specs.clock).match(/<line/g) || []).length >= 2, 'clock has a face + hands');
// new schematic types: routemap draws legs (lines) + place dots; table draws cells
ok((D.render(specs.routemap).match(/<line/g) || []).length >= 2, 'routemap draws a line per leg');
ok((D.render(specs.routemap).match(/<circle/g) || []).length === 3, 'routemap draws a dot per place');
ok((D.render(specs.table).match(/<rect/g) || []).length === 8, 'table draws header+body cells (2×4)');
ok((D.render(specs.scale).match(/<circle/g) || []).length === 2, 'scale draws a marker per reading');
ok(svgOk(D.render({ type: 'map', places: [{ name: 'X', x: 5, y: 5 }], legs: [] })), 'alias "map" → routemap');

// timeline: a dot per event + the time-axis arrow; flow: a box per step + branch labels
ok((D.render(specs.timeline).match(/<circle/g) || []).length === 4, 'timeline draws a dot per event');
ok(D.render(specs.timeline).includes('1876'), 'timeline shows event dates');
ok((D.render(specs.flow).match(/<rect/g) || []).length === 4, 'flow draws a box per step');
ok(D.render(specs.flow).includes('molasses'), 'flow shows branch (by-product) labels');
ok(svgOk(D.render({ type: 'process', steps: ['a', 'b'] })), 'alias "process" → flow');
ok(svgOk(D.render({ type: 'food_chain', steps: ['grass', 'rabbit', 'fox'] })), 'alias "food_chain" → flow');
ok(D.render({ type: 'timeline', events: [] }) === '', 'timeline with no events → empty');
ok(D.render({ type: 'flow', steps: [] }) === '', 'flow with no steps → empty');

// mindmap: root node + a pill per branch + a connector path per branch; empty when none
ok((D.render({ type: 'mindmap', root: 'Y6 Maths', branches: [{ label: 'Fractions', color: '#34c759', count: 5 }, { label: 'Geometry' }, { label: 'Number' }] }).match(/<rect/g) || []).length >= 4, 'mindmap draws a pill per branch + root');
ok((D.render({ type: 'mindmap', root: 'X', branches: [{ label: 'a' }, { label: 'b' }] }).match(/<path/g) || []).length === 2, 'mindmap draws a connector per branch');
ok(D.render({ type: 'mindmap', root: 'Y6', branches: [{ label: 'Fractions' }] }).includes('Fractions'), 'mindmap shows branch labels');
ok(svgOk(D.render({ type: 'knowledgemap', root: 'X', branches: [{ label: 'a' }] })), 'alias "knowledgemap" → mindmap');
ok(D.render({ type: 'mindmap', branches: [] }) === '', 'mindmap with no branches → empty');
// yearmap: lanes × (this year | next year) nodes, status styles + marks, "builds on" arrows
{
  const ym = {
    type: 'yearmap', years: ['Year 8 · 2026', 'Year 9 · 2027'],
    lanes: [
      { id: 'a', en: 'Algebra', zh: '代数', nodes: [
        { id: 'a1', en: 'Expand & simplify', zh: '展开化简', year: 0, status: 'secure' },
        { id: 'a2', en: 'Equations', zh: '方程', year: 0, status: 'work', book: true },
        { id: 'a3', en: 'Sequences & graphs', year: 0, status: 'ok' },
        { id: 'a4', en: 'y = mx + c', year: 1, status: 'next' }] },
      { id: 'm', en: 'Measurement', nodes: [{ id: 'm1', en: 'Area & volume units', year: 0, status: 'ok' }] }],
    links: [['a1', 'a2'], ['a1', 'a3'], ['a3', 'a4'], ['a2', 'm1'], ['a1', 'nope']]
  };
  const out = D.render(ym);
  ok(svgOk(out) && safe(out), 'yearmap renders a valid, safe <svg>');
  ok((out.match(/<rect[^>]*rx="7"/g) || []).length === 5, 'yearmap draws one box per topic (5)');
  ok(out.includes('Year 8 · 2026') && out.includes('Year 9 · 2027'), 'yearmap shows both year headers');
  ok(out.includes('Algebra') && out.includes('代数'), 'yearmap shows lane labels (EN + 中文)');
  ok(out.includes('#34c759') && out.includes('#ff9500'), 'yearmap colours secure (green) and needs-work (orange)');
  ok(/stroke="#8e8e93" stroke-width="1.3" stroke-dasharray="4 3"/.test(out), 'yearmap next-year topic is dashed grey');
  ok(out.includes('>✓<') && out.includes('>!<'), 'yearmap marks status with ✓ / ! (not colour alone)');
  ok(out.includes('#ffb400'), 'yearmap stars a topic that is in the holiday book');
  ok((out.match(/marker-end="url\(#ymArrow\)"/g) || []).length === 4, 'yearmap draws 4 arrows (a link to a missing id is skipped)');
  ok(/<path d="M[^"]*" fill="none" stroke="#636366" stroke-width="1.2"/.test(out), 'yearmap arcs over a topic it skips (a1 → a3)');
  ok(/stroke-dasharray="3 3" marker-end/.test(out), 'yearmap cross-lane link is a dashed curve');
  ok(svgOk(D.render(Object.assign({}, ym, { type: 'knowmap' }))), 'alias "knowmap" → yearmap');
  ok(D.render({ type: 'yearmap', lanes: [] }) === '', 'yearmap with no lanes → empty');
  ok(D.render({ type: 'yearmap', lanes: [{ id: 'x', en: '<b>X</b>', nodes: [{ id: 'n', en: 'A & B <i>', year: 0, status: 'ok' }] }] }).includes('A &amp; B &lt;i&gt;'), 'yearmap escapes text');
}

// alias resolution + whitespace/underscore tolerance
ok(svgOk(D.render({ type: 'number_line', min: 0, max: 5 })), 'alias "number_line" works');
ok(svgOk(D.render({ type: 'Bar Chart', bars: [3, 5] })), 'alias "Bar Chart" (spaces) works');

// robustness: bad/empty/unknown specs → '' (caller falls back)
ok(D.render(null) === '', 'null spec → empty');
ok(D.render({ type: 'wat' }) === '', 'unknown type → empty');
ok(D.render({ type: 'pie' }) === '', 'pie with no parts → empty');
ok(D.render({ type: 'pie', parts: [{ value: 0 }, { value: 0 }] }) === '', 'pie all-zero → empty');
ok(D.render({ type: 'bar', bars: [] }) === '', 'bar with no bars → empty');

// figureRows: decode the exact per-row values a data figure DRAWS (for verify enrichment +
// the deterministic figure-vs-key guard). Pictogram value = round(rawValue/per)*per.
{
  const fr = D.figureRows({ type: 'pictogram', icon: '🍎', per: 3, rows: [{ label: 'Apple', value: 6 }, { label: 'Banana', value: 3 }] });
  ok(Array.isArray(fr) && fr.length === 2, 'figureRows pictogram → 2 rows');
  ok(fr && fr[0].symbols === 2 && fr[0].value === 6, 'pictogram Apple: 2 icons = 6');
  ok(fr && fr[1].symbols === 1 && fr[1].value === 3, 'pictogram Banana value=3,per=3 → 1 icon = 3 (the bug: NOT 9)');
  ok(fr && fr[1].label === 'Banana', 'pictogram row label preserved');
}
ok(D.figureRows({ type: 'bar', bars: [{ label: 'Cat', value: 4 }, { label: 'Dog', value: 7 }] })[1].value === 7, 'figureRows bar reads value');
ok(D.figureRows({ type: 'tally', rows: [{ label: 'Red', value: 7 }] })[0].value === 7, 'figureRows tally reads value');
ok(D.figureRows({ type: 'pie', parts: [{ value: 3 }] }) === null, 'figureRows on non-data figure → null');
ok(D.figureRows(null) === null, 'figureRows null-safe');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
