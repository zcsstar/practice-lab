/* ============================================================================
 * Practice Lab — Poké battle (vs PC)
 * ----------------------------------------------------------------------------
 * A flashy 2D turn-based battle that's GATED BEHIND PRACTICE: you earn ⚡ energy
 * by practising and spend 1 per battle, so the game stays a reward for learning.
 *
 * Real-battle depth (tuned for ~13-15 y/o): every Pokémon has HP/Attack/Defense/
 * Speed and a 3-move kit — a same-type (STAB) attack, a risky big hit ("Take
 * Down", 75% accuracy), and a status move (buff self / debuff foe / heal). Combat
 * adds: SPEED decides who strikes first (with upset chances), attacks can MISS or
 * be DODGED (faster = harder to hit), DEFENSE soaks damage (higher level = tankier),
 * real TYPE effectiveness (super-effective ×1.6 / resisted / immune) + STAB ×1.5,
 * critical hits, and BURN 🔥 / PARALYSIS ⚡ status. The wild foe uses a light AI
 * (picks its best-matchup move, heals when low, goes for the kill). Animated with
 * GSAP. Rewards loop back to practice (XP, candy, a chance to catch the wild card,
 * an occasional "double next pack" buff).
 *
 * Classic script (no modules) so file:// + GitHub Pages both work. Relies on
 * globals from index.html (el, show, $, toast, gsap, reduceMotion, POKEDEX,
 * POKE_BY_ID, RARITY, pokeSprite, cardStats, cardMoves, pokeTypes, typeMult,
 * TYPE_COLOR, typeChip, cardsForProfile, trainerGet, trainerCandyMove, dbPut,
 * pid, cardAward, backBar, confettiBurst, viewCards). All referenced at call-time.
 * ========================================================================== */
(function (root) {
  'use strict';
  var MAX_ENERGY = 12;
  var BEAT = 560; // ms a battle message stays up so it's readable

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function tween(target, vars) {
    return new Promise(function (res) {
      if (!window.gsap || reduceMotion || !target) return res();
      gsap.to(target, Object.assign({}, vars, { onComplete: res }));
    });
  }

  // ---- stat helpers (stat stages like Pokémon: each step ≈ ±25%, capped) ----
  function stageMul(s) { return clamp(1 + 0.25 * (s || 0), 0.25, 2); }
  function effAtk(c) { return c.atk * stageMul(c.stage.atk) * (c.status === 'burn' ? 0.75 : 1); }
  function effDef(c) { return c.def * stageMul(c.stage.def); }
  function effSpd(c) { return c.spd * stageMul(c.stage.spd) * (c.status === 'para' ? 0.5 : 1); }
  // Soften the raw type chart for battle feel: 2×→1.6, 4×→2.0, 0.5×→0.62, 0.25×→0.45, 0 stays 0.
  function dmgTypeMult(m) { return m === 0 ? 0 : m >= 4 ? 2.0 : m >= 2 ? 1.6 : m <= 0.25 ? 0.45 : m < 1 ? 0.62 : 1; }

  function mkCombatant(dexId, tier, level, shiny) {
    var st = cardStats(tier, level), p = POKE_BY_ID[dexId];
    return { dexId: dexId, tier: tier, level: level || 1, shiny: !!shiny,
      name: (p ? p.name : 'Pokémon'),
      types: (typeof pokeTypes === 'function' ? pokeTypes(dexId) : ['normal']),
      hp: st.hp, maxhp: st.hp, atk: st.atk, def: st.def, spd: st.spd,
      moves: cardMoves(dexId, tier, level || 1),
      stage: { atk: 0, def: 0, acc: 0, spd: 0 }, status: null };
  }
  // Wild RARITY: usually your tier, sometimes lower, rarely one above.
  function wildTier(playerTier) {
    var pt = clamp(playerTier || 1, 1, 5), w = [0, 0, 0, 0, 0, 0], t, tot = 0;
    for (t = 1; t <= 5; t++) w[t] = (t < pt ? 22 : t === pt ? 50 : t === pt + 1 ? 12 : 0);
    for (t = 1; t <= 5; t++) tot += w[t];
    var r = Math.random() * tot;
    for (t = 1; t <= 5; t++) { if (r < w[t]) return t; r -= w[t]; }
    return pt;
  }
  // Wild opponent: same-ish rarity, never higher level, slightly weaker so the hero has an edge.
  function wildOpponent(playerLevel, playerTier) {
    var t = wildTier(playerTier);
    var pool = POKEDEX.filter(function (p) { return p.t === t; });
    var p = pool[Math.floor(Math.random() * pool.length)];
    var lvl = clamp(Math.round(playerLevel + rnd(-2, 0)), 1, 25);
    var c = mkCombatant(p.id, p.t, lvl, Math.random() < 0.03);
    c.hp = c.maxhp = Math.round(c.maxhp * 0.9);
    c.atk = Math.max(1, Math.round(c.atk * 0.9));
    c.def = Math.max(1, Math.round(c.def * 0.9));
    return c;
  }

  // Resolve one attack: returns {hit, dodged} or {hit, amount, crit, fx, statusApplied}.
  function resolveAttack(attacker, defender, move) {
    var dodge = clamp(0.04 + (effSpd(defender) / Math.max(1, effSpd(attacker)) - 1) * 0.12, 0, 0.32);
    var hitChance = (move.acc / 100) * stageMul(attacker.stage.acc) * (1 - dodge);
    if (Math.random() > hitChance) return { hit: false, dodged: effSpd(defender) > effSpd(attacker) * 1.15 };
    var tm = typeMult(move.type, defender.types), dm = dmgTypeMult(tm);
    if (dm === 0) return { hit: true, amount: 0, crit: false, fx: 0 };
    var stab = attacker.types.indexOf(move.type) >= 0 ? 1.5 : 1;
    var crit = Math.random() < (move.crit || 0.08);
    var raw = move.power + effAtk(attacker) * 0.5;
    var mit = raw * 50 / (50 + effDef(defender));
    var amount = Math.max(1, Math.round(mit * rnd(0.85, 1.12) * dm * stab * (crit ? 1.6 : 1)));
    var statusApplied = (move.status && !defender.status && Math.random() < (move.statusChance || 0)) ? move.status : null;
    return { hit: true, amount: amount, crit: crit, fx: tm, statusApplied: statusApplied };
  }

  // Wild-foe AI: best-matchup move, heal when low, finisher when you're low, some variety.
  function aiChoose(foe, player) {
    var atks = foe.moves.filter(function (m) { return m.kind === 'attack'; });
    function score(m) { return m.power * dmgTypeMult(typeMult(m.type, player.types)) * (m.acc / 100); }
    var best = atks.slice().sort(function (a, b) { return score(b) - score(a); })[0];
    var heal = foe.moves.filter(function (m) { return m.kind === 'heal'; })[0];
    var util = foe.moves.filter(function (m) { return m.kind === 'buff' || m.kind === 'debuff'; })[0];
    if (foe.hp < foe.maxhp * 0.30 && heal && Math.random() < 0.55) return heal;
    if (player.hp < player.maxhp * 0.35) return best;
    var r = Math.random();
    if (r < 0.62) return best;
    if (r < 0.80 && util) return util;
    return atks[Math.floor(Math.random() * atks.length)] || best;
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
        el('div', { class: 'dn' }, p.name),
        el('div', { class: 'bt-types', style: 'margin:2px 0' }, ...pokeTypes(c.dexId).map(typeChip)),
        el('div', { class: 'lv' }, 'Lv ' + (c.level || 1)),
        el('div', { class: 'ds', style: 'color:var(--muted)' }, '❤️' + st.hp + ' ⚔️' + st.atk + ' 🛡️' + st.def + ' 💨' + st.spd)));
    });
    show(el('div', {}, backBar('Battle', function () { viewCards(); }),
      el('div', { class: 'card', style: 'background:var(--feature);border-color:#cfe2ff' },
        el('div', { class: 'row between' }, el('h2', { style: 'margin:0' }, '⚔️ Battle a wild Pokémon'), el('span', { style: 'font-weight:800' }, '⚡ ' + energy + ' energy')),
        el('p', { class: 'sub', style: 'margin:6px 0 0' }, energy >= 1 ? 'Pick a Pokémon to battle with. Costs ⚡1 energy — you earn energy by doing practices! Tip: use a move your foe is WEAK to for super-effective damage.' : 'You’re out of ⚡ energy. Do a practice to earn more, then come back!')),
      energy >= 1 ? el('div', { class: 'card' }, el('h2', {}, 'Choose your Pokémon'), grid)
        : el('div', { class: 'card' }, el('div', { class: 'empty' }, el('div', { class: 'big' }, '⚡'), el('div', {}, 'No energy left. One practice = at least 1 energy.')))));
  }

  // ---- the fight ----
  function bar(side, c) {
    return el('div', { class: 'bt-side bt-' + side },
      el('div', { class: 'bt-info' },
        el('div', { class: 'bt-name' }, c.name + '  Lv' + c.level, el('span', { class: 'bt-badge', id: 'badge-' + side, style: 'display:none' })),
        el('div', { class: 'bt-types' }, ...c.types.map(typeChip)),
        el('div', { class: 'bt-hpwrap' }, el('div', { class: 'bt-hp', id: 'hp-' + side }))),
      el('div', { class: 'bt-mon', id: 'mon-' + side }, pokeImg(c.dexId, c.shiny, side === 'foe' ? 130 : 150)));
  }
  function hpColor(p) { return p > 50 ? '#34c759' : p > 20 ? '#ff9500' : '#ff3b30'; }
  function setHp(side, c) { var b = $('#hp-' + side); if (b) { var p = clamp(c.hp / c.maxhp * 100, 0, 100); b.style.width = p + '%'; b.style.background = hpColor(p); } }
  function setBadge(side, c) {
    var b = $('#badge-' + side); if (!b) return;
    if (c.status === 'burn') { b.style.display = ''; b.className = 'bt-badge burn'; b.textContent = '🔥 BRN'; }
    else if (c.status === 'para') { b.style.display = ''; b.className = 'bt-badge para'; b.textContent = '⚡ PAR'; }
    else { b.style.display = 'none'; b.textContent = ''; }
  }

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
  function floatText(side, text, cls) {
    var mon = $('#mon-' + side), host = $('#bt-arena'); if (!mon || !host) return;
    var r = mon.getBoundingClientRect(), hr = host.getBoundingClientRect();
    var d = el('div', { class: cls, style: 'left:' + (r.left - hr.left + r.width / 2) + 'px;top:' + (r.top - hr.top + 20) + 'px' }, text);
    host.append(d);
    if (window.gsap && !reduceMotion) gsap.to(d, { y: -46, opacity: 0, duration: 1, ease: 'power1.out', onComplete: function () { try { d.remove(); } catch (e) { } } });
    else setTimeout(function () { try { d.remove(); } catch (e) { } }, 700);
  }
  function floatDmg(side, text, crit) { floatText(side, text, 'bt-dmg' + (crit ? ' crit' : '')); }
  function fxText(side, text, kind) {
    var mon = $('#mon-' + side), host = $('#bt-arena'); if (!mon || !host) return;
    var r = mon.getBoundingClientRect(), hr = host.getBoundingClientRect();
    var d = el('div', { class: 'bt-fx ' + kind, style: 'left:' + (r.left - hr.left + r.width / 2) + 'px;top:' + (r.top - hr.top - 6) + 'px' }, text);
    host.append(d);
    if (window.gsap && !reduceMotion) gsap.to(d, { y: -30, opacity: 0, duration: 1.1, ease: 'power1.out', onComplete: function () { try { d.remove(); } catch (e) { } } });
    else setTimeout(function () { try { d.remove(); } catch (e) { } }, 800);
  }
  function flashMon(side) { if (window.gsap && !reduceMotion) { var m = $('#mon-' + side); if (m) gsap.fromTo(m, { filter: 'brightness(1.9)' }, { filter: 'brightness(1)', duration: 0.4 }); } }
  function sidestep(side) { if (window.gsap && !reduceMotion) { var dir = side === 'me' ? -1 : 1; gsap.fromTo('#mon-' + side, { x: 0 }, { x: 26 * dir, duration: 0.12, yoyo: true, repeat: 1 }); } }

  async function attackAnim(side, dSide, move, res) {
    var aMon = $('#mon-' + side), dir = side === 'me' ? 1 : -1;
    await tween(aMon, { x: 40 * dir, y: -20 * dir, duration: 0.13, yoyo: true, repeat: 1, ease: 'power2.in' });
    burst(dSide, TYPE_COLOR[move.type] || '#fbbf24');
    floatDmg(dSide, '-' + res.amount + (res.crit ? '!' : ''), res.crit);
    if (window.gsap && !reduceMotion) {
      gsap.fromTo('#mon-' + dSide, { x: 0 }, { x: 8, duration: 0.05, repeat: 5, yoyo: true });
      gsap.fromTo('#mon-' + dSide, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: 0.4 });
      if (res.crit) { var a = $('#bt-arena'); if (a) gsap.fromTo(a, { x: -6 }, { x: 0, duration: 0.07, repeat: 5, yoyo: true }); }
    }
    await wait(180);
  }

  function startFight(playerCard) {
    var me = mkCombatant(playerCard.dexId, playerCard.tier || (POKE_BY_ID[playerCard.dexId] || {}).t || 1, playerCard.level || 1, playerCard.shiny);
    var foe = wildOpponent(me.level, me.tier);
    var busy = false, over = false;
    spendEnergy(1);
    var msg = el('div', { class: 'bt-msg' }, 'A wild ' + foe.name + ' appeared!');
    var actions = el('div', { class: 'bt-actions' });
    var arena = el('div', { class: 'bt-arena', id: 'bt-arena' }, el('div', { class: 'bt-floor' }), bar('foe', foe), bar('me', me));

    function say(t) { msg.textContent = t; return wait(BEAT); }
    function setBusy(b) { busy = b; [].forEach.call(actions.querySelectorAll('button'), function (x) { x.disabled = b; }); }
    function nameOf(side, c) { return side === 'me' ? c.name : ('Wild ' + c.name); }

    function renderActions() {
      actions.innerHTML = '';
      me.moves.forEach(function (mv) {
        if (mv.kind === 'attack') {
          actions.append(el('button', { class: 'btn bt-move', onclick: function () { chooseMove(mv); } },
            el('span', { class: 'mvname' }, mv.name), typeChip(mv.type),
            el('span', { class: 'mvsub' }, '⚡' + mv.power + ' · ' + mv.acc + '% acc' + (mv.crit >= 0.15 ? ' · 🎯crit' : '') + (mv.status ? (' · ' + (mv.status === 'burn' ? '🔥' : '⚡')) : ''))));
        } else {
          actions.append(el('button', { class: 'btn bt-move util', onclick: function () { chooseMove(mv); } },
            el('span', { class: 'mvname' }, mv.emoji + ' ' + mv.name),
            el('span', { class: 'mvsub' }, mv.msg)));
        }
      });
      actions.append(el('button', { class: 'btn', onclick: doHeal }, '🍬 Potion (5)'));
      actions.append(el('button', { class: 'btn ghost', onclick: function () { endBattle(null); } }, 'Run'));
    }

    async function doHeal() {
      if (busy || over) return;
      if (me.hp >= me.maxhp) return toast('Already at full health!');
      if (((await trainerGet()).candy || 0) < 5) return toast('Need 🍬5 candy for a Potion.');
      setBusy(true);
      await trainerCandyMove(pid(), -5);
      resolveRound({ kind: 'potion', name: 'Potion' });
    }
    function chooseMove(mv) { if (busy || over) return; setBusy(true); resolveRound(mv); }

    // One round: foe picks its move, then both act in SPEED order (with upset chance).
    async function resolveRound(playerMove) {
      if (over) return;
      var foeMove = aiChoose(foe, me);
      var meAct = { atk: me, def: foe, mv: playerMove, side: 'me' };
      var foeAct = { atk: foe, def: me, mv: foeMove, side: 'foe' };
      var sMe = effSpd(me), sFoe = effSpd(foe), meFirst;
      if (Math.random() < 0.15) meFirst = sMe < sFoe;        // upset: the slower one gets the jump
      else if (sMe === sFoe) meFirst = Math.random() < 0.5;
      else meFirst = sMe > sFoe;
      var order = meFirst ? [meAct, foeAct] : [foeAct, meAct];
      for (var i = 0; i < order.length; i++) {
        if (over) break;
        if (order[i].atk.hp <= 0) continue;
        await performAction(order[i]);
      }
      if (!over) await endOfTurn();
      if (!over) setBusy(false);
    }

    async function performAction(act) {
      var attacker = act.atk, defender = act.def, mv = act.mv, side = act.side, dSide = side === 'me' ? 'foe' : 'me';
      var who = nameOf(side, attacker);
      if (attacker.status === 'para' && Math.random() < 0.25) { flashMon(side); await say(who + ' is paralysed! It can’t move ⚡'); return; }
      if (mv.kind === 'potion') {
        var h = Math.round(attacker.maxhp * 0.5); attacker.hp = clamp(attacker.hp + h, 0, attacker.maxhp); setHp(side, attacker);
        floatText(side, '+' + h, 'bt-dmg heal'); flashMon(side); await say(who + ' drank a Potion! ❤️'); return;
      }
      if (mv.kind === 'heal') {
        var hh = Math.round(attacker.maxhp * mv.amount); attacker.hp = clamp(attacker.hp + hh, 0, attacker.maxhp); setHp(side, attacker);
        floatText(side, '+' + hh, 'bt-dmg heal'); flashMon(side); await say(who + ' used ' + mv.name + ' — ' + mv.msg); return;
      }
      if (mv.kind === 'buff' || mv.kind === 'debuff') {
        var tgt = mv.kind === 'buff' ? attacker : defender, tSide = mv.kind === 'buff' ? side : dSide;
        tgt.stage[mv.stat] = clamp((tgt.stage[mv.stat] || 0) + mv.stage, -4, 4);
        floatText(tSide, mv.stage > 0 ? '▲' : '▼', 'bt-dmg buff'); flashMon(tSide);
        await say(who + ' used ' + mv.name + ' — ' + mv.msg); return;
      }
      // attack
      var res = resolveAttack(attacker, defender, mv);
      if (!res.hit) { await say(who + ' used ' + mv.name + '…'); sidestep(dSide); floatText(dSide, res.dodged ? 'Dodge!' : 'Miss!', 'bt-dmg miss'); await say(res.dodged ? (defender.name + ' dodged it!') : 'But it missed!'); return; }
      await say(who + ' used ' + mv.name + '!' + (res.crit ? ' 💥 Critical hit!' : ''));
      if (res.fx === 0) { sidestep(dSide); fxText(dSide, 'No effect!', 'immune'); await say('It doesn’t affect ' + defender.name + '…'); return; }
      await attackAnim(side, dSide, mv, res);
      defender.hp = clamp(defender.hp - res.amount, 0, defender.maxhp); setHp(dSide, defender);
      if (res.fx >= 2) fxText(dSide, 'Super effective!', 'super');
      else if (res.fx < 1) fxText(dSide, 'Not very effective…', 'resist');
      if (defender.hp <= 0) return faint(dSide);
      if (res.fx !== 1) await wait(360);
      if (res.statusApplied) { defender.status = res.statusApplied; setBadge(dSide, defender); flashMon(dSide); await say(defender.name + (res.statusApplied === 'burn' ? ' was burned! 🔥' : ' was paralysed! ⚡')); }
    }

    // End of round: burn chips both sides.
    async function endOfTurn() {
      var sides = [['me', me], ['foe', foe]];
      for (var i = 0; i < sides.length; i++) {
        if (over) break;
        var side = sides[i][0], c = sides[i][1];
        if (c.hp > 0 && c.status === 'burn') {
          var chip = Math.max(1, Math.round(c.maxhp * 0.0625));
          c.hp = clamp(c.hp - chip, 0, c.maxhp); setHp(side, c);
          floatDmg(side, '-' + chip, false); flashMon(side);
          await say(nameOf(side, c) + ' is hurt by its burn! 🔥');
          if (c.hp <= 0) return faint(side);
        }
      }
    }

    async function faint(side) {
      over = true; setBusy(true); setBadge(side, side === 'me' ? me : foe);
      await tween('#mon-' + side, { y: 40, opacity: 0, duration: 0.5, ease: 'power1.in' });
      endBattle(side === 'foe' ? 'win' : 'lose', foe);
    }

    renderActions();
    show(el('div', {}, backBar('Battle', function () { if (over || confirm('Leave the battle?')) viewBattle(); }),
      el('div', { class: 'card bt-card' }, arena, msg, actions)));
    setHp('foe', foe); setHp('me', me); setBadge('foe', foe); setBadge('me', me);
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
