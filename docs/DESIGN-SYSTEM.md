# Design system

Brutalist editorial: grayscale + one accent, a graffiti brand face, monospace utility voice, visible structure. All tokens live in `src/styles/tokens.css`.

## Colour
| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#111111` | `#f5f4f0` | text |
| `--paper` | `#f5f4f0` | `#0a0a0a` | background |
| `--paper-2` | `#e9e7e1` | `#1a1a1a` | surfaces, image wells |
| `--muted` | `#6f6f6f` | `#929292` | secondary text, plus-marks |
| `--ghost` | `#9a9a9a` | `#5c5c5c` | echo words in split headlines |
| `--hairline` | 12% ink | 14% white | borders |
| `--night*` | always dark | | footer, menu, popup |

**Accent** (switchable in the menu): Signal Red `#e30613` / `#ff1a2c` (default) · Burnt Orange `#c8501e` / `#e56425`. Text on an accent fill uses `--on-accent` (`#111`).

## Type
| Family | Token | Use |
|---|---|---|
| **GGGGG SpecialG** (GW) | `--font-brand`, `--font-h1` | logo, page-level H1s |
| GGGGG SpecialG (GWOL outline) | `--font-brand-outline` | footer watermark |
| Inter Variable | `--font-display`, `--font-sans` | H2s, section headings, body |
| JetBrains Mono Variable | `--font-mono` | nav, labels, indices, meta, buttons |

- The brand face has no digits — numbers automatically fall back to Inter.
- It's single-weight: use the `.brand-type` class (no faux bold, no tracking).
- To revert H1s to Inter: `--font-h1: var(--font-display);` in `tokens.css`.
- Case: display text in Title Case; mono utility text UPPERCASE.
- **Page H1s** (`.brand-type`): `line-height: normal`, `letter-spacing: 0.5rem` (tokens `--h1-leading`, `--h1-tracking`); on screens ≤560px the tracking scales as `0.075em` so long words fit. The logo and watermark are not tracked.
- **No opacity for emphasis.** Echo/secondary words use solid shades (`--ghost`, `--ghost-on-media`), and the footer watermark is a solid `#1f1f1f`. Entrance animations may fade, but end fully opaque.

## Structural devices
| Device | How |
|---|---|
| Plus-marks | `.plus-corner--tl/tr/bl/br` on section corners; chrome has its own |
| Bracketed labels | `.section-label` → `[ Selected Work ]` |
| Numeric indexing | `01 / 24` on galleries, popups, project grid, rows, steps |
| Brand-mark bullet | `.brand-mark` → `▪ TEXT` |
| Play button | accent square + triangle on video and embed posters |
| Red flood | hover fill rising from the baseline (bar cells, steps, CTA button) |
| Plus-mark offsets | `--plus-x: -3.5px`, `--plus-y: -8.5px` — where `+` sits on metrics / project-meta hairlines |
| Scramble | `data-scramble` on link text (random glyphs); the logo uses `data-scramble="swap"` — its own letters trade places, so every frame stays in the brand font |
| Watermark | solid-fill brand wordmark cut off at the top of the footer |

## Spacing & layout
`--gutter clamp(16px, 3.2vw, 32px)` · `--section-y clamp(64px, 9vw, 128px)` · `--frame-top` 64 / 52px · `--bar-h` 64 / 56px · safe-area insets on all fixed chrome.

Breakpoints used: 380 · 560 · 640 · 720 (phone) · 900 · 1024 (tablet).

## Motion
Physics: `src/scripts/spring.ts` (k = stiffness, ζ = damping). Footer = curtain reveal (scroll-linked, 120ms lag, panel rises 45%, wordmark lift 90px / skew −6° / stretch 30%); orbit = one spring per card. Scramble speed: `--scramble-ms` / `data-scramble-ms`.
`--duration-fast 200ms` · `--duration-med 260ms` · `--duration-slow 600ms` · `--ease-out cubic-bezier(.16,1,.3,1)`. Entrance motion via `data-reveal` (+ `--reveal-i` stagger). Everything respects `prefers-reduced-motion`.
