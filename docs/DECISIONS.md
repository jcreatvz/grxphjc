# Decisions

Why things are the way they are. Newest first.

| Date | Decision | Why |
|---|---|---|
| 2026-10-09 | Curtain footer replaces the v0.9 height reveal entirely | John: "this should replace v0.9". Keeping both meant two footer layouts to maintain; v0.9 stays in git history and as a mock mode. |
| 2026-10-09 | Accent look (red panel, night wordmark) | John's pick in the mock. |
| 2026-10-09 | Panel height proportional to the wordmark | Keeps John's desktop overlap (~55% of the letters above the edge) identical on phones; his literal formula would show ~75% on phones. |
| 2026-10-09 | Footer variables scoped to `.site-footer` | John asked that nothing on `:root` affect other elements. |
| 2026-10-09 | `body` paints its own background | Lets the html canvas match the panel during overscroll without recolouring transparent sections (a bug caught in review). |
| 2026-10-09 | Prototype Nakula's curtain reveal as a mock-up before touching the site | The feel depends on scroll-linked, reversible motion — incompatible with the v0.9 time-based height reveal, so it needs a visual A/B first. |
| 2026-10-09 | Curtain mock keeps the v0.9 height mode as a selectable style | John can compare feel directly and revert if he prefers it. |
| 2026-10-09 | Ship John's mock-up settings verbatim as defaults | He tuned by feel; the live orbit was verified to reproduce the mock within ±0.03. |
| 2026-10-09 | Footer settings in `site.json`, orbit settings on the block | Footer is site chrome; the orbit is a block that can appear on any page with its own tuning. |
| 2026-10-09 | Footer fully open → `height: auto` | Stays correct when content reflows (fonts, resize) without re-measuring. |
| 2026-10-09 | Mock-ups kept in the repo under /mocks | Re-tuning on a phone later needs no rebuild of the mocks. |
| 2026-10-01 | Footer opens at the end of the page (15%), not 75% early | Collapsed footer = page can't scroll past its end; an early open animates below the fold where nobody sees it. |
| 2026-10-01 | Optional scroll assist on footer open | Lets the unroll be seen on a single wheel notch; cancels the instant the visitor scrolls up. |
| 2026-10-01 | Progress line measures content only, not footer | Footer height changes would jump the line. |
| 2026-10-01 | One spring helper shared by footer and orbit | Same feel everywhere; per-card springs for the orbit, one spring for the footer. |
| 2026-10-01 | Mock-ups before implementation | John prefers to review motion visually and tune by feel; settings copy straight into the build. |
| 2026-10-01 | Embeds are click-to-load facades | No third-party requests, cookies or weight until the visitor presses Play. |
| 2026-10-01 | Embed iframes built from a validated ID, never the pasted URL | Closes off injection and wrong-host embeds. |
| 2026-10-01 | Loop video: no autoplay for reduced motion / data-saver | Respects the visitor; poster + Play instead. |
| 2026-10-01 | Big reels live on Vimeo/YouTube; small loops self-hosted | GitHub Pages has size and bandwidth limits. |
| 2026-10-01 | `{field\|fallback}` tokens in project-meta | Templates carry placeholders that switch to real data without editing the block. |
| 2026-10-01 | Statement/quote parse multi-word `*accents*` | Single-word-only parsing silently dropped John-style phrases. |
| 2026-10-01 | Pinned frames: fill height, width from the image's ratio | John's call after Safari test — same as Chrome. |
| 2026-10-01 | Build-time image ratios instead of browser sizing | Removes the WebKit/Chrome difference and any mid-scroll layout change. |
| 2026-10-01 | No easing on touch for the pinned gallery | iOS momentum is already smooth; a second easing layer lagged the finger. |
| 2026-10-01 | Logo hover swaps its own letters | Random glyphs fell outside the brand font (digits/symbols fall back to Inter). |
| 2026-10-01 | Template project copy uses [brackets] for facts | Placeholder text must never read as a real claim about a client. |
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
