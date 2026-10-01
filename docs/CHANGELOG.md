# Changelog

Dated entry per release. Newest first. See [`ROADMAP.md`](ROADMAP.md) for what's next.

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
