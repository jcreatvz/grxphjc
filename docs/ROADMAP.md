# grxphjc — Roadmap

> Last updated: **2026-10-21** · Current version: **v0.12** · Live: <https://jcreatvz.github.io/grxphjc/>
>
> One page, three questions: **what's done**, **what's next**, **what's waiting on John**.
> The full history of every release is in [`CHANGELOG.md`](CHANGELOG.md); the reasons behind choices are in [`DECISIONS.md`](DECISIONS.md).

## Where we are

The site is built and live: block system, chrome, 24 content blocks, 23 project pages (template copy), curtain footer, 3D orbit hero, tube marquee. **Orbit v2** (sphere + bokid-style vertical list) is built and waiting on John's review at `/grxphjc/orbit-v2` (hidden page). After that the work is **real content**.

## Done

| Ver | Date | What shipped |
|---|---|---|
| v0.1 | 2026-09-25 | Foundation — Astro static site, block registry, JSON content, GitHub Pages deploy |
| v0.2 | 2026-09-25 | Site shell — `site.json` chrome, shell blocks, per-page chrome modifiers |
| v0.3 | 2026-09-25 | Visual identity — palette, Inter + JetBrains Mono, tokens, theme + accent toggles |
| v0.4 | 2026-09-30 | Block library + nav — orbit hero, 8 blocks, lightbox, reveal, scramble, cursor, frame, bar, menu, loader |
| v0.5 | 2026-09-30 | Brand font (logo, H1s, watermark), `docs/`, generated block reference, `/styleguide` |
| v0.6 | 2026-10-01 | Type tweaks + pinned-scroll gallery |
| v0.7 | 2026-10-01 | Safari/iPhone gallery fix, logo letter-swap, 21 template project pages |
| v0.8 | 2026-10-01 | `video` · `embed` · `quote` · `credits` · `project-meta` · `fullbleed-image` |
| v0.9 | 2026-10-09 | Orbit scroll explosion, scramble speed knobs, plus-mark tokens *(its footer reveal was replaced in v0.10)* |
| v0.10 | 2026-10-09 | Curtain footer (Nakula-style) |
| v0.11 | 2026-10-21 | `marquee-tbx` tube marquee on the home page; The Centers + Graphics Kit projects |
| v0.12 | 2026-10-21 | **Orbit v2** (preview page) · tube never cut off · `scripts/motion/` toolkit · docs cleanup |

## Now

### ◐ Orbit v2 — review, then swap into the home page
Built and tested; on the hidden page `/grxphjc/orbit-v2` so it can be felt before it replaces v1.
- [ ] John reviews on desktop, Safari and iPhone (pin, two loops, snap, morph)
- [ ] Tune if needed: `loops`, `travel` (speed), `snap`
- [ ] Swap: change the home page's `orbit` block to `orbit-v2`; delete the preview page

## Next — in order

### ☐ Real content
Swap placeholders for real work, one project at a time. Per project John supplies: cover + frames (wide frames for full-bleed), video file or link, role / year / client / deliverables, a short brief, quote + credits if any. Claude fills the JSON and adjusts the blocks.

### ☐ Motion layer
- [ ] Lenis smooth scroll (then set `EASE = 1` in `src/scripts/pinned.ts` so the two smoothings don't stack)
- [ ] Page transitions between projects (Astro View Transitions)
- [ ] Entrance-motion presets per block (`reveal: fade | rise | mask | none`)
- [ ] Move remaining motion (reveal, scramble, scroll progress) into `src/scripts/motion/`

### ☐ Production polish
- [ ] Favicon + app icons · Open Graph images + SEO meta · image optimisation (Astro `<Image>`)
- [ ] Custom domain (if grxphjc.com is registered) · analytics (optional)
- [ ] Accessibility audit (Lighthouse + keyboard pass)

### ☐ Editor tool
Form-based editor (`tools/editor.html`) generated from each block's `schema.js`, writing JSON. Last on purpose — schemas still change while real content arrives.

## Waiting on John

| Item | Needed for |
|---|---|
| Orbit v2 review (see *Now*) | Swapping it into the home page |
| Per project: cover, frames, video link, write-up, role, year, client | Real content |
| Shipped-projects and clients counts (placeholders: 140 and 38) | Real content |
| Bio, story and services copy | Real content |
| Social handles | Real content |
| Email hosting for hello@grxphjc.com | Switch `site.json → contact.mailto` |
| Confirm the GGGGG SpecialG font licence covers web use | Public launch |

## Parking lot
Ideas noted, not scheduled.
- **GSAP** — free incl. all plugins; load per block (dynamic import) for scroll-story sections. Pairs with Lenis.
- **Spline `scene` block** — lazy-loaded, poster fallback on phones / reduced motion, one per page.
- **Lottie `lottie` block** — dotLottie player, autoplay-loop or scroll-linked.
- **Hover-to-play** video previews on project cards and orbit items. Host reels on Vimeo / Cloudflare Stream / R2, not in the repo.
- **TBX demo 2** — the double-ring sibling of the tube marquee (John's plan).
- Barcode ornament per project · pixel icon set · numeric 0–9 roll intro.

## Definition of done (every release)
1. Built and verified — interaction tests pass, screenshots reviewed, zero console errors.
2. `npm run docs` if any block schema changed.
3. `CHANGELOG.md` entry; this roadmap updated.
