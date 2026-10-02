# grxphjc — Roadmap

> Single source of truth for where the project is and what's next.
> Updated at the end of every step. Dates are when work shipped (pushed to `main`).
> Last updated: **2026-10-01** · Current version: **v0.7**

**Live:** https://jcreatvz.github.io/grxphjc/ · **Repo:** https://github.com/jcreatvz/grxphjc

---

## Where we are

```
DONE  ██████████████████░░░░░░░░░░░░  Phases 0 · 1 · 3 · 2 + brand font + docs + pinned gallery + Safari fixes + 21 project shells
NEXT  → Step 2: John re-tests the pinned gallery in Safari (desktop + iPhone) on v0.7
```

---

## Done

| Ver | Date | Phase | What shipped |
|---|---|---|---|
| v0.1 | 2026-09-25 | **0 · Foundation** | Astro static site, block registry, JSON content, hero + gallery blocks, GitHub Pages deploy |
| v0.2 | 2026-09-25 | **1 · Site shell** | `site.json` chrome config, shell registry, header/footer as blocks, per-page chrome overrides (whitelist), stub pages |
| v0.3 | 2026-09-25 | **3 · Visual identity** | Grayscale + Signal Red / Burnt Orange, Inter + JetBrains Mono, tokens, plus-marks, bracketed labels, numeric indexing, theme + accent toggles |
| v0.4 | 2026-09-30 | **2 · Block library + nav rebuild** | Pages-as-blocks · orbit 3D hero · statement, project-grid, metrics, list-rows, steps, marquee, cta, text · lightbox · scroll reveal · scramble · crosshair cursor · Webflow-recreated frame, bottom bar, menu and red-square loader · audit fixes |
| v0.5 | 2026-09-30 | **Brand font + docs foundation** | GGGGG SpecialG on logo, page H1s and footer watermark (outline cut) · 18+ years · email shows hello@grxphjc.com, sends to Gmail · `docs/` folder · auto-generated block reference · `/styleguide` page |
| v0.6 | 2026-10-01 | **Type tweaks + pinned gallery** | H1s: line-height normal, 0.5rem tracking (scales down on phones), solid-shade echo words instead of opacity · footer watermark in GW fill · gallery `pinned-scroll` layout: vertical scroll slides the images sideways, eased, with counter + progress bar |
| v0.7 | 2026-10-01 | **Step 2 fixes + project list** | Safari/iPhone pinned-gallery fix (explicit frame sizing from real image ratios, no mid-scroll re-measure, direct tracking on touch) · logo hover swaps its own letters · 21 project pages with template content, in John's order, with categories · 3-column project grid · CTA heading fits 320px |

Full detail per release: [`CHANGELOG.md`](CHANGELOG.md)

---

## Next — in order

Each step is done only when its docs are updated (see *Definition of done* below).

### ◐ Step 2 · Real-device QA — *in progress*
So far everything was tested in headless Chromium only. John tests on real hardware; Claude fixes what turns up.

- [x] Safari on MacBook — all good except the pinned gallery (2026-10-01) → fixed in v0.7, **re-test**
- [x] iPhone Safari — same pinned-gallery issue (2026-10-01) → fixed in v0.7, **re-test**
- [x] Chrome / Firefox — passed (2026-10-01)
- [x] Brand font renders on all three (2026-10-01)
- [x] Logo hover swaps its own letters instead of random characters (v0.7)
- [ ] **Re-test pinned gallery** on Safari desktop + iPhone: smooth scroll, frames proportional (fill height, width from each image's ratio — John's call 2026-10-01)
- [x] H1 letter-spacing on a real phone — good (2026-10-01)
- [ ] Send screenshots or a screen recording of anything off

**Owner:** John (testing) → Claude (fixes) · **Blocked on:** nothing

### ☐ Step 3 · Missing blocks for a motion portfolio
The site can't show a reel yet — the biggest gap for a motion designer.

- [ ] `video` — self-hosted MP4/WebM with poster, autoplay-muted loop or click-to-play
- [ ] `embed` — Vimeo / YouTube, lazy-loaded, privacy-friendly
- [ ] `quote` — testimonial or pull quote
- [ ] `credits` — role / team / tools list for case studies
- [ ] `project-meta` — client, year, role, deliverables strip
- [ ] `fullbleed-image` — edge-to-edge single frame

**Owner:** Claude · **Blocked on:** nothing

### ☐ Step 4 · Phase 5 — Real content
Swap placeholders for real work. Content pressure shows which blocks are still missing.

**Started v0.7:** 21 project pages exist (John's titles and order) with template copy; every factual field is in [brackets].

**Owner:** John (assets) → Claude (build) · **Blocked on:** John — see *Owed by John*

### ☐ Step 5 · Phase 4 — Motion layer
- [ ] Lenis smooth scroll (tuned around the orbit scroll-dive and sticky sections)
- [ ] Page transitions between projects
- [ ] Entrance-motion polish per block

**Owner:** Claude · **Blocked on:** Step 4 (motion is tuned on real content, not placeholders)

### ☐ Step 6 · Phase 7 — Production polish
- [ ] Favicon + app icons
- [ ] Open Graph / social share images, SEO meta
- [ ] Image optimisation (Astro `<Image>`)
- [ ] Custom domain (if grxphjc.com is registered)
- [ ] Analytics (optional)
- [ ] Accessibility audit (Lighthouse + keyboard pass)

**Owner:** Claude · **Blocked on:** Step 4 for OG images

### ☐ Step 7 · Phase 6 — Editor tool
Form-based editor (`tools/editor.html`) generated from each block's `schema.js`, writes JSON. Last on purpose — schemas will still change while real content arrives.

**Owner:** Claude · **Blocked on:** Steps 3–4

---

## Owed by John

| Item | Status | Needed for |
|---|---|---|
| Project list | ✅ 21 titles received 2026-10-01 — template pages built | Step 4 |
| Per project: cover, frames, reel/video links, write-up, role, year, client, category check | ⏳ John to brief | Step 4 |
| Shipped-projects count and brands/clients count (currently placeholder 140 and 38) | ⏳ double-checking | Step 4 |
| Bio, story and services copy (current text is placeholder) | ⏳ | Step 4 |
| Social handles (Instagram etc.) | ⏳ | Step 4 |
| Email hosting for hello@grxphjc.com | ⏳ not set up | Switch `site.json → contact.mailto` |
| Confirm font licence covers web use (GGGGG SpecialG) | ⏳ | Public launch |
| Real-device testing | ⏳ | Step 2 |
| ~~Logo~~ → delivered as font files | ✅ 2026-09-30 | — |

---

## Parking lot
Ideas noted but not scheduled. **Added 2026-10-01** items include Claude's take.

### Motion & embeds (John's ideas, 2026-10-01)
- **GSAP** — *Take: yes, selectively.* Free including every plugin (SplitText, ScrollTrigger, Flip…), commercial use included — verified 2026-10-01. Best for scroll-pinned storytelling sections, headline reveals and timelines. Load it per block (dynamic import) so pages that don't need it stay light. Natural pair: Lenis smooth scroll + ScrollTrigger. The orbit and pinned gallery are hand-written and can stay that way.
- **Spline `scene` block** — *Take: great fit, with a budget.* Embed with Spline's runtime/viewer; drive objects from scroll progress, pointer or visibility via Spline variables/events (to confirm in John's Spline file which events exist). Rules: lazy-load when near the viewport, poster image fallback for phones / reduced motion / data-saver, one scene per page.
- **Lottie `lottie` block** — *Take: easy win.* dotLottie player, autoplay-loop or scroll-linked; reduced motion shows the first frame.
- **Video everywhere** — `video` + `embed` are already Step 3. Extras: muted looping video as section backgrounds, hover-to-play previews on project cards and orbit items. Host reels on Vimeo / Cloudflare Stream / R2, not in the repo — GitHub Pages has site-size and bandwidth limits.

### Claude's additions
- **View Transitions** (built into Astro) for page-to-page transitions — Phase 4 candidate.
- **Motion presets** per block (`reveal: fade | rise | mask | none`) with reduced-motion fallbacks built in.
- **Performance budget:** heavy libraries (GSAP, Spline, Lottie) only load on pages that use them. Homepage JS is ~5 KB today; keep it lean.
- **Scroll-story block:** pinned sections with steps — where GSAP ScrollTrigger earns its place.
- When Lenis lands, set `EASE = 1` in `src/scripts/pinned.ts` so the two smoothings don't stack.

### Older
- Barcode-style ornament per project (from Brokerwise inspo)
- Original pixel icon set (using `+ × →` glyphs for now)
- Numeric 0–9 roll loading intro (the red-square loader may cover this)

---

## Definition of done (every step)

1. Built and verified (screenshots at 375 / 768 / 1024 / 1440 / 1920, interaction tests pass, zero console errors)
2. `npm run docs` re-run if any block schema changed
3. `CHANGELOG.md` entry added
4. This roadmap ticked and dated
5. Claude skill (`grxphjc-portfolio`) progress log updated
