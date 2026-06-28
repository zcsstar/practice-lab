/* ============================================================================
 * Practice Lab — Poké battle (vs PC)
 * ----------------------------------------------------------------------------
 * A flashy 2D turn-based battle that's GATED BEHIND PRACTICE: you earn ⚡ energy
 * by practising and spend 1 per battle, so the game stays a reward for learning.
 * Uses your owned Pokémon's stats/moves (from index.html), fights a wild Pokémon
 * (local AI), animates with GSAP (lunges, hits, particles, HP drain, faints,
 * confetti) over a pseudo-3D arena. Rewards loop back to practice (XP, candy, a
 * chance to catch the wild card, and an occasional "double next pack" buff).
 *
 * Classic script (no modules) so file:// + GitHub Pages both work. Relies on
 * globals defined in index.html (el, show, $, toast, gsap, reduceMotion, POKEDEX,
 * POKE_BY_ID, RARITY, pokeSprite, cardStats, cardMoves, cardsForProfile,
 * trainerGet, trainerCandyMove, dbPut, dbAll, pid, activeProfile, cardAward,
 * backBar, rarityStars, confettiBurst, viewCards). All referenced at call-time.
 * ========================================================================== */
(function (root) {
  'use strict';
  var MAX_ENERGY = 12;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  // Run a GSAP tween as a promise (resolves instantly if animation is off).
  function tween(target, vars) {
    return new Promise(function (res) {
      if (!window.gsap || reduceMotion || !target) return res();
      var v = Object.assign({}, vars, { onComplete: res });
      gsap.to(target, v);
    });
  }

  function mkCombatant(dexId, tier, level, shiny) {
    var st = cardStats(tier, level);
    var p = POKE_BY_ID[dexId];
    return { dexId: dexId, tier: tier, level: level || 1, shiny: !!shiny,
      name: (p ? p.name : 'Pokémon'), hp: st.hp, maxhp: st.hp, atk: st.atk,
      moves: cardMoves(dexId, tier, level || 1) };
  }
  // Pick a wild RARITY: usually the player's own tier, sometimes lower, rarely one
  // above — so fights are mostly fair/winnable and only occasionally a tough stretch.
  function wildTier(playerTier) {
    var pt = clamp(playerTier || 1, 1, 5), w = [0, 0, 0, 0, 0, 0], t, tot = 0;
    for (t = 1; t <= 5; t++) w[t] = (t < pt ? 22 : t === pt ? 50 : t === pt + 1 ? 12 : 0);
    for (t = 1; t <= 5; t++) tot += w[t];
    var r = Math.random() * tot;
    for (t = 1; t <= 5; t++) { if (r < w[t]) return t; r -= w[t]; }
    return pt;
  }
  // Build a wild opponent: same-ish rarity, never higher level than you, and a
  // touch weaker than an equal Pokémon so the player (the hero) has a fair edge.
  function wildOpponent(playerLevel, playerTier) {
    var t = wildTier(playerTier);
    var pool = POKEDEX.filter(function (p) { return p.t === t; });
    var p = pool[Math.floor(Math.random() * pool.length)];
    var lvl = clamp(Math.round(playerLevel + rnd(-2, 0)), 1, 25);
    var c = mkCombatant(p.id, p.t, lvl, Math.random() < 0.03);
    c.hp = c.maxhp = Math.round(c.maxhp * 0.9); c.atk = Math.max(1, Math.round(c.atk * 0.9));
    return c;
  }
  function dmg(attacker, move) {
    var base = move.power + attacker.atk * 0.45;
    var crit = Math.random() < 0.12;
    return { amount: Math.max(1, Math.round(base * rnd(0.85, 1.12) * (crit ? 1.6 : 1))), crit: crit };
  }

  // ---- energy (stored on the trainer doc) ----
  async function getEnergy() { return (await trainerGet()).energy || 0; }
  async function addEnergy(n) { var t = await trainerGet(); t.energy = clamp((t.energy || 0) + n, 0, MAX_ENERGY); t.updatedAt = Date.now(); await dbPut('trainer', t); return t.energy; }
  async function spendEnergy(n) { var t = await trainerGet(); if ((t.energy || 0) < n) return false; t.energy -= n; t.updatedAt = Date.now(); await dbPut('trainer', t); return true; }

  // ---- pre-battle: choose your Pokémon ----
  async function viewBattle() {
    if (typeof stopTimer === 'function') stopTimer();
    var owned = await cardsForProfile();
    var energy = await getEnergy();
    if (!owned.length) return show(el('div', {}, backBar('Battle', function () { viewCards(); }),
      el('div', { class: 'card' }, el('div', { class: 'empty' }, el('div', { class: 'big' }, '⚔️'), el('div', {}, 'No Pokémon yet! Do a practice to earn your first card, then come back to battle.')))));
    var grid = el('div', { class: 'dexgrid' });
    owned.slice().sort(function (a, b) { return (b.level || 1) - (a.level || 1); }).forEach(function (c) {
      var p = POKE_BY_ID[c.dexId]; if (!p) return; var st = cardStats(p.t, c.level || 1);
      grid.append(el('div', { class: 'dexcell own', style: 'border-color:' + RARITY[p.t].color, onclick: function () { startFight(c); } },
        c.shiny ? el('span', { class: 'shy' }, '✨') : '', pokeImg(c.dexId, c.shiny, 60),
        el('div', { class: 'dn' }, p.name), el('div', { class: 'lv' }, 'Lv ' + (c.level || 1)),
        el('div', { class: 'ds', style: 'color:var(--muted)' }, '❤️' + st.hp + ' ⚔️' + st.atk)));
    });
    show(el('div', {}, backBar('Battle', function () { viewCards(); }),
      el('div', { class: 'card', style: 'background:var(--feature);border-color:#cfe2ff' },
        el('div', { class: 'row between' }, el('h2', { style: 'margin:0' }, '⚔️ Battle a wild Pokémon'), el('span', { style: 'font-weight:800' }, '⚡ ' + energy + ' energy')),
        el('p', { class: 'sub', style: 'margin:6px 0 0' }, energy >= 1 ? 'Pick a Pokémon to battle with. Costs ⚡1 energy — you earn energy by doing practices!' : 'You’re out of ⚡ energy. Do a practice to earn more, then come back!')),
      energy >= 1 ? el('div', { class: 'card' }, el('h2', {}, 'Choose your Pokémon'), grid)
        : el('div', { class: 'card' }, el('div', { class: 'empty' }, el('div', { class: 'big' }, '⚡'), el('div', {}, 'No energy left. One practice = at least 1 energy.')))));
  }

  // ---- the fight ----
  function bar(side, c) {
    return el('div', { class: 'bt-side bt-' + side },
      el('div', { class: 'bt-info' },
        el('div', { class: 'bt-name' }, c.name + '  Lv' + c.level),
        el('div', { class: 'bt-hpwrap' }, el('div', { class: 'bt-hp', id: 'hp-' + side }))),
      el('div', { class: 'bt-mon', id: 'mon-' + side }, pokeImg(c.dexId, c.shiny, side === 'foe' ? 130 : 150)));
  }
  function hpColor(p) { return p > 50 ? '#34c759' : p > 20 ? '#ff9500' : '#ff3b30'; }
  function setHp(side, c) { var b = $('#hp-' + side); if (b) { var p = clamp(c.hp / c.maxhp * 100, 0, 100); b.style.width = p + '%'; b.style.background = hpColor(p); } }

  function burst(side, color) {
    var mon = $('#mon-' + side); if (!mon || !window.gsap || reduceMotion) return;
    var host = $('#bt-arena'); if (!host) return;
    var r = mon.getBoundingClientRect(), hr = host.getBoundingClientRect();
    var cx = r.left - hr.left + r.width / 2, cy = r.top - hr.top + r.height / 2;
    for (var i = 0; i < 12; i++) {
      var d = el('div', { class: 'bt-particle', style: 'left:' + cx + 'px;top:' + cy + 'px;background:' + color });
      host.append(d);
      gsap.to(d, { x: rnd(-60, 60), y: rnd(-60, 60), opacity: 0, scale: rnd(0.5, 1.8), duration: rnd(0.4, 0.8), ease: 'power2.out', onComplete: function () { try { this.targets()[0].remove(); } catch (e) { } } });
    }
  }
  function floatDmg(side, text, crit) {
    var mon = $('#mon-' + side), host = $('#bt-arena'); if (!mon || !host) return;
    var r = mon.getBoundingClientRect(), hr = host.getBoundingClientRect();
    var d = el('div', { class: 'bt-dmg' + (crit ? ' crit' : '') , style: 'left:' + (r.left - hr.left + r.width / 2) + 'px;top:' + (r.top - hr.top + 20) + 'px' }, text);
    host.append(d);
    if (window.gsap && !reduceMotion) gsap.to(d, { y: -46, opacity: 0, duration: 1, ease: 'power1.out', onComplete: function () { try { d.remove(); } catch (e) { } } });
    else setTimeout(function () { try { d.remove(); } catch (e) { } }, 700);
  }
  async function attackAnim(attackerSide, defenderSide, move, result, defender) {
    var aMon = $('#mon-' + attackerSide), dMon = $('#mon-' + defenderSide);
    var dir = attackerSide === 'me' ? 1 : -1;
    await tween(aMon, { x: 40 * dir, y: -20 * dir, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.in' });
    var color = ['#fbbf24', '#60a5fa', '#f87171', '#34d399', '#a78bfa'][move.name.length % 5];
    burst(defenderSide, color);
    floatDmg(defenderSide, '-' + result.amount + (result.crit ? '!' : ''), result.crit);
    setHp(defenderSide, defender);
    if (window.gsap && !reduceMotion) {
      gsap.fromTo('#mon-' + defenderSide, { x: 0 }, { x: 8, duration: 0.05, repeat: 5, yoyo: true });
      gsap.fromTo('#mon-' + defenderSide, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: 0.4 });
      if (result.crit) { var a = $('#bt-arena'); if (a) gsap.fromTo(a, { x: -6 }, { x: 0, duration: 0.07, repeat: 5, yoyo: true }); }
    }
    await wait(220);
  }

  function startFight(playerCard) {
    var me = mkCombatant(playerCard.dexId, playerCard.tier || (POKE_BY_ID[playerCard.dexId] || {}).t || 1, playerCard.level || 1, playerCard.shiny);
    var foe = wildOpponent(me.level, me.tier);
    var busy = false, over = false;
    spendEnergy(1);
    var msg = el('div', { class: 'bt-msg' }, 'A wild ' + foe.name + ' appeared!');
    var actions = el('div', { class: 'bt-actions' });
    var arena = el('div', { class: 'bt-arena', id: 'bt-arena' },
      el('div', { class: 'bt-floor' }), bar('foe', foe), bar('me', me));
    function renderActions() {
      actions.innerHTML = '';
      me.moves.forEach(function (mv) {
        actions.append(el('button', { class: 'btn bt-move', onclick: function () { playerTurn(mv); } }, mv.name + ' ⚡' + mv.power));
      });
      actions.append(el('button', { class: 'btn', onclick: doHeal }, '🍬 Heal (5)'));
      actions.append(el('button', { class: 'btn ghost', onclick: function () { endBattle(null); } }, 'Run'));
    }
    function setBusy(b) { busy = b; [].forEach.call(actions.querySelectorAll('button'), function (x) { x.disabled = b; }); }
    async function doHeal() {
      if (busy || over) return;
      if (me.hp >= me.maxhp) return toast('Already at full health!');
      if (((await trainerGet()).candy || 0) < 5) return toast('Need 🍬5 candy to heal.');
      setBusy(true);
      await trainerCandyMove(pid(), -5);
      me.hp = clamp(me.hp + Math.round(me.maxhp * 0.5), 0, me.maxhp); setHp('me', me);
      msg.textContent = me.name + ' drank a potion! ❤️'; await wait(300); await foeTurn();
    }
    async function playerTurn(mv) {
      if (busy || over) return; setBusy(true);
      var r = dmg(me, mv); foe.hp = clamp(foe.hp - r.amount, 0, foe.maxhp);
      msg.textContent = me.name + ' used ' + mv.name + '!' + (r.crit ? ' Critical hit!' : '');
      await attackAnim('me', 'foe', mv, r, foe);
      if (foe.hp <= 0) return faint('foe');
      await foeTurn();
    }
    async function foeTurn() {
      var mv = foe.moves[Math.floor(Math.random() * foe.moves.length)];
      var r = dmg(foe, mv); me.hp = clamp(me.hp - r.amount, 0, me.maxhp);
      msg.textContent = 'Wild ' + foe.name + ' used ' + mv.name + '!' + (r.crit ? ' Critical hit!' : '');
      await attackAnim('foe', 'me', mv, r, me);
      if (me.hp <= 0) return faint('me');
      setBusy(false);
    }
    async function faint(side) {
      over = true; setBusy(true);
      await tween('#mon-' + side, { y: 40, opacity: 0, duration: 0.5, ease: 'power1.in' });
      endBattle(side === 'foe' ? 'win' : 'lose', foe);
    }
    renderActions();
    show(el('div', {}, backBar('Battle', function () { if (over || confirm('Leave the battle?')) viewBattle(); }),
      el('div', { class: 'card bt-card' }, arena, msg, actions)));
    setHp('foe', foe); setHp('me', me);
    if (window.gsap && !reduceMotion) { gsap.from('#mon-foe', { x: 60, opacity: 0, duration: 0.4 }); gsap.from('#mon-me', { x: -60, opacity: 0, duration: 0.4 }); }
  }

  async function endBattle(outcome, foe) {
    if (outcome === null) return viewBattle(); // ran away
    var rewardEls = [];
    if (outcome === 'win') {
      var xp = 8 + foe.tier * 4 + foe.level, candy = 3 + foe.tier;
      var t = await trainerGet(); t.xp = (t.xp || 0) + xp; t.candy = (t.candy || 0) + candy;
      var caught = Math.random() < 0.30, dbl = Math.random() < 0.20;
      if (dbl) t.dblPack = true;
      t.updatedAt = Date.now(); await dbPut('trainer', t);
      if (caught) await cardAward({ dexId: foe.dexId, tier: foe.tier, shiny: foe.shiny });
      rewardEls = [el('div', { style: 'font-weight:800;font-size:16px' }, '⭐ +' + xp + ' XP   🍬 +' + candy + ' candy'),
        caught ? el('div', { style: 'color:var(--ok);font-weight:700;margin-top:4px' }, '🎉 You caught ' + foe.name + '!') : '',
        dbl ? el('div', { style: 'color:var(--brand);font-weight:700;margin-top:4px' }, '✨ Bonus: your NEXT practice gives a DOUBLE pack!') : ''];
      if (typeof confettiBurst === 'function') confettiBurst();
    } else {
      var t2 = await trainerGet(); t2.xp = (t2.xp || 0) + 3; await dbPut('trainer', t2);
      rewardEls = [el('div', { style: 'font-weight:700' }, 'Your Pokémon fainted — but you still earned ⭐ +3 XP for trying!')];
    }
    if (typeof scheduleDriveSync === 'function') scheduleDriveSync();
    var energy = await getEnergy();
    show(el('div', {}, backBar('Battle', function () { viewCards(); }),
      el('div', { class: 'card', style: 'text-align:center' },
        el('div', { style: 'font-size:46px' }, outcome === 'win' ? '🏆' : '💪'),
        el('h2', {}, outcome === 'win' ? 'Victory!' : 'Good try!'),
        el('div', { style: 'margin:8px 0' }, rewardEls),
        el('div', { class: 'row', style: 'justify-content:center;margin-top:12px;gap:8px' },
          energy >= 1 ? el('button', { class: 'btn primary', onclick: function () { viewBattle(); } }, '⚔️ Battle again (⚡' + energy + ')') : '',
          el('button', { class: 'btn', onclick: function () { viewCards(); } }, '🎴 My cards')))));
  }

  root.viewBattle = viewBattle;
  root.battleAddEnergy = addEnergy;     // called from submitSession
  root.BATTLE_MAX_ENERGY = MAX_ENERGY;
})(typeof window !== 'undefined' ? window : globalThis);
