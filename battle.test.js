/* Tests for the battle TYPE SYSTEM + stat/move model. Extracts the real data
 * and functions from index.html and checks canonical Pokémon types, the type
 * effectiveness chart, and the new cardStats / cardMoves shapes.
 * Run with: node battle.test.js */
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// Grab a `const NAME={...}/[...]` or `function NAME(...){...}` by bracket-matching.
function grab(decl) {
  const i = src.indexOf(decl); if (i < 0) throw new Error('not found: ' + decl);
  let j = i; while (j < src.length && '{['.indexOf(src[j]) < 0) j++;
  const open = src[j], close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, q = '', esc = false, k = j;
  for (; k < src.length; k++) {
    const c = src[k];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
    else if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) { k++; break; } }
  }
  return src.slice(i, k) + (decl.indexOf('function') < 0 ? ';' : '');
}

const code = [
  grab('const POKEDEX='), grab('const POKE_TYPES='), grab('const TYPE_FX='),
  grab('const TYPE_MOVE='), grab('const UTIL_MOVES='), grab('const TYPE_COLOR='),
  grab('function pokeTypes('), grab('function typeMult('),
  grab('function cardStats('), grab('function cardMoves(')
].join('\n');

const ctx = {};
new Function('el', code + '\nthis.x={POKEDEX,POKE_TYPES,TYPE_FX,TYPE_MOVE,TYPE_COLOR,UTIL_MOVES,pokeTypes,typeMult,cardStats,cardMoves};').call(ctx);
const { POKEDEX, POKE_TYPES, TYPE_FX, TYPE_COLOR, pokeTypes, typeMult, cardStats, cardMoves } = ctx.x;

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  ✗ ' + m)); };
const eq = (a, b, m) => ok(a === b, m + ` (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);

// 1. Every Pokémon in the dex has a real type, and every type is a known/valid one.
const VALID = Object.keys(TYPE_COLOR);
let missing = POKEDEX.filter(p => !POKE_TYPES[p.id]);
ok(missing.length === 0, 'every dex entry has a type (missing: ' + missing.map(p => p.name).join() + ')');
let badType = [];
POKEDEX.forEach(p => (POKE_TYPES[p.id] || []).forEach(t => { if (VALID.indexOf(t) < 0 || !TYPE_FX[t]) badType.push(p.name + ':' + t); }));
ok(badType.length === 0, 'all assigned types are valid chart types (bad: ' + badType.join() + ')');

// 2. Canonical type effectiveness (true multipliers).
eq(typeMult('fire', ['grass']), 2, 'fire → grass super');
eq(typeMult('fire', ['water']), 0.5, 'fire → water resisted');
eq(typeMult('water', ['fire']), 2, 'water → fire super');
eq(typeMult('grass', ['water']), 2, 'grass → water super');
eq(typeMult('electric', ['ground']), 0, 'electric → ground IMMUNE');
eq(typeMult('normal', ['ghost']), 0, 'normal → ghost IMMUNE');
eq(typeMult('fighting', ['ghost']), 0, 'fighting → ghost IMMUNE');
eq(typeMult('psychic', ['dark']), 0, 'psychic → dark IMMUNE');
eq(typeMult('dragon', ['fairy']), 0, 'dragon → fairy IMMUNE');
eq(typeMult('dark', ['psychic']), 2, 'dark → psychic super');
eq(typeMult('fairy', ['dragon']), 2, 'fairy → dragon super');
eq(typeMult('normal', ['rock']), 0.5, 'normal → rock resisted');
// dual-type stacking
eq(typeMult('electric', ['water', 'flying']), 4, 'electric → Gyarados (water/flying) 4×');
eq(typeMult('ice', ['dragon', 'flying']), 4, 'ice → Dragonite (dragon/flying) 4×');
eq(typeMult('rock', ['fire', 'flying']), 4, 'rock → Charizard (fire/flying) 4×');
eq(typeMult('ground', ['steel', 'psychic']), 2, 'ground → Metagross: ground×steel(2)×psychic(1)=2');

// 3. Real-type spot checks (a fan would expect these).
eq(JSON.stringify(pokeTypes(4)), JSON.stringify(['fire']), 'Charmander = Fire');
eq(JSON.stringify(pokeTypes(25)), JSON.stringify(['electric']), 'Pikachu = Electric');
eq(JSON.stringify(pokeTypes(129)), JSON.stringify(['water']), 'Magikarp = Water');
eq(JSON.stringify(pokeTypes(6)), JSON.stringify(['fire', 'flying']), 'Charizard = Fire/Flying');
eq(JSON.stringify(pokeTypes(94)), JSON.stringify(['ghost', 'poison']), 'Gengar = Ghost/Poison');
eq(JSON.stringify(pokeTypes(445)), JSON.stringify(['dragon', 'ground']), 'Garchomp = Dragon/Ground');
eq(JSON.stringify(pokeTypes(448)), JSON.stringify(['fighting', 'steel']), 'Lucario = Fighting/Steel');

// 4. New stats: HP/Atk/Def/Spd present and scaling up with level.
const s1 = cardStats(1, 1), s2 = cardStats(1, 10);
ok(s1.hp > 0 && s1.atk > 0 && s1.def > 0 && s1.spd > 0, 'cardStats has hp/atk/def/spd');
ok(s2.def > s1.def && s2.spd > s1.spd && s2.hp > s1.hp, 'stats grow with level');
ok(cardStats(5, 1).def > cardStats(1, 1).def, 'higher tier = more defense');

// 5. Move kit: STAB attack of own type, risky Take Down, utility move.
const mv = cardMoves(4, 2, 5); // Charmander (Fire)
eq(mv.length, 3, 'three moves');
eq(mv[0].kind, 'attack', 'move 1 is an attack');
eq(mv[0].type, 'fire', 'move 1 is the STAB type (Fire for Charmander)');
eq(mv[1].name, 'Take Down', 'move 2 is the risky Take Down');
eq(mv[1].acc, 75, 'Take Down is 75% accuracy (risky)');
ok(['buff', 'debuff', 'heal'].indexOf(mv[2].kind) >= 0, 'move 3 is a utility/status move');
// STAB move type always matches the Pokémon's primary type, across the roster
let stabBad = POKEDEX.filter(p => cardMoves(p.id, p.t, 1)[0].type !== pokeTypes(p.id)[0]);
ok(stabBad.length === 0, 'every Pokémon\'s STAB move matches its primary type (bad: ' + stabBad.map(p => p.name).join() + ')');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
