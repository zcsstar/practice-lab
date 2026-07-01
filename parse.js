/* ============================================================================
 * Practice Lab — robust question JSON parser
 * ----------------------------------------------------------------------------
 * Models return JSON that is often imperfect: wrapped in ``` fences, preceded by
 * "thinking" prose, containing raw control chars or unescaped LaTeX backslashes,
 * or TRUNCATED mid-response when the output budget runs out. This module turns
 * any of that into the question objects that DID come through, never throwing —
 * it returns [] when nothing is recoverable and lets the caller decide.
 *
 * Loaded as a classic script (works on file:// and GitHub Pages) and also
 * usable from Node for tests. Exposed as `window.PLParse` / `module.exports`.
 * Pure: no app state, no DOM, no network.
 * ========================================================================== */
(function (root) {
  'use strict';

  // Field accessors — tolerant of the many shapes models use.
  function qText(q) { return q && (q.question || q.text || q.stem || q.prompt || q.problem || q.questionText || q.q) || ''; }
  function qOpts(q) {
    if (!q) return null;
    return Array.isArray(q.options) ? q.options
      : Array.isArray(q.choices) ? q.choices
      : Array.isArray(q.answers) ? q.answers : null;
  }
  function looksQ(q) { return !!(q && typeof q === 'object' && !Array.isArray(q) && (qText(q) || qOpts(q) || q.answer != null)); }
  function getArr(p) {
    if (Array.isArray(p)) return p;
    if (!p || typeof p !== 'object') return null;
    return Array.isArray(p.questions) ? p.questions
      : Array.isArray(p.items) ? p.items
      : Array.isArray(p.data) ? p.data
      : Array.isArray(p.results) ? p.results
      : Array.isArray(p.quiz) ? p.quiz : null;
  }

  // Return the substring of the balanced {..} or [..] that begins at index i,
  // or null if it never closes (i.e. the response was truncated). Correctly
  // skips braces/brackets that live inside JSON strings (honouring \ escapes).
  function extractBalanced(s, i) {
    const open = s[i], close = open === '{' ? '}' : open === '[' ? ']' : null;
    if (!close) return null;
    let depth = 0, inStr = false, esc = false;
    for (let k = i; k < s.length; k++) {
      const ch = s[k];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
      } else {
        if (ch === '"') inStr = true;
        else if (ch === open) depth++;
        else if (ch === close) { depth--; if (depth === 0) return s.slice(i, k + 1); }
      }
    }
    return null;
  }

  // Escape raw control chars that appear INSIDE string values (some models emit
  // real newlines/tabs in strings, which is invalid JSON). Structural whitespace
  // outside strings is left untouched.
  function sanitizeCtrl(s) {
    let out = '', inStr = false, esc = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        if (esc) { out += ch; esc = false; continue; }
        if (ch === '\\') { out += ch; esc = true; continue; }
        if (ch === '"') { out += ch; inStr = false; continue; }
        if (ch === '\n') { out += '\\n'; continue; }
        if (ch === '\r') { out += '\\r'; continue; }
        if (ch === '\t') { out += '\\t'; continue; }
        if (ch.charCodeAt(0) < 0x20) { continue; } // drop other control chars
        out += ch;
      } else { out += ch; if (ch === '"') inStr = true; }
    }
    return out;
  }

  // Double any backslash that isn't a valid JSON escape — repairs raw LaTeX like
  // "\$", "\sqrt" or "\div" that the model forgot to escape and that therefore
  // make JSON.parse throw (so this repair gets a chance to run).
  function fixEsc(s) { return s.replace(/\\(?!["\\/bfnrtu])/g, '\\\\'); }

  // The SILENT cousin of the above: when the model writes a LaTeX command whose
  // first letter happens to be a valid JSON escape char — "\frac", "\beta",
  // "\times", "\theta", "\rho" — JSON.parse does NOT throw. It quietly turns
  // "\f" into a form-feed (U+000C), "\b" into a backspace (U+0008), "\t" into a
  // tab and "\r" into a carriage-return, leaving e.g. "$<FF>rac{1}{2}$" — which
  // KaTeX then renders in red error text. fixEsc never sees these because the
  // parse succeeded. None of those control chars legitimately appear in question
  // text, so we map them back to their LaTeX command. "\n" (newline) is left
  // alone: it is genuinely used to separate explanation lines (see fmtExplain).
  function unmangleLatex(s) {
    return s
      .replace(/\x0c(?=[A-Za-z])/g, '\\f')   // \frac \frown \fbox …
      .replace(/\x08(?=[A-Za-z])/g, '\\b')   // \beta \binom \boxed \begin \bar …
      .replace(/\t(?=[a-z])/g, '\\t')        // \times \theta \tan \text \to \tfrac …
      .replace(/\r(?=[A-Za-z])/g, '\\r')     // \rho \right \rightarrow …
      // Models sometimes write \frac/\tfrac/\dfrac with PARENTHESES instead of the
      // required braces — "\frac(1)(2)" (which, once \f is mangled, reads "rac(1)(2)").
      // Rewrite to braces so KaTeX renders a real fraction instead of garbled text.
      .replace(/\\([dt]?frac)\s*\(([^()]*)\)\s*\(([^()]*)\)/g, '\\$1{$2}{$3}');
  }
  // Apply unmangleLatex to every string leaf of a recovered object (in place).
  function deepUnmangle(v) {
    if (typeof v === 'string') return unmangleLatex(v);
    if (Array.isArray(v)) return v.map(deepUnmangle);
    if (v && typeof v === 'object') { for (const k in v) v[k] = deepUnmangle(v[k]); return v; }
    return v;
  }

  function repairs(s) { return [s, sanitizeCtrl(s), fixEsc(s), fixEsc(sanitizeCtrl(s))]; }
  function tryParse(s) { try { return JSON.parse(s); } catch (e) { return undefined; } }
  function parseObj(sub) { for (const v of repairs(sub)) { const o = tryParse(v); if (o !== undefined) return o; } return null; }

  function normArr(p) {
    const a = getArr(p);
    if (a) return a.filter(looksQ);
    if (looksQ(p)) return [p];
    return null;
  }

  // First fully-balanced {..}/[..] block in the text (skips leading prose/fences).
  function firstBalanced(txt) {
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (c === '{' || c === '[') { const sub = extractBalanced(txt, i); if (sub) return sub; }
    }
    return null;
  }

  // Fast path: the response is well-formed (possibly needing a light repair).
  // (a) the whole text parses cleanly; or (b) the first balanced block is a real
  // wrapper containing a questions array. We deliberately do NOT accept a single
  // inner object here — a truncated array's first object would otherwise mask the
  // other complete questions, which the recovery path below collects properly.
  function fastParse(txt) {
    for (const v of repairs(txt)) {
      const p = tryParse(v);
      if (p !== undefined) { const a = normArr(p); if (a && a.length) return a; }
    }
    const fb = firstBalanced(txt);
    if (fb) for (const v of repairs(fb)) {
      const p = tryParse(v);
      if (p !== undefined) { const a = getArr(p); if (a) { const f = a.filter(looksQ); if (f.length) return f; } }
    }
    return [];
  }

  // Recovery path: walk the questions array object-by-object, keeping every
  // COMPLETE object and skipping any single malformed one. A truncated trailing
  // object simply ends the scan — everything before it is preserved.
  function recoverObjects(txt) {
    const m = txt.match(/"(?:questions|items|data|results|quiz)"\s*:\s*\[/i);
    let i = m ? txt.indexOf('[', m.index) + 1
      : (txt.indexOf('[') >= 0 ? txt.indexOf('[') + 1 : txt.indexOf('{'));
    if (i < 0) return [];
    const out = [];
    while (i < txt.length) {
      while (i < txt.length && txt[i] !== '{') i++;
      if (i >= txt.length) break;
      const sub = extractBalanced(txt, i);
      if (!sub) break;                         // truncated tail — stop
      const obj = parseObj(sub);
      if (obj && looksQ(obj)) out.push(obj);    // keep good ones, skip bad ones
      i += sub.length;
    }
    return out;
  }

  // Public: return an array of raw question objects (never throws).
  function extractQuestions(raw) {
    let txt = String(raw == null ? '' : raw).replace(/^﻿/, '').trim();
    txt = txt.replace(/^```[a-zA-Z]*\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
    if (!txt) return [];
    const fast = fastParse(txt);
    const out = fast.length ? fast : recoverObjects(txt);
    return out.map(deepUnmangle);
  }

  const api = { extractQuestions, qText, qOpts, looksQ, getArr, extractBalanced, sanitizeCtrl, fixEsc, unmangleLatex };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PLParse = api;
})(typeof window !== 'undefined' ? window : globalThis);
