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
const tierValueSrc = src.match(/const TIER_VALUE=\[[^\]]*\];/)[0]; // NPC market pricing table
const shopMarkupSrc = src.match(/const SHOP_MARKUP=\[[^\]]*\];/)[0]; // per-tier retail markup
const marketTypesSrc = src.match(/const MARKET_TYPES=\[[^\]]*\];/)[0]; // daily supply/demand type pool
const badgesSrc = src.match(/const BADGES=\[[\s\S]*?\n\];/)[0];      // Smart-Shopper badge definitions
const fundConstSrc = src.match(/const FUND_START=[^\n;]*;/)[0];    // FUND_START + CANDY_PER_PRACTICE
const POKE_BY_ID = { 10: { t: 1 }, 25: { t: 2 }, 6: { t: 4 }, 150: { t: 5 }, 1: { t: 2 }, 4: { t: 2 } }; // stub: dexId → rarity tier
const pokeTypes = id => id === 1 ? ['grass'] : id === 4 ? ['fire'] : ['normal']; // stub types (rest 'normal' → never hot/cold)
const todayISO = () => '2026-07-18'; // fixed so the daily market is deterministic in tests
const ctx = {};
new Function('POKE_BY_ID', 'pokeTypes', 'todayISO',
  tierValueSrc + '\n' + shopMarkupSrc + '\n' + marketTypesSrc + '\n' + badgesSrc + '\n' + fundConstSrc + '\n' +
  ['normCard', 'normTrainer', 'mergeCardRec', 'mergeTrainerVals', 'cardValue', 'wantValue',
    'tradeCards', 'sumValue', 'tradeValue', 'bundlePrice', 'charmPrice', 'dealRating',
    'dayHash', 'todayMarket', 'marketMult', 'marketValue', 'tradeMarketValue', 'askMarketValue', 'npcAcceptProb',
    'haggleReply', 'auctionBidStep', 'earnedBadges', 'tradeNetFor',
    'bankPayout', 'fundStep', 'stockStep', 'fundValue', 'shopPrice', 'candyInPractices', 'moneyMathQuestion'].map(extract).join('\n') +
  '\nthis.normCard=normCard;this.normTrainer=normTrainer;this.mergeCardRec=mergeCardRec;this.mergeTrainerVals=mergeTrainerVals;' +
  'this.cardValue=cardValue;this.wantValue=wantValue;this.tradeCards=tradeCards;this.sumValue=sumValue;this.tradeValue=tradeValue;' +
  'this.bundlePrice=bundlePrice;this.charmPrice=charmPrice;this.dealRating=dealRating;this.npcAcceptProb=npcAcceptProb;' +
  'this.dayHash=dayHash;this.todayMarket=todayMarket;this.marketMult=marketMult;this.marketValue=marketValue;this.tradeMarketValue=tradeMarketValue;this.askMarketValue=askMarketValue;' +
  'this.haggleReply=haggleReply;this.auctionBidStep=auctionBidStep;this.earnedBadges=earnedBadges;this.tradeNetFor=tradeNetFor;' +
  'this.bankPayout=bankPayout;this.fundStep=fundStep;this.stockStep=stockStep;this.fundValue=fundValue;this.shopPrice=shopPrice;this.candyInPractices=candyInPractices;' +
  'this.moneyMathQuestion=moneyMathQuestion;').call(ctx, POKE_BY_ID, pokeTypes, todayISO);
const { normCard, normTrainer, mergeCardRec, mergeTrainerVals, cardValue, wantValue,
  tradeCards, sumValue, tradeValue, bundlePrice, charmPrice, dealRating, npcAcceptProb,
  todayMarket, marketMult, marketValue, tradeMarketValue, askMarketValue,
  haggleReply, auctionBidStep, earnedBadges, tradeNetFor,
  bankPayout, fundStep, stockStep, fundValue, shopPrice, candyInPractices, moneyMathQuestion } = ctx;

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

// ── NPC trade market pricing (v2.46): fair offers get taken, greedy ones rarely ──
eq('cardValue base tier 2', cardValue({ tier: 2, level: 1 }), 24);
eq('cardValue level bonus (t2 L6 = round(24×1.3))', cardValue({ tier: 2, level: 6 }), 31);
eq('cardValue shiny bonus (t2 ×1.6)', cardValue({ tier: 2, level: 1, shiny: true }), 38);
eq('wantValue candy is the amount', wantValue({ type: 'candy', amount: 20 }), 20);
eq('wantValue card uses the tier value', wantValue({ type: 'card', dexId: 6 }), 70); // t4
// A good deal for the taker (offered worth far more than the ask) → very likely accepted.
eq('npcAcceptProb generous offer → high', npcAcceptProb({ card: { tier: 4, level: 1 }, want: { type: 'candy', amount: 10 } }), 0.92);
// A fair-ish offer (ratio ≈ 1.2) → often accepted.
eq('npcAcceptProb fair candy offer', npcAcceptProb({ card: { tier: 2, level: 1 }, want: { type: 'candy', amount: 20 } }), 0.7);
// A greedy candy ask (tier-1 card for 50 candy) → rarely accepted.
eq('npcAcceptProb greedy candy ask → low', npcAcceptProb({ card: { tier: 1, level: 1 }, want: { type: 'candy', amount: 50 } }), 0.06);
// Card-for-card of equal tier → fair.
eq('npcAcceptProb equal card swap', npcAcceptProb({ card: { tier: 4, level: 1 }, want: { type: 'card', dexId: 6 } }), 0.7);
// Asking a legendary for a common card → greedy.
eq('npcAcceptProb asking way up → low', npcAcceptProb({ card: { tier: 1, level: 1 }, want: { type: 'card', dexId: 150 } }), 0.06);

// ── Market coach (v2.47): bundles, charm pricing, fair-deal rating ───────────
eq('tradeCards from single t.card', tradeCards({ card: { dexId: 25, tier: 2 } }).length, 1);
eq('tradeCards from t.cards bundle', tradeCards({ cards: [{ tier: 2 }, { tier: 4 }] }).length, 2);
eq('tradeValue sums a bundle (t2+t4 = 24+70)', tradeValue({ cards: [{ tier: 2, level: 1 }, { tier: 4, level: 1 }] }), 94);
eq('tradeValue single falls back to t.card', tradeValue({ card: { tier: 2, level: 1 } }), 24);
// bundlePrice: a bulk discount for ≥2 cards; single = plain value.
eq('bundlePrice single = value', bundlePrice([{ tier: 2, level: 1 }]), 24);
eq('bundlePrice 2 cards ≈6% off (48→45)', bundlePrice([{ tier: 2, level: 1 }, { tier: 2, level: 1 }]), 45);
eq('bundlePrice 3 cards ≈12% off (72→63)', bundlePrice([{ tier: 2, level: 1 }, { tier: 2, level: 1 }, { tier: 2, level: 1 }]), 63);
// charm pricing (价格心理): round tens drop to a "9"; other numbers unchanged.
eq('charmPrice 20 → 19', charmPrice(20), 19);
eq('charmPrice 50 → 49', charmPrice(50), 49);
eq('charmPrice 19 stays 19', charmPrice(19), 19);
eq('charmPrice 24 stays 24 (not a round ten)', charmPrice(24), 24);
eq('charmPrice 5 stays 5 (too small)', charmPrice(5), 5);
// dealRating: teaches the fair sweet spot between giving away and over-charging.
eq('dealRating generous (ratio 7) → warns to ask more', dealRating(70, 10).emoji, '🎁');
eq('dealRating fair (equal value) → ok', dealRating(24, 24).tone, 'ok');
eq('dealRating great deal (ratio 1.2) → ok', dealRating(24, 20).tone, 'ok');
eq('dealRating too steep (ratio 0.5) → bad', dealRating(24, 48).tone, 'bad');
// npcAcceptProb values a BUNDLE by its summed value. Test cards have no dexId → type 'normal' →
// never hot/cold → market multiplier 1, so these stay equal to the base-value expectations.
eq('npcAcceptProb bundle vs candy (give 94 / ask 90 ≈ fair)', npcAcceptProb({ cards: [{ tier: 2, level: 1 }, { tier: 4, level: 1 }], want: { type: 'candy', amount: 90 } }), 0.7);

// ── Dynamic market (v2.50): a hot type is worth +25%, cold −20%, others unchanged ──
const MKT = { hot: 'grass', cold: 'fire' };
eq('marketMult hot type → 1.25', marketMult(1, MKT), 1.25);   // dexId 1 = grass (hot)
eq('marketMult cold type → 0.8', marketMult(4, MKT), 0.8);    // dexId 4 = fire (cold)
eq('marketMult neutral type → 1', marketMult(99, MKT), 1);    // 'normal'
eq('marketValue lifts a hot card (t2 24 → 30)', marketValue({ dexId: 1, tier: 2, level: 1 }, MKT), 30);
eq('marketValue drops a cold card (t2 24 → 19)', marketValue({ dexId: 4, tier: 2, level: 1 }, MKT), 19);
eq('tradeMarketValue sums a mixed bundle at market', tradeMarketValue({ cards: [{ dexId: 1, tier: 2, level: 1 }, { dexId: 4, tier: 2, level: 1 }] }, MKT), 49); // 30 + 19
eq('askMarketValue candy = amount', askMarketValue({ type: 'candy', amount: 25 }, MKT), 25);
eq('askMarketValue hot requested card is market-adjusted (t2 grass 24→30)', askMarketValue({ type: 'card', dexId: 1 }, MKT), 30);
eq('askMarketValue cold requested card (t2 fire 24→19)', askMarketValue({ type: 'card', dexId: 4 }, MKT), 19);
// todayMarket is deterministic per date, picks two distinct non-'normal' types, and BOTH hot AND
// cold change day-to-day (the v2.50 review fix — cold must not be sticky for a week).
{
  const m = todayMarket('2026-07-18');
  eq('todayMarket is deterministic per date', JSON.stringify(m), JSON.stringify(todayMarket('2026-07-18')));
  eq('todayMarket hot ≠ cold and both real types', m.hot !== m.cold && m.hot !== 'normal' && m.cold !== 'normal', true);
  // cold changes at least once across the next 3 days (would fail the old floor(h/7) sticky-cold logic)
  const colds = ['2026-07-18', '2026-07-19', '2026-07-20', '2026-07-21'].map(d => todayMarket(d).cold);
  eq('cold type is not stuck day-to-day', new Set(colds).size > 1, true);
}

// ── Money Lab (v2.48): term-deposit interest, fund price movement, shop pricing ──
eq('bankPayout 50 @ +60% = 80', bankPayout(50, 0.6), 80);
eq('bankPayout 10 @ +10% = 11', bankPayout(10, 0.1), 11);
eq('fundStep up day (+10%)', fundStep(100, 0.1), 110);
eq('fundStep down day (−8%)', fundStep(100, -0.08), 92);
eq('fundStep floored at 20 on a crash', fundStep(100, -0.95), 20);
// Star Card (single-card bet, v2.53): wider swings + a LOWER crash floor than the diversified fund.
eq('stockStep big up day (+22%)', stockStep(100, 0.22), 122);
eq('stockStep big down day (−18%)', stockStep(100, -0.18), 82);
eq('stockStep can crash further than the fund (floor 8, not 20)', stockStep(100, -0.99), 8);
eq('fundValue = units × price (rounded)', fundValue(2.5, 118), 295);
eq('shopPrice rare card t4 (steeper markup → 175)', shopPrice(6), 175);
eq('shopPrice legendary t5 (steepest markup → 385)', shopPrice(150), 385);
eq('shopPrice common t1 (→ 20)', shopPrice(10), 20);
eq('candyInPractices ~ cost / earn-rate', candyInPractices(70), 10);

// ── Deal-math generator (v2.49): always 4 unique non-negative integer options incl. the answer ──
{
  let ok = true, sawTypes = {};
  for (let i = 0; i < 400; i++) {
    const m = moneyMathQuestion();
    if (!m || typeof m.q !== 'string' || typeof m.concept !== 'string') ok = false;
    if (!Array.isArray(m.options) || m.options.length !== 4) ok = false;
    if (new Set(m.options).size !== 4) ok = false;
    if (m.options.indexOf(m.answer) < 0) ok = false;
    if (m.options.some(o => !Number.isInteger(o) || o < 0)) ok = false;
  }
  eq('moneyMathQuestion always well-formed (4 unique int options incl. answer)', ok, true);
}

// ── Haggling (v2.51): negotiate — accept at/above reservation, else meet in the middle, else walk ──
// reservation 20, seller asking 40. Offering their ask → deal at the ask.
eq('haggle: offering the ask → deal at ask', haggleReply(20, 40, 40, 0, 4).action, 'deal');
eq('haggle: offer at/above reservation → deal at your offer', JSON.stringify((r => [r.action, r.price])(haggleReply(20, 40, 22, 0, 4))), JSON.stringify(['deal', 22]));
{ // below reservation early → counter meeting in the middle, never below reservation
  const r = haggleReply(20, 40, 10, 0, 4);
  eq('haggle: too low early → counter', r.action, 'counter');
  eq('haggle: counter is the midpoint (40+10)/2 = 25', r.sellerPrice, 25);
  eq('haggle: counter never below reservation', haggleReply(20, 24, 4, 0, 4).sellerPrice >= 20, true);
}
eq('haggle: too low on the last round → walk away', haggleReply(20, 40, 5, 3, 4).action, 'walk');

// ── Auctions (v2.51): NPC bids bump ~15% toward a soft cap just above market, then stop ──
eq('auctionBidStep bumps ~15% (100 → 115)', auctionBidStep(100, 100), 115);
eq('auctionBidStep enforces a minimum +2 step', auctionBidStep(10, 100), 12);
eq('auctionBidStep caps just above market (115) — at cap → null', auctionBidStep(115, 100), null);
eq('auctionBidStep past cap → null (no more bids)', auctionBidStep(130, 100), null);
eq('auctionBidStep never exceeds the cap', auctionBidStep(110, 100), 115);

// ── Smart-Shopper badges + trading P&L (v2.52) ──
const badge = (vault, extra, name) => earnedBadges(vault, extra).find(b => b.name === name);
eq('badge Saver earned after a bank deposit', badge({ stats: { banked: 1 } }, {}, 'Saver').got, true);
eq('badge Saver locked with no deposit', badge({ stats: {} }, {}, 'Saver').got, false);
eq('badge Maths Whiz needs 5 wins (4 → locked)', badge({ stats: { mathWins: 4 } }, {}, 'Maths Whiz').got, false);
eq('badge Maths Whiz at 5 → earned', badge({ stats: { mathWins: 5 } }, {}, 'Maths Whiz').got, true);
eq('badge Generous earned after a gift', badge({ stats: { gifts: 2 } }, {}, 'Generous').got, true);
eq('badge Profit Trader uses netTrade (>0 → earned)', badge({ stats: {} }, { netTrade: 10 }, 'Profit Trader').got, true);
eq('badge Profit Trader with 0 net → locked', badge({ stats: {} }, { netTrade: 0 }, 'Profit Trader').got, false);
eq('earnedBadges handles a missing/empty vault safely', earnedBadges(null, {}).some(b => b.got), false);
// tradeNetFor: sold (fixed candy sales + auction bids) − bought (candy paid)
eq('tradeNetFor sums fixed sales + auction bids − buys',
  tradeNetFor('me', [
    { status: 'done', sellerId: 'me', want: { type: 'candy', amount: 20 } },
    { status: 'done', sellerId: 'me', kind: 'auction', bid: 30 },
    { status: 'done', takenBy: 'me', want: { type: 'candy', amount: 5 } },
    { status: 'open', sellerId: 'me', want: { type: 'candy', amount: 99 } }, // open → ignored
  ]), 45);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
