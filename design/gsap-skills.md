# GSAP animation guidelines (for Practice Lab)

Source: [greensock/gsap-skills](https://github.com/greensock/gsap-skills) — GSAP's
official AI-agent skill. Clone it for the full 8 skill modules (core, timeline,
ScrollTrigger, plugins, utils, React, performance, frameworks).

GSAP is loaded from CDN in `index.html` (no auth/Club needed — all plugins are
free since the Webflow acquisition).

## Principles we follow here

- **Transform over layout.** Animate `x/y/scale/rotation` and `autoAlpha`
  (opacity + visibility), never `top/left/width/height`. GPU-accelerated, no
  reflow.
- **Timelines, not chained delays.** Sequence with `gsap.timeline()` and
  position parameters.
- **Subtle and fast.** Durations 0.2–0.45s, gentle eases (`power2.out`,
  `back.out` for pops). The UI should feel responsive, not theatrical.
- **Respect motion preferences.** Honour `prefers-reduced-motion`: skip/også
  shorten entrance animations.
- **Don't block interaction.** Entrance animations start elements at their final
  layout position (only transform/opacity differ), so taps work immediately.

## Where it's used in the app

- `animateIn(scope)` — called by `show()`: cards fade + rise with a small stagger
  on every view change.
- Results screen: score percent counts up; question cards stagger in.
- Run screen: question swaps get a quick cross-fade.
- Button/press and chip feedback stay mostly CSS (`:active`) for snappiness.
