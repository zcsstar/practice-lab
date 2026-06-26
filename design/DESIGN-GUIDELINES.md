# Practice Lab — Design Guidelines

Adapted from the **Claude** DESIGN.md in
[voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md)
(`design-md/claude/DESIGN.md`) — a warm, editorial system chosen because it
feels human and inviting rather than cold/corporate, which suits a kids' learning
app. Use this as the reference when changing the UI of `index.html`.

> To browse all 73+ brand design systems, clone the upstream repo separately:
> `git clone https://github.com/voltagent/awesome-design-md`

## Palette (what the app uses)

| Token | Value | Use |
|---|---|---|
| Canvas | `#faf9f5` | warm cream page base (not pure white) |
| Card surface | `#ffffff` | cards on the canvas |
| Feature surface | `#efe9de` | callout / highlighted cards |
| Coral (accent) | `#cc785c` | primary CTAs, key highlights — used sparingly |
| Coral deep | `#b8593f` | hover/active for coral |
| Ink (headings) | `#141413` | headlines |
| Body | `#3d3d3a` | body text |
| Muted | `#6c6a64` | secondary text |
| Success / Warn / Bad | green / amber / red | marking states |

**Rule:** reserve coral for primary actions and important moments only. Don't
flood the page with the accent.

## Typography

- **Headings:** a serif display face (Georgia / "Tiempos"-like fallback) at
  weight **400** with slight negative letter-spacing. Never bold the serif —
  weight 400 is the literary, considered voice.
- **Body / UI:** humanist sans (system stack / Inter), normal weights.
- Keep maths in KaTeX as-is.

## Spacing & layout

- Generous card padding (~24–32px), comfortable section rhythm.
- Max content width ~880px (single-column, mobile-first).
- Rounded corners 12–16px; soft shadows.

## Principles

1. Warm and humanist over cold/blue.
2. Big touch targets, mobile-first, one clear action per screen.
3. Alternate surfaces (cream → white card → feature surface) for pacing.
4. Encouraging tone in copy; celebrate effort, not just correctness.
