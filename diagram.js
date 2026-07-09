/* ============================================================================
 * Practice Lab — structured diagram renderer
 * ----------------------------------------------------------------------------
 * Models are unreliable at hand-drawing SVG geometry (pie arcs especially). So
 * instead the model emits a small STRUCTURED spec ({type, ...}) and THIS module
 * draws correct, consistent, kid-friendly SVG from it. Covers the diagram types
 * that make up almost all primary→intermediate (Y3–Y8) maths exams:
 *   pie · bar · numberline · fractionbar · shape · clock · pictogram · array ·
 *   coordinate · angle · lineplot · venn · tally · routemap · table · scale ·
 *   balance · timeline · flow (process / food-chain)
 *
 * PLDiagram.render(spec) -> a clean <svg>…</svg> string, or '' if the spec is
 * unknown/invalid (caller then falls back to a raw `svg` field). Pure: no DOM,
 * no state — so it runs on file:// + GitHub Pages and is unit-testable in Node.
 * Output is safe (no script/foreignObject/external refs) and still passes the
 * app's sanitizeSvg().
 * ========================================================================== */
(function (root) {
  'use strict';

  var PAL = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#cc5de8', '#ff922b', '#20c997', '#f783ac', '#a0aec0', '#63e6be'];
  var INK = '#1d1d1f', MUTE = '#86868b', LINE = '#e4e4ea';
  function col(i, g) { return g || PAL[i % PAL.length]; }
  function n(v, d) { v = +v; return isFinite(v) ? v : (d || 0); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(v) { v = +v; if (!isFinite(v)) return ''; return Math.abs(v - Math.round(v)) < 1e-9 ? ('' + Math.round(v)) : ('' + (Math.round(v * 100) / 100)); }
  function f1(v) { return (Math.round(v * 10) / 10); }
  // greedy word-wrap into <= maxc-char lines (for box/timeline labels)
  function wrapWords(str, maxc) {
    var words = String(str == null ? '' : str).split(/\s+/), lines = [], cur = '';
    maxc = Math.max(4, maxc || 12);
    words.forEach(function (wd) {
      if (!cur) cur = wd;
      else if ((cur + ' ' + wd).length <= maxc) cur += ' ' + wd;
      else { lines.push(cur); cur = wd; }
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }
  // text helper
  function T(x, y, s, o) {
    o = o || {};
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-size="' + (o.size || 13) + '" fill="' + (o.fill || INK) + '" text-anchor="' + (o.anchor || 'middle') + '"'
      + (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.baseline ? ' dominant-baseline="' + o.baseline + '"' : '') + '>' + esc(s) + '</text>';
  }
  function line(x1, y1, x2, y2, o) { o = o || {}; return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 1) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.cap ? ' stroke-linecap="' + o.cap + '"' : '') + '/>'; }
  function poly(pts, o) { o = o || {}; return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 2) + '"/>'; }
  // wrap content (built for w×h) into an svg, with an optional centred title row on top
  function wrap(w, h, inner, title) {
    var th = title ? 24 : 0;
    var body = title
      ? '<text x="' + (w / 2) + '" y="16" font-size="13" font-weight="700" text-anchor="middle" fill="' + INK + '">' + esc(title) + '</text><g transform="translate(0,' + th + ')">' + inner + '</g>'
      : inner;
    // Explicit width/height give the SVG an intrinsic size so it never collapses to
    // 0×0 inside a flex container (e.g. the results screen); CSS max-width:100% scales it down.
    return '<svg width="' + w + '" height="' + (h + th) + '" viewBox="0 0 ' + w + ' ' + (h + th) + '" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;font-family:-apple-system,system-ui,sans-serif">' + body + '</svg>';
  }

  function pie(s) {
    var parts = (s.parts || s.slices || s.data || []).map(function (p, i) { return typeof p === 'object' ? { label: p.label, value: n(p.value != null ? p.value : p.count), color: p.color } : { value: n(p) }; }).filter(function (p) { return p.value >= 0; });
    if (!parts.length) return '';
    var total = parts.reduce(function (a, p) { return a + p.value; }, 0); if (total <= 0) return '';
    var cx = 110, cy = 102, r = 88, ang = -90, inner = '';
    parts.forEach(function (p, i) {
      var frac = p.value / total, a0 = ang, a1 = ang + frac * 360; ang = a1; var c = col(i, p.color);
      if (frac >= 0.9999) inner += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
      else {
        var lg = (a1 - a0) > 180 ? 1 : 0;
        var x0 = cx + r * Math.cos(a0 * Math.PI / 180), y0 = cy + r * Math.sin(a0 * Math.PI / 180);
        var x1 = cx + r * Math.cos(a1 * Math.PI / 180), y1 = cy + r * Math.sin(a1 * Math.PI / 180);
        inner += '<path d="M' + cx + ',' + cy + ' L' + f1(x0) + ',' + f1(y0) + ' A' + r + ',' + r + ' 0 ' + lg + ' 1 ' + f1(x1) + ',' + f1(y1) + ' Z" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
      }
      var mid = (a0 + a1) / 2, lr = r * 0.62, lx = cx + lr * Math.cos(mid * Math.PI / 180), ly = cy + lr * Math.sin(mid * Math.PI / 180);
      var on = s.showPercent ? Math.round(frac * 100) + '%' : (p.label != null && s.labelOnSlice ? p.label : '');
      if (on !== '' && frac > 0.06) inner += T(lx, ly, on, { fill: '#fff', weight: '700', baseline: 'middle' });
    });
    var h = cy + r + 8;
    if (s.legend !== false) { var ly0 = cy + r + 24; parts.forEach(function (p, i) { var y = ly0 + i * 18; inner += '<rect x="16" y="' + (y - 10) + '" width="12" height="12" rx="2" fill="' + col(i, p.color) + '"/>' + T(34, y, (p.label != null ? p.label : 'Part ' + (i + 1)) + ' (' + fmt(p.value) + ')', { anchor: 'start', size: 12, baseline: 'middle' }); }); h = ly0 + parts.length * 18; }
    return wrap(220, h, inner, s.title);
  }

  function bar(s) {
    var bars = (s.bars || s.data || s.categories || []).map(function (b, i) { return typeof b === 'object' ? { label: b.label != null ? b.label : ('' + (i + 1)), value: n(b.value != null ? b.value : b.count), color: b.color } : { label: '' + (i + 1), value: n(b) }; });
    if (!bars.length) return '';
    var w = Math.max(230, bars.length * 56 + 44), h = 196, padL = 32, padB = 32, padT = 8, gw = w - padL - 12, gh = h - padB - padT;
    var max = s.max != null ? n(s.max) : Math.max.apply(null, bars.map(function (b) { return b.value; })); if (!(max > 0)) max = 1;
    var inner = '', ticks = 4, t;
    for (t = 0; t <= ticks; t++) { var val = max * t / ticks, y = padT + gh - gh * t / ticks; inner += line(padL, y, w - 12, y, { stroke: LINE }) + T(padL - 5, y + 4, fmt(val), { anchor: 'end', size: 10, fill: MUTE }); }
    var gap = gw / bars.length, bw = gap * 0.6;
    bars.forEach(function (b, i) { var bh = gh * (b.value / max), x = padL + gap * i + (gap - bw) / 2, y = padT + gh - bh; inner += '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(bw) + '" height="' + f1(Math.max(0, bh)) + '" rx="3" fill="' + col(i, b.color) + '"/>' + T(x + bw / 2, y - 4, fmt(b.value), { size: 11, weight: '700' }) + T(x + bw / 2, h - padB + 14, b.label, { size: 11 }); });
    inner += line(padL, padT + gh, w - 12, padT + gh, { stroke: INK, w: 1.5 });
    return wrap(w, h, inner, s.title);
  }

  function numberline(s) {
    var min = n(s.min, 0), max = n(s.max, 10), step = n(s.step, 1); if (max <= min) max = min + 1; if (step <= 0) step = (max - min) / 5;
    var w = 320, h = 64, padL = 22, padR = 22, y = 40, gw = w - padL - padR;
    function X(v) { return padL + (v - min) / (max - min) * gw; }
    var inner = line(padL, y, w - padR, y, { stroke: INK, w: 2 });
    inner += '<path d="M' + padL + ',' + y + ' l8,-4 v8 z" fill="' + INK + '"/><path d="M' + (w - padR) + ',' + y + ' l-8,-4 v8 z" fill="' + INK + '"/>';
    for (var v = min; v <= max + 1e-9; v += step) { var x = X(v); inner += line(x, y - 6, x, y + 6, { stroke: INK }) + T(x, y + 20, s.fractionLabels ? (fmt(v)) : fmt(v), { size: 11 }); }
    if (s.segment) { var a = X(n(s.segment.from)), b = X(n(s.segment.to)); inner += line(a, y - 16, b, y - 16, { stroke: '#ff6b6b', w: 3 }); }
    (s.points || []).forEach(function (p, i) { var v = n(typeof p === 'object' ? p.value : p), x = X(v), c = col(i, p && p.color); inner += '<circle cx="' + f1(x) + '" cy="' + y + '" r="6" fill="' + c + '"/>' + (p && p.label != null ? T(x, y - 12, p.label, { size: 11, weight: '700', fill: c }) : ''); });
    return wrap(w, h, inner, s.title);
  }

  function fractionbar(s) {
    var rows = s.rows || [{ parts: n(s.parts, 1), shaded: n(s.shaded, 0), label: s.label, color: s.color }];
    var w = 300, rowH = 42, padT = 6, bw = 224, padL = 10, h = padT + rows.length * rowH, inner = '';
    rows.forEach(function (r, ri) {
      var parts = Math.max(1, Math.round(n(r.parts, 1))), shaded = Math.max(0, Math.min(parts, Math.round(n(r.shaded, 0))));
      var y = padT + ri * rowH, ph = 30, pw = bw / parts, c = col(ri, r.color), i;
      for (i = 0; i < parts; i++) { var x = padL + i * pw; inner += '<rect x="' + f1(x) + '" y="' + y + '" width="' + f1(pw) + '" height="' + ph + '" fill="' + (i < shaded ? c : '#fff') + '" stroke="' + INK + '"/>'; }
      if (r.label != null) inner += T(padL + bw + 8, y + ph / 2, r.label, { anchor: 'start', size: 13, weight: '700', baseline: 'middle' });
    });
    return wrap(w, h, inner, s.title);
  }

  function shape(s) {
    var k = String(s.kind || s.shape || 'rectangle').toLowerCase().replace(/[\s_-]/g, ''), w = 240, h = 178, inner = '';
    var fill = s.shaded ? (s.color || '#cfe2ff') : 'none', L = s.labels || {};
    if (k === 'circle') {
      var cx = 120, cy = 86, r = 66; inner += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="2"/>';
      if (L.radius != null) inner += line(cx, cy, cx + r, cy, { stroke: INK }) + T(cx + r / 2, cy - 6, L.radius, { size: 12 });
      else if (L.diameter != null) inner += line(cx - r, cy, cx + r, cy, { stroke: INK }) + T(cx, cy - 6, L.diameter, { size: 12 });
      if (s.label) inner += T(cx, cy + 4, s.label, { size: 12, baseline: 'middle' });
    } else if (k === 'rectangle' || k === 'square') {
      var rw = k === 'square' ? 130 : 168, rh = k === 'square' ? 130 : 108, x = (w - rw) / 2, y = (h - rh) / 2;
      inner += '<rect x="' + x + '" y="' + y + '" width="' + rw + '" height="' + rh + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="2"/>';
      var top = L.width != null ? L.width : L.top, lft = L.height != null ? L.height : L.left;
      if (top != null) inner += T(x + rw / 2, y - 7, top, { size: 12 });
      if (L.bottom != null) inner += T(x + rw / 2, y + rh + 16, L.bottom, { size: 12 });
      if (lft != null) inner += T(x - 8, y + rh / 2, lft, { anchor: 'end', size: 12, baseline: 'middle' });
      if (L.right != null) inner += T(x + rw + 8, y + rh / 2, L.right, { anchor: 'start', size: 12, baseline: 'middle' });
      if (s.rightAngle !== false) inner += '<path d="M' + (x + 13) + ',' + y + ' v13 h-13" fill="none" stroke="' + INK + '"/>';
    } else if (k === 'righttriangle') {
      var ox = 52, oy = 142, tb = 138, tht = 112, p = [[ox, oy], [ox + tb, oy], [ox, oy - tht]];
      inner += poly(p, { fill: fill }) + '<path d="M' + (ox + 13) + ',' + oy + ' v-13 h-13" fill="none" stroke="' + INK + '"/>';
      if (L.base != null) inner += T(ox + tb / 2, oy + 16, L.base, { size: 12 });
      if (L.height != null) inner += T(ox - 8, oy - tht / 2, L.height, { anchor: 'end', size: 12, baseline: 'middle' });
      if (L.hyp != null || L.hypotenuse != null) inner += T(ox + tb / 2 + 8, oy - tht / 2 - 2, L.hyp != null ? L.hyp : L.hypotenuse, { anchor: 'start', size: 12 });
    } else if (k === 'triangle') {
      var ap = s.apex != null ? n(s.apex) : 120, p2 = [[40, 150], [200, 150], [ap, 42]];
      inner += poly(p2, { fill: fill });
      if (L.base != null) inner += T(120, 166, L.base, { size: 12 });
      if (L.left != null) inner += T((40 + ap) / 2 - 10, (150 + 42) / 2, L.left, { anchor: 'end', size: 12 });
      if (L.right != null) inner += T((200 + ap) / 2 + 10, (150 + 42) / 2, L.right, { anchor: 'start', size: 12 });
      if (L.height != null) inner += line(ap, 150, ap, 42, { stroke: INK, dash: '4 3' }) + T(ap + 6, 96, L.height, { anchor: 'start', size: 12 });
    } else if (k === 'parallelogram') {
      var p3 = [[58, 140], [200, 140], [172, 52], [30, 52]]; inner += poly(p3, { fill: fill });
      if (L.base != null) inner += T(129, 156, L.base, { size: 12 });
      if (L.side != null) inner += T(40, 100, L.side, { anchor: 'end', size: 12 });
      if (L.height != null) inner += line(58, 140, 58, 52, { stroke: INK, dash: '4 3' }) + T(64, 100, L.height, { anchor: 'start', size: 12 });
    } else if (k === 'trapezoid' || k === 'trapezium') {
      var p4 = [[36, 140], [204, 140], [162, 56], [78, 56]]; inner += poly(p4, { fill: fill });
      if (L.bottom != null || L.base != null) inner += T(120, 156, L.bottom != null ? L.bottom : L.base, { size: 12 });
      if (L.top != null) inner += T(120, 49, L.top, { size: 12 });
      if (L.height != null) inner += line(78, 140, 78, 56, { stroke: INK, dash: '4 3' }) + T(84, 100, L.height, { anchor: 'start', size: 12 });
    } else if (k === 'polygon') {
      var sides = Math.max(3, Math.round(n(s.sides, 5))), cx2 = 120, cy2 = 90, r2 = 70, pts = [], i2;
      for (i2 = 0; i2 < sides; i2++) { var a2 = -90 + i2 * 360 / sides; pts.push([cx2 + r2 * Math.cos(a2 * Math.PI / 180), cy2 + r2 * Math.sin(a2 * Math.PI / 180)]); }
      inner += poly(pts, { fill: fill }); if (s.label) inner += T(cx2, cy2 + 4, s.label, { baseline: 'middle', size: 12 });
    } else return '';
    return wrap(w, h, inner, s.title);
  }

  function clock(s) {
    var H = n(s.h != null ? s.h : s.hour, 12) % 12, M = n(s.m != null ? s.m : s.minute, 0) % 60;
    var cx = 90, cy = 90, r = 78, inner = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" stroke="' + INK + '" stroke-width="3"/>', i;
    for (i = 1; i <= 12; i++) { var a = i * 30 * Math.PI / 180, nx = cx + (r - 15) * Math.sin(a), ny = cy - (r - 15) * Math.cos(a); inner += T(nx, ny + 4, '' + i, { size: 13, weight: '700' }); }
    for (i = 0; i < 60; i++) { if (i % 5) { var aa = i * 6 * Math.PI / 180; inner += line(cx + (r - 3) * Math.sin(aa), cy - (r - 3) * Math.cos(aa), cx + r * Math.sin(aa), cy - r * Math.cos(aa), { stroke: MUTE }); } }
    var ha = (H * 30 + M * 0.5) * Math.PI / 180, ma = M * 6 * Math.PI / 180;
    inner += line(cx, cy, cx + r * 0.5 * Math.sin(ha), cy - r * 0.5 * Math.cos(ha), { stroke: INK, w: 5, cap: 'round' });
    inner += line(cx, cy, cx + r * 0.78 * Math.sin(ma), cy - r * 0.78 * Math.cos(ma), { stroke: '#ff6b6b', w: 3, cap: 'round' });
    inner += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + INK + '"/>';
    return wrap(180, 180, inner, s.title);
  }

  function pictogram(s) {
    var rows = s.rows || s.data || s.categories || []; if (!rows.length) return '';
    var icon = s.icon || '⭐', per = n(s.per, 1) || 1, w = 300, rh = 32, padT = 6, h = padT + rows.length * rh + (per > 1 ? 22 : 4), inner = '';
    rows.forEach(function (r, i) {
      var label = r.label != null ? r.label : ('Row ' + (i + 1)), val = n(r.value != null ? r.value : r.count), cnt = Math.round(val / per), y = padT + i * rh + rh / 2, j;
      inner += T(8, y + 4, label, { anchor: 'start', size: 12 });
      for (j = 0; j < cnt; j++) inner += '<text x="' + (104 + j * 22) + '" y="' + (y + 7) + '" font-size="18">' + esc(icon) + '</text>';
    });
    if (per > 1) inner += T(8, h - 6, 'Key: ' + icon + ' = ' + per, { anchor: 'start', size: 11, fill: MUTE });
    return wrap(w, h, inner, s.title);
  }

  function array(s) {
    var rows = Math.max(1, Math.round(n(s.rows, 1))), cols = Math.max(1, Math.round(n(s.cols != null ? s.cols : s.columns, 1)));
    var shaded = n(s.shaded, 0), cell = 26, pad = 10, w = pad * 2 + cols * cell, h = pad * 2 + rows * cell, inner = '', sq = s.squares !== false, idx = 0, r, c;
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      var x = pad + c * cell, y = pad + r * cell, on = idx < shaded;
      if (sq) inner += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (cell - 4) + '" height="' + (cell - 4) + '" rx="3" fill="' + (on ? (s.color || '#4dabf7') : '#fff') + '" stroke="' + INK + '"/>';
      else inner += '<circle cx="' + (x + cell / 2) + '" cy="' + (y + cell / 2) + '" r="' + (cell / 2 - 4) + '" fill="' + (on ? (s.color || '#4dabf7') : LINE) + '" stroke="' + INK + '"/>';
      idx++;
    }
    return wrap(w, h, inner, s.title);
  }

  function coordinate(s) {
    var min = n(s.min, 0), max = n(s.max, 10); if (max <= min) max = min + 10;
    var w = 234, h = 234, pad = 24, gw = w - 2 * pad, gh = h - 2 * pad, step = n(s.gridStep, 1); if (step <= 0) step = 1;
    function X(v) { return pad + (v - min) / (max - min) * gw; } function Y(v) { return h - pad - (v - min) / (max - min) * gh; }
    var inner = '', v, lblEvery = (max - min) > 10 ? 2 * step : step;
    for (v = min; v <= max + 1e-9; v += step) { inner += line(X(v), pad, X(v), h - pad, { stroke: '#eef0f5' }) + line(pad, Y(v), w - pad, Y(v), { stroke: '#eef0f5' }); }
    inner += line(pad, h - pad, w - pad, h - pad, { stroke: INK, w: 1.5 }) + line(pad, pad, pad, h - pad, { stroke: INK, w: 1.5 });
    for (v = min; v <= max + 1e-9; v += step) { if (Math.round((v - min) / step) % Math.round(lblEvery / step) === 0) inner += T(X(v), h - pad + 12, fmt(v), { size: 9, fill: MUTE }) + T(pad - 6, Y(v) + 3, fmt(v), { anchor: 'end', size: 9, fill: MUTE }); }
    var pts = s.points || [];
    if (s.path && pts.length) inner += '<path d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + f1(X(n(p.x))) + ',' + f1(Y(n(p.y))); }).join(' ') + '" fill="none" stroke="#ff6b6b" stroke-width="2"/>';
    pts.forEach(function (p, i) { var x = X(n(p.x)), y = Y(n(p.y)); inner += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="4" fill="' + col(i, p.color) + '"/>' + (p.label != null ? T(x + 6, y - 6, p.label, { anchor: 'start', size: 11 }) : ''); });
    return wrap(w, h, inner, s.title);
  }

  function angle(s) {
    var deg = n(s.degrees != null ? s.degrees : s.angle, 45), w = 220, h = 150, vx = 38, vy = 118, len = 150;
    function P(a, r) { return [vx + r * Math.cos(-a * Math.PI / 180), vy + r * Math.sin(-a * Math.PI / 180)]; }
    var p1 = P(0, len), p2 = P(deg, len), inner = line(vx, vy, p1[0], p1[1], { stroke: INK, w: 2 }) + line(vx, vy, p2[0], p2[1], { stroke: INK, w: 2 });
    var ar = 32, as = P(0, ar), ae = P(deg, ar), lg = deg > 180 ? 1 : 0;
    inner += '<path d="M' + f1(as[0]) + ',' + f1(as[1]) + ' A' + ar + ',' + ar + ' 0 ' + lg + ' 0 ' + f1(ae[0]) + ',' + f1(ae[1]) + '" fill="none" stroke="#ff6b6b" stroke-width="2"/>';
    if (deg === 90) inner += '<path d="M' + (vx + 18) + ',' + vy + ' v-18 h-18" fill="none" stroke="' + INK + '"/>';
    if (s.showMeasure !== false) { var lm = P(deg / 2, ar + 22); inner += T(lm[0], lm[1], s.label != null ? s.label : (fmt(deg) + '°'), { size: 13, weight: '700', baseline: 'middle' }); }
    return wrap(w, h, inner, s.title);
  }

  function lineplot(s) {
    var min = n(s.min, 0), max = n(s.max, 10), step = n(s.step, 1); if (max <= min) max = min + 1; if (step <= 0) step = 1;
    var counts = {}; (s.data || []).forEach(function (v) { v = n(v); counts[v] = (counts[v] || 0) + 1; });
    if (s.counts) Object.keys(s.counts).forEach(function (k) { counts[k] = n(s.counts[k]); });
    var w = 320, padL = 22, padR = 22, baseY = 124, gw = w - padL - padR, maxc = 0;
    Object.keys(counts).forEach(function (k) { maxc = Math.max(maxc, counts[k]); });
    function X(v) { return padL + (v - min) / (max - min) * gw; }
    var inner = line(padL, baseY, w - padR, baseY, { stroke: INK, w: 2 }), v, k;
    for (v = min; v <= max + 1e-9; v += step) { inner += line(X(v), baseY - 4, X(v), baseY + 4, { stroke: INK }) + T(X(v), baseY + 18, fmt(v), { size: 10 }); }
    for (k in counts) if (counts.hasOwnProperty(k)) { var x = X(n(k)), c = counts[k], i; for (i = 0; i < c; i++) inner += T(x, baseY - 9 - i * 14, '✕', { size: 12, fill: '#4dabf7' }); }
    var top = baseY - 9 - (maxc - 1) * 14 - 12, shift = top < 4 ? (4 - top) : 0, h = baseY + 24;
    if (shift > 0) { inner = '<g transform="translate(0,' + f1(shift) + ')">' + inner + '</g>'; h += shift; }
    return wrap(w, h, inner, s.title);
  }

  function venn(s) {
    var w = 264, h = 176, a = s.a || {}, b = s.b || {};
    var inner = '<circle cx="102" cy="92" r="64" fill="rgba(77,171,247,.25)" stroke="' + INK + '"/><circle cx="162" cy="92" r="64" fill="rgba(255,107,107,.25)" stroke="' + INK + '"/>';
    inner += T(70, 96, '' + (s.onlyA != null ? s.onlyA : (a.only != null ? a.only : '')), { size: 15, weight: '700' });
    inner += T(194, 96, '' + (s.onlyB != null ? s.onlyB : (b.only != null ? b.only : '')), { size: 15, weight: '700' });
    inner += T(132, 96, '' + (s.both != null ? s.both : ''), { size: 15, weight: '700' });
    inner += T(64, 20, a.label || s.labelA || 'A', { size: 12, weight: '700' }) + T(200, 20, b.label || s.labelB || 'B', { size: 12, weight: '700' });
    if (s.outside != null) inner += T(254, 170, '' + s.outside, { anchor: 'end', size: 11, fill: MUTE });
    return wrap(w, h, inner, s.title);
  }

  function tally(s) {
    var rows = s.rows || s.data || []; if (!rows.length) return '';
    var w = 280, rh = 30, padT = 6, h = padT + rows.length * rh, inner = '';
    rows.forEach(function (r, i) {
      var label = r.label != null ? r.label : ('Row ' + (i + 1)), val = Math.max(0, Math.round(n(r.value != null ? r.value : r.count))), y = padT + i * rh + rh / 2;
      inner += T(8, y + 4, label, { anchor: 'start', size: 12 });
      var groups = Math.floor(val / 5), rem = val % 5, gx = 116, g, j;
      for (g = 0; g < groups; g++) { var bx = gx + g * 30; for (j = 0; j < 4; j++) inner += line(bx + j * 6, y - 8, bx + j * 6, y + 8, { stroke: INK, w: 2 }); inner += line(bx - 2, y + 8, bx + 20, y - 8, { stroke: INK, w: 2 }); }
      var rx = gx + groups * 30; for (j = 0; j < rem; j++) inner += line(rx + j * 6, y - 8, rx + j * 6, y + 8, { stroke: INK, w: 2 });
    });
    return wrap(w, h, inner, s.title);
  }

  // A text label with a faint white backing — so labels stay readable over lines/maps.
  function tbg(x, y, s, o) { var t = String(s), bw = t.length * 6.2 + 6; return '<rect x="' + f1(x - bw / 2) + '" y="' + f1(y - 9) + '" width="' + f1(bw) + '" height="14" rx="3" fill="#fff" opacity="0.82"/>' + T(x, y + 2, t, o); }

  // Schematic ROUTE MAP — places as dots + routes as lines with distances + a scale.
  // Recognisable (not real geography) so the AI can GENERATE "how much further / which
  // route" questions, not just reuse the few real ones.
  function routemap(s) {
    var places = s.places || [], legs = s.legs || []; if (!places.length) return '';
    var w = 330, h = 250, pad = 36, by = {}, inner = '';
    function X(v) { return pad + (clamp(n(v), 0, 100) / 100) * (w - 2 * pad); }
    function Y(v) { return pad + (clamp(n(v), 0, 100) / 100) * (h - 2 * pad); }
    places.forEach(function (p) { by[p.name] = p; });
    legs.forEach(function (l) { var a = by[l.from], b = by[l.to]; if (!a || !b) return;
      inner += line(X(a.x), Y(a.y), X(b.x), Y(b.y), { stroke: '#e8590c', w: 3 });
      if (l.dist != null) inner += tbg((X(a.x) + X(b.x)) / 2, (Y(a.y) + Y(b.y)) / 2, '' + l.dist, { size: 11, weight: '700', fill: '#c2410c' });
    });
    places.forEach(function (p) { var x = X(p.x), y = Y(p.y); inner += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="5" fill="' + INK + '"/>' + tbg(x, y - 12, p.name, { size: 11, weight: '700' }); });
    if (s.scaleLabel) inner += line(pad, h - 12, pad + 60, h - 12, { stroke: INK, w: 2 }) + line(pad, h - 16, pad, h - 8, { stroke: INK }) + line(pad + 60, h - 16, pad + 60, h - 8, { stroke: INK }) + T(pad + 30, h - 1, s.scaleLabel, { size: 10, fill: MUTE });
    return wrap(w, h, inner, s.title);
  }

  // DATA TABLE (timetables, tally totals, double-bar-graph data, etc.).
  function table(s) {
    var headers = s.headers || [], rows = s.rows || [];
    var ncol = Math.max(headers.length, rows.reduce(function (m, r) { return Math.max(m, (r || []).length); }, 0)); if (!ncol) return '';
    var cw = Math.max(54, Math.floor(300 / ncol)), ch = 30, w = ncol * cw + 2, r0 = headers.length ? 1 : 0, hh = (rows.length + r0) * ch + 2, inner = '', c;
    if (headers.length) for (c = 0; c < ncol; c++) inner += '<rect x="' + (1 + c * cw) + '" y="1" width="' + cw + '" height="' + ch + '" fill="#eef2f7" stroke="' + INK + '"/>' + T(1 + c * cw + cw / 2, 1 + ch / 2 + 4, headers[c] != null ? headers[c] : '', { size: 11, weight: '700' });
    rows.forEach(function (row, ri) { var yy = 1 + (ri + r0) * ch; for (c = 0; c < ncol; c++) inner += '<rect x="' + (1 + c * cw) + '" y="' + yy + '" width="' + cw + '" height="' + ch + '" fill="#fff" stroke="' + INK + '"/>' + T(1 + c * cw + cw / 2, yy + ch / 2 + 4, (row && row[c] != null) ? row[c] : '', { size: 11 }); });
    return wrap(w, hh, inner, s.title);
  }

  // VERTICAL SCALE / thermometer / measuring stick — "read the scale", growth, temperature.
  function vscale(s) {
    var min = n(s.min, 0), max = n(s.max, 100), step = n(s.step, 10); if (max <= min) max = min + 1; if (step <= 0) step = (max - min) / 5;
    var w = 290, h = 250, axX = 64, top = 18, bot = h - 18, gh = bot - top, v;
    function Y(v) { return bot - (v - min) / (max - min) * gh; }
    var inner = line(axX, top, axX, bot, { stroke: INK, w: 2 });
    for (v = min; v <= max + 1e-9; v += step) { var y = Y(v); inner += line(axX - 5, y, axX + 5, y, { stroke: INK }) + T(axX - 9, y + 4, fmt(v) + (s.unit ? '' : ''), { anchor: 'end', size: 10 }); }
    (s.markers || []).forEach(function (m, i) { var y = Y(n(m.value)), c = col(i, m.color); inner += line(axX, y, axX + 96, y, { stroke: c, dash: '4 3' }) + '<circle cx="' + axX + '" cy="' + f1(y) + '" r="4" fill="' + c + '"/>' + T(axX + 100, y + 4, m.label != null ? m.label : (fmt(m.value) + (s.unit || '')), { anchor: 'start', size: 11, fill: c }); });
    return wrap(w, h, inner, s.title);
  }

  // BALANCE scales — equality / simple algebra ("what makes it balance?").
  function balance(s) {
    var w = 264, h = 168, inner = '';
    inner += poly([[120, 122], [144, 122], [132, 92]], { fill: '#c7c7cc' });
    inner += line(44, 82, 220, 82, { stroke: INK, w: 3 });
    inner += line(64, 82, 64, 104, { stroke: INK }) + '<path d="M44,104 a20,9 0 0 0 40,0" fill="#eef2f7" stroke="' + INK + '"/>' + T(64, 100, String(s.left != null ? s.left : ''), { size: 14, weight: '700' });
    inner += line(200, 82, 200, 104, { stroke: INK }) + '<path d="M180,104 a20,9 0 0 0 40,0" fill="#eef2f7" stroke="' + INK + '"/>' + T(200, 100, String(s.right != null ? s.right : ''), { size: 14, weight: '700' });
    inner += T(132, 150, String(s.relation || '='), { size: 18, weight: '700' });
    return wrap(w, h, inner, s.title);
  }

  // TIMELINE — a horizontal time arrow with events in order (left = earliest).
  // Events alternate above/below the line so labels don't collide; optional dates.
  function timeline(s) {
    var ev = (s.events || s.items || s.steps || s.points || []).map(function (e) {
      return (e && typeof e === 'object') ? { label: e.label != null ? e.label : '', date: (e.date != null ? e.date : e.year) } : { label: '' + e };
    }).filter(function (e) { return e.label !== ''; });
    if (!ev.length) return '';
    var cnt = ev.length, slot = clamp(Math.round(680 / cnt), 66, 124), padL = 22, padR = 30;
    var w = padL + padR + cnt * slot, lineY = 88, h = 168;
    function X(i) { return padL + slot * i + slot / 2; }
    var inner = line(padL - 6, lineY, w - padR + 4, lineY, { stroke: INK, w: 2 });
    inner += '<path d="M' + (w - padR + 8) + ',' + lineY + ' l-9,-5 v10 z" fill="' + INK + '"/>';
    ev.forEach(function (e, i) {
      var x = X(i), up = (i % 2 === 0), c = col(i);
      inner += line(x, lineY, x, up ? lineY - 9 : lineY + 9, { stroke: MUTE });
      inner += '<circle cx="' + f1(x) + '" cy="' + lineY + '" r="5" fill="' + c + '"/>';
      var lns = wrapWords(e.label, Math.max(8, Math.floor(slot / 6)));
      lns.slice(0, 3).forEach(function (ln, li) {
        var yy = up ? (lineY - 14 - (Math.min(3, lns.length) - 1 - li) * 11) : (lineY + 24 + li * 11);
        inner += T(x, yy, ln, { size: 10, weight: '600' });
      });
      if (e.date != null && e.date !== '') {
        var dy = up ? (lineY - 14 - Math.min(3, lns.length) * 11) : (lineY + 24 + Math.min(3, lns.length) * 11);
        inner += T(x, dy, '' + e.date, { size: 9, fill: MUTE });
      }
    });
    return wrap(w, h, inner, s.title);
  }

  // FLOW / process — boxes left-to-right joined by arrows (e.g. sugar cane →
  // raw juice → … → crystals). Optional `branches` draw a small arrow off a step
  // to a side label (a by-product separated, or an input added).
  function flow(s) {
    var steps = (s.steps || s.stages || s.boxes || s.items || []).map(function (x) {
      return (x && typeof x === 'object') ? (x.label != null ? '' + x.label : '') : '' + x;
    }).filter(function (x) { return x !== ''; });
    if (!steps.length) return '';
    var branches = (s.branches || s.byproducts || s.outputs || []).map(function (b, i) {
      return (b && typeof b === 'object')
        ? { after: n(b.after != null ? b.after : (b.at != null ? b.at : b.step), i), label: b.label != null ? '' + b.label : '', dir: (b.dir === 'up' || b.dir === 'in') ? 'up' : 'down' }
        : { after: i, label: '' + b, dir: 'down' };
    }).filter(function (b) { return b.label !== ''; });
    var hasDown = branches.some(function (b) { return b.dir === 'down'; }), hasUp = branches.some(function (b) { return b.dir === 'up'; });
    var boxH = 40, gap = 30, padX = 12, topM = hasUp ? 42 : 12, botM = hasDown ? 42 : 12, cy = topM + boxH / 2;
    var ws = steps.map(function (t) { return clamp(t.length * 6.2 + 18, 52, 150); });
    var xs = [], x = padX; ws.forEach(function (bw) { xs.push(x); x += bw + gap; });
    var w = x - gap + padX, h = topM + boxH + botM, inner = '', i;
    for (i = 0; i < steps.length - 1; i++) { var x1 = xs[i] + ws[i], x2 = xs[i + 1]; inner += line(x1, cy, x2 - 6, cy, { stroke: INK, w: 1.5 }) + '<path d="M' + f1(x2) + ',' + cy + ' l-7,-4 v8 z" fill="' + INK + '"/>'; }
    steps.forEach(function (t, i2) {
      var bw = ws[i2], bx = xs[i2];
      inner += '<rect x="' + f1(bx) + '" y="' + (cy - boxH / 2) + '" width="' + f1(bw) + '" height="' + boxH + '" rx="7" fill="#eef2f7" stroke="' + INK + '"/>';
      var lns = wrapWords(t, Math.max(7, Math.floor(bw / 5.8))).slice(0, 2);
      lns.forEach(function (ln, li) { inner += T(bx + bw / 2, cy + 4 - (lns.length - 1) * 6 + li * 12, ln, { size: 10, weight: '600' }); });
    });
    branches.forEach(function (b) {
      var idx = clamp(Math.round(b.after), 0, steps.length - 1), bx = xs[idx] + ws[idx] / 2;
      if (b.dir === 'up') { inner += line(bx, cy - boxH / 2, bx, 18, { stroke: MUTE }) + '<path d="M' + f1(bx) + ',14 l-4,8 h8 z" fill="' + MUTE + '"/>' + T(bx, 11, b.label, { size: 9, fill: MUTE }); }
      else { var by = cy + boxH / 2; inner += line(bx, by, bx, h - 24, { stroke: MUTE }) + '<path d="M' + f1(bx) + ',' + (h - 20) + ' l-4,-8 h8 z" fill="' + MUTE + '"/>' + T(bx, h - 7, b.label, { size: 9, fill: MUTE }); }
    });
    return wrap(w, h, inner, s.title);
  }

  // mindmap / knowledge map: a root concept on the left with branches (strands) fanning
  // out to the right, each an optional mastery colour + count. A visual 思维导图 overview.
  // {type:'mindmap', root:'Year 6 Maths', branches:[{label:'Fractions', color:'#34c759', count:5}, ...]}
  function mindmap(s) {
    var root = String(s.root || s.center || s.title || 'Topic');
    var br = (s.branches || s.nodes || s.children || []).filter(function (b) { return b && b.label != null; }).slice(0, 12);
    if (!br.length) return '';
    var w = 480, rowH = 42, pad = 16;
    var h = Math.max(140, br.length * rowH + pad * 2);
    var rootX = 14, rootW = 150, rootRX = rootX + rootW, cy = h / 2;
    var bx = 210, bw = w - bx - 14, startY = (h - br.length * rowH) / 2;
    var inner = '';
    br.forEach(function (b, i) {                          // connectors first (behind the nodes)
      var by = startY + i * rowH + rowH / 2, mx = (rootRX + bx) / 2;
      inner += '<path d="M' + f1(rootRX) + ',' + f1(cy) + ' C' + f1(mx) + ',' + f1(cy) + ' ' + f1(mx) + ',' + f1(by) + ' ' + f1(bx) + ',' + f1(by) + '" fill="none" stroke="' + (b.color || LINE) + '" stroke-width="2.5" opacity="0.55"/>';
    });
    inner += '<rect x="' + rootX + '" y="' + f1(cy - 26) + '" width="' + rootW + '" height="52" rx="12" fill="#007aff"/>';
    wrapWords(root, 18).slice(0, 2).forEach(function (ln, li, arr) { inner += T(rootX + rootW / 2, cy + 5 - (arr.length - 1) * 7 + li * 14, ln, { size: 12, weight: '700', fill: '#fff' }); });
    br.forEach(function (b, i) {
      var by = startY + i * rowH + rowH / 2, ph = 32, c = b.color || MUTE, label = String(b.label);
      inner += '<rect x="' + bx + '" y="' + f1(by - ph / 2) + '" width="' + bw + '" height="' + ph + '" rx="9" fill="#fff" stroke="' + c + '" stroke-width="2"/>';
      inner += '<circle cx="' + (bx + 15) + '" cy="' + f1(by) + '" r="5" fill="' + c + '"/>';
      var maxc = Math.floor((bw - 46) / 6.6);
      if (label.length > maxc) label = label.slice(0, Math.max(1, maxc - 1)) + '…';
      inner += T(bx + 28, by + 4, label, { size: 12, weight: '600', anchor: 'start' });
      if (b.count != null) inner += T(bx + bw - 10, by + 4, String(b.count), { size: 11, fill: MUTE, anchor: 'end' });
    });
    return wrap(w, h, inner, null);
  }

  var R = {
    pie: pie, piechart: pie, fractioncircle: pie, circlegraph: pie,
    mindmap: mindmap, conceptmap: mindmap, knowledgemap: mindmap, mindmup: mindmap,
    timeline: timeline, time: timeline, history: timeline,
    flow: flow, flowchart: flow, process: flow, sequence: flow, foodchain: flow, chain: flow, pathway: flow,
    routemap: routemap, route: routemap, journeymap: routemap, map: routemap,
    table: table, datatable: table,
    scale: vscale, thermometer: vscale, verticalscale: vscale, gauge: vscale, measuringscale: vscale,
    balance: balance, balancescale: balance, seesaw: balance,
    bar: bar, barchart: bar, column: bar, columngraph: bar, bargraph: bar,
    numberline: numberline,
    fractionbar: fractionbar, tape: fractionbar, barmodel: fractionbar, fractionstrip: fractionbar,
    shape: shape, geometry: shape, polygon2d: shape,
    clock: clock,
    pictogram: pictogram, picturegraph: pictogram,
    array: array, grid: array, dotarray: array, areamodel: array,
    coordinate: coordinate, coordinategrid: coordinate, plane: coordinate, gridplot: coordinate, cartesian: coordinate,
    angle: angle,
    lineplot: lineplot, dotplot: lineplot,
    venn: venn, venndiagram: venn,
    tally: tally, tallychart: tally
  };

  function render(spec) {
    try {
      if (!spec || typeof spec !== 'object') return '';
      var key = String(spec.type || '').toLowerCase().replace(/[\s_-]/g, '');
      var fn = R[key]; if (!fn) return '';
      var out = fn(spec);
      return (typeof out === 'string' && /<svg[\s>]/i.test(out)) ? out : '';
    } catch (e) { return ''; }
  }

  var api = { render: render, types: Object.keys(R) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PLDiagram = api;
})(typeof window !== 'undefined' ? window : globalThis);
