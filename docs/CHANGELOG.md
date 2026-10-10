# Changelog

Dated entry per release. Newest first. See [`ROADMAP.md`](ROADMAP.md) for what's next.

## v0.10 — 2026-10-09 · Curtain footer (replaces the v0.9 height reveal)
- **The Nakula reveal.** The footer content scrolls normally; after it, `.site-footer__window` (in flow, `clip-path: inset(0)`) crops `.site-footer__panel` (`position: fixed; bottom: 0`), so scrolling *uncovers* a stationary accent panel with the GRXPHJC wordmark. All scroll-linked and reversible: the panel rises from 45% of its height, the wordmark settles from lift 90px / skew −6° / stretch 30%, smoothed with a 120ms lag. Settings: `site.json → footer.curtain` (John's values from the mock).
- **The overlap.** Panel height follows John's `.4em + bar + 44px` but is expressed relative to the wordmark (`.495em + bar + safe-area + 14px`), so the same ~55% of the letters shows above the curtain edge on every screen (verified 320px → 1920px and landscape). Wordmark size `clamp(64px, max(22vw, min(27vw, 120px)), 360px)` keeps it bold on phones and inside the gutters (the face's ink is ~3.18em wide); `margin-left: .12em` re-centres its ink.
- **Scoped variables.** All footer sizing variables live on `.site-footer`, not `:root` — nothing else can inherit or collide.
- **Watermark swap** fires once at 65% revealed and re-arms below 30%; hover `data-scramble` on footer links is untouched.
- **Overscroll.** At the very end the page background behind a bounce matches the panel; `body` now paints its own paper background so transparent sections never change colour.
- **Removed:** v0.9 height reveal, scroll assist, footer marker (still in git history; the mock-up keeps a "height" mode for comparison). The progress line measures the whole page again; page height never changes.
- Credits padding no longer reserves bottom-bar space (the panel follows).
- Mock-up (`public/mocks/footer-reveal-mock.html`) now defaults to the live settings with the same scoped, proportional formula.
- Tests: curtain formulas ±1px, 120ms lag, constant page height, swap once / re-arm / hysteresis, hover scramble intact, scoping (nothing on :root), no transformed ancestors, overscroll + pixel check, 10-size responsive sweep, reduced motion, short page; full regression (pinned gallery, logo, orbit, 27 pages × 5 widths, menu a11y, prefs, popup, media blocks, accents) green.

## v0.9 — 2026-10-09 · Polish round (tuned by John in mock-ups)
- **Footer reveal.** The footer sits at zero height and opens to its natural height when the end of the page is within 15% of a screen (650ms smooth/expo-out). At 65% open the watermark does one letter-swap (1100ms). Scrolling more than 45% of a screen away collapses it again; every approach repeats. Optional scroll assist (10%) nudges the page as it opens and yields instantly to an upward scroll. Keyboard focus inside the footer opens it and holds it open. Fully open → `height: auto`. No collapse with reduced motion or without JS; short pages start open. Settings: `site.json → footer.reveal`.
- **Orbit scroll explosion.** Each card has its own spring; scroll position sets how far it's pushed out along the centre→card line (up to 2.6× the radius), scroll *speed* adds a force, fast upward scroll squeezes inward, cards cascade, tumble and fade as they leave. Section is now 200svh (runway 100). All values are orbit block settings with John's numbers as defaults; `explosion: 0` turns it off.
- **Scramble speed knobs.** `data-scramble-ms="400"` per element, or `--scramble-ms` in CSS (global default `auto` in tokens.css). Built-in timing unchanged until declared.
- **Plus-marks** on metrics + project-meta hairlines: `--plus-x: -3.5px; --plus-y: -8.5px`.
- **Progress line** measures the content only, so footer height changes never move it.
- Shared `src/scripts/spring.ts` (same physics as the mock-ups). Debug read-outs with `?debug` in the URL.
- Mock-ups ship at `public/mocks/` (noindex) with John's settings as defaults, for re-tuning on any device.
- Tests: footer (thresholds, smooth curve, swap timing + letters, assist, collapse/reopen, focus, progress, reduced motion, short page, phone), orbit (runway, full spread, clearing, parity with the mock in four scroll scenarios), scramble knobs, plus-mark offsets; full regression (interactions 14, pinned/logo/overflow 27 pages × 5 widths, Step-3 blocks 21, accents) all pass.

## v0.8 — 2026-10-01 · Step 3: missing blocks
- **`video`** — self-hosted MP4 (+ optional WebM) with poster. `loop` mode: muted autoplay while ≥35% on screen, pauses when it leaves; reduced motion / data-saver gets poster + Play instead. `click` mode: poster + Play, plays with sound, native controls, pauses if scrolled away. Ratios 16:9 · 21:9 · 4:3 · 1:1 · 9:16; contained or full width; caption.
- **`embed`** — YouTube / Vimeo from any share link. A facade: nothing from either site loads until Play is clicked, then one privacy-mode iframe (`youtube-nocookie.com`, Vimeo `dnt=1`). The pasted URL is never used directly — only a validated ID goes into a URL we build. Unsupported links show a clear notice.
- **`quote`** — paper / accent / night backgrounds, left or centred, `*highlight*` words.
- **`credits`** — role / name list (optional links) + tools tags.
- **`project-meta`** — facts strip. Cell values accept `{client}`, `{year}`, `{category}`, `{title}`, with fallbacks: `{client|[Client]}`. Fills from the project's own fields as soon as they exist; empty cells hide.
- **`fullbleed-image`** — edge to edge; natural (uses the image's real shape) · cinema 21:9 (16:9 on phones) · screen; optional popup.
- `BlockRenderer` passes the project as `context` to every block.
- **All 21 project templates recomposed** with the new blocks. Dummy assets: 4-second loop (MP4 33 KB / WebM 18 KB), poster, three wide placeholders.
- **Fix:** `*accent*` highlights now work across several words (`*working together*`) — previously silently ignored. Shared `lib/accent.ts`.
- **Fix:** statement text wraps long words instead of overflowing 320px screens.
- Tests: embed URL parser (14 cases incl. hostile input), token fill, loop/click/pause/reduced-motion playback, facade → single iframe, all 21 project pages render, full-bleed shapes, overflow sweep (27 pages × 5 widths), pinned-gallery regression.

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
