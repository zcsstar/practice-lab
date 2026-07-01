/* Economy ledger tests: extract the pure card/trainer merge + normalise helpers
 * from index.html and verify that SPENDS survive an additive (MAX) Drive merge —
 * the core guarantee that stops traded/converted cards and spent candy from
 * resurrecting across devices. */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');
function extract(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('not found: ' + name);
  let i = src.indexOf('{', start), depth = 0, inStr = false, q = '', esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
    else if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(start, i);
}
const ctx = {};
new Function(['normCard', 'normTrainer', 'mergeCardRec', 'mergeTrainerVals'].map(extract).join('\n') +
  '\nthis.normCard=normCard;this.normTrainer=normTrainer;this.mergeCardRec=mergeCardRec;this.mergeTrainerVals=mergeTrainerVals;').call(ctx);
const { normCard, normTrainer, mergeCardRec, mergeTrainerVals } = ctx;

let pass = 0, fail = 0;
const eq = (desc, got, exp) => { const g = JSON.stringify(got), e = JSON.stringify(exp); if (g === e) pass++; else { fail++; console.log(`  ✗ ${desc}\n      expected ${e}\n      got      ${g}`); } };

// ── normCard migration: legacy record (count only) → ledger ──────────────────
eq('normCard migrates legacy count→gained', (() => { const c = normCard({ count: 3 }); return [c.gained, c.lost, c.count]; })(), [3, 0, 3]);
eq('normCard derives count from ledger', (() => { const c = normCard({ gained: 5, lost: 2 }); return c.count; })(), 3);
eq('normCard clamps count at 0', (() => { const c = normCard({ gained: 1, lost: 3 }); return c.count; })(), 0);

// ── The core guarantee: a SPEND survives a MAX-merge ─────────────────────────
// Device A traded the card away (gained 1, lost 1 → count 0). Device B still has the
// stale copy (gained 1, lost 0 → count 1). Merge must keep it GONE, not resurrect it.
eq('spent card stays gone after merge', mergeCardRec({ gained: 1, lost: 1, count: 0, level: 1 }, { gained: 1, lost: 0, count: 1, level: 1 }),
  { gained: 1, lost: 1, count: 0, level: 1, shiny: false });
// Earned copies still accumulate (both devices caught one) → gained 2.
eq('earned copies accumulate', mergeCardRec({ gained: 2, lost: 0, count: 2, level: 3, shiny: false }, { gained: 1, lost: 0, count: 1, level: 1, shiny: true }),
  { gained: 2, lost: 0, count: 2, level: 3, shiny: true });

// ── Trainer candy: a SPEND survives a MAX-merge ──────────────────────────────
eq('normTrainer migrates legacy candy', (() => { const t = normTrainer({ candy: 40 }); return [t.candyEarned, t.candySpent, t.candy]; })(), [40, 0, 40]);
// A trained a card (spent 30 of 100 → candy 70). B is stale (earned 100, spent 0 → candy 100).
// Merge must respect the spend: candy = 100 − 30 = 70, NOT snap back to 100.
eq('spent candy stays spent after merge', mergeTrainerVals({ xp: 500, candyEarned: 100, candySpent: 30, candy: 70 }, { xp: 500, candyEarned: 100, candySpent: 0, candy: 100 }),
  { xp: 500, candyEarned: 100, candySpent: 30, candy: 70 });
// Concurrent earns take the higher total (known additive limit) but spends still tracked.
eq('higher earned + higher spent both win', mergeTrainerVals({ xp: 600, candyEarned: 120, candySpent: 30, candy: 90 }, { xp: 550, candyEarned: 100, candySpent: 50, candy: 50 }),
  { xp: 600, candyEarned: 120, candySpent: 50, candy: 70 });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
