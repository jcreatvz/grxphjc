# Decisions

Why things are the way they are. Newest first.

| Date | Decision | Why |
|---|---|---|
| 2026-10-01 | Pinned gallery as a new layout, not a replacement | The drag-to-scroll gallery still has uses; pinned is opt-in per gallery. |
| 2026-10-01 | Pinned effect hand-written, not GSAP | ~100 lines, no dependency. Revisit when scroll-stories need timelines. |
| 2026-10-01 | H1 tracking drops to 0.075em on phones | A flat 0.5rem pushed long graffiti words off 320–414px screens. |
| 2026-10-01 | Echo words use solid shades, not opacity | Opacity washes out over photos and dark mode; a chosen shade stays predictable. |
| 2026-10-01 | Watermark in GW fill, solid dark shade | John's call; solid fill is bolder than the outline at the same size. |
| 2026-09-30 | Brand font on logo + H1s; outline cut on watermark | Logo delivered as a typeface, so the identity can carry into headlines. Outline reads better at low opacity. |
| 2026-09-30 | Exclude digits from the brand font | Font maps only `0` and draws it blank; fallback keeps numbers visible. |
| 2026-09-30 | Display hello@grxphjc.com, send to Gmail | No email hosting yet; one switch in `site.json` when it's live. |
| 2026-09-30 | Docs are part of "done" | So the roadmap never needs chat scrollback. |
| 2026-09-30 | Real content before motion | Motion tuned on placeholders gets redone. |
| 2026-09-30 | Chrome rebuilt from John's own Webflow site | It's his identity; Brokerwise stays in grid, type and footer. |
| 2026-09-30 | Orbit as default homepage hero | The special widget; contained in its own section so the page scrolls normally. |
| 2026-09-30 | Keep loader, drop intro film | Loader is signature and light; film was heavy and third-party-hosted. |
| 2026-09-30 | Crosshair cursor on by default, with a Regular switch | Fits the plus-mark system; switch for anyone who prefers native. |
| 2026-09-30 | Pages-as-blocks | Home/about/etc. become as flexible as projects. |
| 2026-09-25 | Visual identity before more blocks | Avoid designing every block twice. |
| 2026-09-25 | Grayscale + one accent | The work supplies the colour. |
| 2026-09-25 | Chrome overrides limited to modifiers (Option A) | Consistent chrome is the brand. |
| 2026-09-25 | Two block registries | Content and chrome blocks have different layout assumptions. |
| 2026-09-25 | Static Astro, git-backed JSON, no CMS/database | Zero hosting cost; git history is the content history. |
| 2026-09-25 | Not Webflow | Cost. |
