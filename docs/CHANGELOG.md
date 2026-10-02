# Changelog

Dated entry per release. Newest first. See [`ROADMAP.md`](ROADMAP.md) for what's next.

## v0.7 — 2026-10-01 · Step 2 fixes + project list
- **Safari / iPhone pinned gallery.** Root causes: frame width relied on intrinsic image sizing inside a percentage-height flex chain, which WebKit resolves differently (images sat letterboxed, frames wrong width); the strip width changed as images decoded, so the script re-measured and snapped mid-scroll (the glitch); iOS address-bar resizes triggered the same; easing layered on iOS momentum felt rubbery.
  Fixes: image ratios read at build time (`src/lib/media.ts`, `image-size`), every size explicit (`--pin-track-h` from 100svh minus chrome, frame width = height × ratio, image absolutely fills with `object-fit: cover`); re-measure only when a width/height actually changes and never snap; touch devices track scroll directly, mouse/trackpad keeps the glide; translate snapped to device pixels. Remote images get their ratio from the browser once.
- **Logo hover** swaps the logo's own letters (`data-scramble="swap"`) — every frame stays in the brand font.
- **21 projects** from John's list, in his order (`order` field), with a `category` label, template copy and [bracketed] fields. The old sample projects are gone. The orbit now shows only real projects; the home grid shows all 21 in 3 columns (`columns` setting on `project-grid`).
- CTA heading floor lowered to 44px — "something." overflowed 320px screens.
- Note: WebKit can't run in Claude's sandbox, so Safari fixes are verified by reasoning + Chromium tests; John re-tests on real Safari.

## v0.6 — 2026-10-01 · Type tweaks + pinned gallery
- **H1s** (orbit headline, hero headlines, split wordmark): `line-height: normal`, `letter-spacing: 0.5rem`. Tokens `--h1-leading` / `--h1-tracking`. Below 561px the tracking becomes `0.075em` — at a flat 0.5rem, "Experienced" and "Reimagined" ran off 320–414px screens.
- **No opacity on echo words:** the second word of split headlines is now a solid grey (`--ghost`, `--ghost-on-media`) instead of a translucent white. Entrance fade-ins still animate opacity but finish fully solid.
- **Footer watermark** uses the GW fill (solid `#1f1f1f`) instead of the outline cut. The outline font stays in the repo, unused and not downloaded.
- **Gallery `pinned-scroll` layout:** the section pins while vertical scroll slides the images sideways (eased). 01 / 05 counter + progress bar. Keyboard focus scrolls the page to the focused frame. Falls back to the native horizontal scroller with no JS or reduced motion. New setting `pinDistance` (scroll per horizontal pixel). The Nike case study now uses it; `/styleguide` shows both gallery styles.
- Parking lot: GSAP, Spline, Lottie, video/embeds, plus Claude's additions.

## v0.5 — 2026-09-30 · Brand font + docs foundation
- **Brand face:** GGGGG SpecialG (GW fill) on the bar logo and every page-level H1 (orbit headline, hero headlines, orbit grid title). GWOL outline cut on the footer watermark.
- Fonts converted OTF → WOFF2 and trimmed to Latin: 277 KB → 9 KB and 520 KB → 16 KB.
- Digits excluded from the brand face (the font only maps `0`, drawn blank), so numbers fall back to Inter instead of disappearing.
- `--font-h1` token: one line in `tokens.css` reverts H1s to Inter if ever needed.
- Metrics: **18+** years designing (home + about). Projects and clients counts still placeholder.
- Email: pages show `hello@grxphjc.com`; links send to `jcreatvz@gmail.com` via `site.json → contact` until email hosting is live. New optional `emailTo` setting on the `cta` block.
- `docs/` folder: roadmap, changelog, architecture, content guide, design system, decisions.
- `npm run docs` generates `docs/BLOCKS.md` from every `schema.js`.
- `/styleguide` page renders every block with sample data (hidden from nav, `noindex`).

## v0.4 — 2026-09-30 · Phase 2: block library + nav rebuild
- Pages are block-built JSON (`src/content/pages/`), same renderer as projects.
- **Orbit** 3D image-sphere homepage hero, adapted from the supplied `index.html` into a contained section. Items open a popup, a page or a URL; fed from projects + manual items; grid view; keyboard and reduced-motion fallbacks.
- New blocks: statement, project-grid, metrics, list-rows, steps, marquee, cta, text. Hero gains scroll cue; gallery gains lightbox + 2-column tablet step.
- Chrome recreated from the Webflow site recording: top progress frame with labels, fixed bottom bar with red-flood cells, blurred full-screen menu with Appearance controls, red-square intro loader.
- Shared lightbox (FLIP, arrow keys), scroll reveal, character scramble, crosshair cursor with Custom/Regular toggle.
- Fixes: menu clipped by the header's `backdrop-filter` (containing-block bug), invisible dark-header logo in dark mode, ghost-text contrast, focus trap + `inert`, scroll-lock layout shift, fluid gutter, breakpoint gaps.
- Verified: 5 breakpoints, both themes and accents, 14/14 interaction tests, zero console errors.

## v0.3 — 2026-09-25 · Phase 3: visual identity
- Grayscale palette + Signal Red (default) / Burnt Orange accent presets.
- Inter Variable + JetBrains Mono Variable, self-hosted.
- Type scale, motion tokens, plus-mark corners, bracketed section labels, numeric indexing, footer watermark.
- Theme + accent toggles persisted in localStorage with a no-flash init script.

## v0.2 — 2026-09-25 · Phase 1: site shell
- `site.json` global chrome, separate shell registry, header and footer as block regions.
- Per-page chrome overrides limited to modifier fields (Option A whitelist).
- Stub About / Contact / 404 pages.

## v0.1 — 2026-09-25 · Phase 0: foundation
- Astro 5 static site, block registry, JSON project content, hero + gallery blocks.
- GitHub Actions deploy to Pages under `/grxphjc/`.
- Fix: `package-lock.json` must be committed for `npm ci`.
