# Architecture

## The idea in one line
Every page and every project is a JSON list of blocks; the site chrome is configured in one JSON file.

```
src/site.json ─────────────► Frame (top) · Bar (bottom) · Menu · Loader · Footer
src/content/pages/*.json ──┐
src/content/projects/*.json┴► BlockRenderer ─► blockRegistry[type] ─► <Block {...settings} />
```

## Routes
| File | URL |
|---|---|
| `src/content/pages/home.json` | `/` |
| `src/content/pages/<slug>.json` | `/<slug>` (about, story, services, contact; hidden: styleguide, orbit-v2) |
| `src/content/projects/<slug>.json` | `/work/<slug>` (+ automatic "Next project" link) |
| `src/pages/404.astro` | 404 |

The site is deployed under `/grxphjc/`. Every authored link and image goes through `href()` in `src/lib/url.ts`, which adds that base. Pure `#`, `http`, `mailto` and `tel` links pass through untouched.

## Two registries — never merged
- `src/blocks/registry.js` — **content blocks**, full-width page sections.
- `src/blocks/shell-registry.js` — **chrome blocks** (logo, bar cells, menu toggle, footer columns). They assume narrow, horizontal layouts.

`BlockRenderer` passes the whole project to every block as `context`; blocks that don't need it ignore it.

## Chrome
Configured in `src/site.json`. Pages may only tweak modifiers — `header: { "theme": "auto|light|dark", "transparent": true|false }` — never replace chrome blocks.

| Piece | File | Notes |
|---|---|---|
| Top frame | `layout/Frame.astro` | `frame.left` / `frame.right` labels, plus the screen-edge progress outline (SVG; geometry in `progress.ts`) |
| Bottom bar | `layout/Bar.astro` | first shell block left, rest as equal cells; cells hide ≤720px |
| Menu | `layout/Menu.astro` | rendered at **body level** — see gotcha below |
| Loader | `layout/Loader.astro` | once per session, skippable, off for reduced motion |
| Lightbox | `layout/Lightbox.astro` | any `[data-lb]` element opens it |
| Cursor | `layout/Cursor.astro` | fine pointers only, toggle in the menu |
| Footer | `layout/Footer.astro` | footer shell blocks + the curtain wordmark panel |

## Client JavaScript
One entry, `src/scripts/main.ts`. Each module no-ops if its markup is absent: prefs, menu, scramble, reveal, progress, cursor, lightbox, marquee, marquee-tbx (tube; engine in `tbx.ts`), orbit (sphere + scroll explosion; v2's list in `orbit-vertical.ts`), pinned (scroll-driven gallery), video (loop/click playback + embed facades), footer (curtain), loader. `focus.ts` holds the shared focus trap and scroll lock.

**Motion toolkit — `src/scripts/motion/`.** Shared primitives so motion feels like one system: `spring` (stiffness/damping physics), `damp` (frame-rate-independent exponential follow), `flip` (2D FLIP morphs between boxes), `morph3d` (full 3D pose + camera tweens). `src/scripts/spring.ts` re-exports the spring for older imports. Remaining motion (reveal, scramble, scroll progress) moves in as those modules are next touched.

`src/layout/Base.astro` has an inline `<head>` script that sets theme, accent, cursor and the loader flag **before first paint** — keep it inline.

## Build-time helpers
- `src/lib/url.ts` — `href()` base-path resolver.
- `src/lib/media.ts` — `aspectOf(src)` reads local image dimensions (EXIF-aware) so layouts size frames explicitly.
- `src/lib/projects.ts` — `getProjects()` (sorted by `order`, then year, then title) and `projectMeta()` ("Category — Year").
- `src/lib/embed.ts` — `parseEmbed(url)`: YouTube/Vimeo URL → validated, privacy-mode embed src (or null).
- `src/lib/tokens.ts` — `fill("{client|[Client]}", project)` token filler used by project-meta.
- `src/lib/accent.ts` — `parseAccent(text)`: `*word*` / `*several words*` highlight flags.
- `src/lib/bleed.ts` — whether a page's first block runs under the top frame.

## Footer curtain
`Footer.astro` = `.site-footer__inner` (normal content, z-index 2) + `.site-footer__window` (LAST, in flow, `clip-path: inset(0)`) containing `.site-footer__panel` (`position: fixed; bottom: 0`). The window rides the page and crops the fixed panel, so scrolling uncovers it. `footer.ts` adds the scroll-linked feel (target → lagged `cur` → `remaining` drives panel rise + wordmark lift/skew/stretch) and the one-shot watermark swap. **Rule:** no ancestor of the panel may have transform / filter / perspective / contain / will-change, or `position: fixed` stops being relative to the screen. Sizing variables are scoped to `.site-footer`.

## Orbit v2
`orbit-v2` renders through the same `Orbit.astro` as v1 with `altView="vertical"`, which swaps v1's grid for a list (`.orbit__vlist`). `orbit.ts` hands the view toggle to `orbit-vertical.ts`, which: pins the section and maps **page scroll → list offset** (no wheel hijacking); wraps the list so it loops `loops` times (runway = loops × list height ÷ travel) before the pin releases; follows with bokid's damping (0.09/frame); snaps the nearest project to centre after 250ms idle; draws the counter-scrolling number + title column (≥900px); and morphs sphere ⇄ list in true 3D. **The morph** (`motion/morph3d.ts`) tweens the sphere's own cards and the camera between two poses; `orbit.ts` supplies its pose formulas (`cardNow`, `cardRest`, `worldNow`, `worldRest`, `reset`) so the morph starts and ends exactly on what the live sphere draws. List items share each card's aspect ratio, so the flat end pose equals the list item and the swap is a one-frame class change. Measure layout from `.orbit__sticky` — the list is `display:none` during the morph and measures 0×0. Items are rendered once and recycled by wrapping their offset; decorative copies are added only when the list is shorter than the screen. Reduced motion gets a static column.

## Screen-edge progress
`Frame.astro` renders `.edge-ruler` (invisible; CSS gives it the inset + each edge's safe area as padding and the corner radius as border-radius) and the `.edge-progress` SVG. `progress.ts` reads the ruler's computed padding/radius, draws one rounded-rectangle path starting at the top-left corner (clockwise or counter-clockwise), and sets `stroke-dashoffset` from scroll progress. The path stays inside the SVG's own width, so a desktop scrollbar never covers it. z-index 95: above the bar (90), below the menu (200).

## Orbit v2 centre media
`.orbit__media` sits inside `.orbit__world` (same preserve-3d context as the cards, so depth-sorting applies). Images/video are billboarded each frame with the inverse camera rotation (`rotateX(-sx) rotateY(-sy)`), including during the morph via `morph3d`'s `onFrame(k, cam)`; the cube is not billboarded. `.orbit__media-in` carries the shrink/grow (class `media-out`). The selected-card outline (`.orbit__focus`) is a single box driven by four springs (x, y, w, h). **Rule:** no `filter` on sphere cards at rest — filters inside a 3D scene flicker; the grayscale fade is scoped to `.is-morphing`.

## Tube marquee
`src/scripts/tbx.ts` is John's TBX engine, ported unchanged — do not edit the solver, the angle walk or the wrap decision without re-running `grxphjc-skill/references/tbx/fit_test.mjs`. `marquee-tbx/MarqueeTbx.astro` carries TBX's own base CSS wrapped in `:global()` (the ring's cells are built in JS, so Astro's scoping cannot reach them) plus the token mapping; `marquee-tbx.ts` mounts one instance per section from its `data-tbx-config`, then sizes the section to the tube: it reads back the engine's real radius, type size and perspective and computes the tallest the tilted, projected ring gets over a full turn, so it is never cut off. (The engine sizes the tube from the *window*, so the section height cannot feed back into it.)

## Gotchas worth knowing
- `backdrop-filter`, `transform` and `filter` on an ancestor trap `position: fixed` children. That's why overlays live at body level, not inside the bar.
- Astro scoped CSS raises selector specificity; a media-query override can lose to a base rule. Repeat the stronger selector.
- `package-lock.json` must stay committed (CI runs `npm ci`).
- Focusing a link inside an `overflow: hidden` box makes the browser scroll *that box*. Scroll-driven sections (pinned gallery, orbit v2 list) pin their containers' `scrollTop`/`scrollLeft` at 0.
- Components built in JS (TBX's ring, orbit v2 clones) need their CSS wrapped in `:global()` — Astro's scoping only reaches template elements.
