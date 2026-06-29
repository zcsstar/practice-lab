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
  tally: { type: 'tally', rows: [{ label: 'Red', value: 7 }, { label: 'Blue', value: 12 }] }
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
// fractionbar: 4 parts → 4 cells; title adds a title text
ok((D.render(specs.fractionbar).match(/<rect/g) || []).length === 4, 'fractionbar draws one cell per part');
ok(/font-weight="700"/.test(D.render({ type: 'pie', parts: [{ value: 1 }], title: 'Hi' })), 'title row is rendered');
// array: rows*cols cells
ok((D.render(specs.array).match(/<rect/g) || []).length === 12, 'array draws rows×cols cells');
// clock has two hands (hour + minute lines) + face circle
ok((D.render(specs.clock).match(/<circle/g) || []).length >= 1 && (D.render(specs.clock).match(/<line/g) || []).length >= 2, 'clock has a face + hands');
// alias resolution + whitespace/underscore tolerance
ok(svgOk(D.render({ type: 'number_line', min: 0, max: 5 })), 'alias "number_line" works');
ok(svgOk(D.render({ type: 'Bar Chart', bars: [3, 5] })), 'alias "Bar Chart" (spaces) works');

// robustness: bad/empty/unknown specs → '' (caller falls back)
ok(D.render(null) === '', 'null spec → empty');
ok(D.render({ type: 'wat' }) === '', 'unknown type → empty');
ok(D.render({ type: 'pie' }) === '', 'pie with no parts → empty');
ok(D.render({ type: 'pie', parts: [{ value: 0 }, { value: 0 }] }) === '', 'pie all-zero → empty');
ok(D.render({ type: 'bar', bars: [] }) === '', 'bar with no bars → empty');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
