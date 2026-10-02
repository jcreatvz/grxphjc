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
| `src/content/pages/<slug>.json` | `/<slug>` (about, story, services, contact, styleguide) |
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
| Top frame | `layout/Frame.astro` | scroll-progress line, `frame.left` / `frame.right` labels |
| Bottom bar | `layout/Bar.astro` | first shell block left, rest as equal cells; cells hide ≤720px |
| Menu | `layout/Menu.astro` | rendered at **body level** — see gotcha below |
| Loader | `layout/Loader.astro` | once per session, skippable, off for reduced motion |
| Lightbox | `layout/Lightbox.astro` | any `[data-lb]` element opens it |
| Cursor | `layout/Cursor.astro` | fine pointers only, toggle in the menu |
| Footer | `layout/Footer.astro` | watermark + footer shell blocks |

## Client JavaScript
One entry, `src/scripts/main.ts`, ~5 KB gzipped. Each module no-ops if its markup is absent: prefs, menu, scramble, reveal, progress, cursor, lightbox, marquee, orbit, pinned (scroll-driven gallery), video (loop/click playback + embed facades), loader. `focus.ts` holds the shared focus trap and scroll lock.

`src/layout/Base.astro` has an inline `<head>` script that sets theme, accent, cursor and the loader flag **before first paint** — keep it inline.

## Build-time helpers
- `src/lib/url.ts` — `href()` base-path resolver.
- `src/lib/media.ts` — `aspectOf(src)` reads local image dimensions (EXIF-aware) so layouts size frames explicitly.
- `src/lib/projects.ts` — `getProjects()` (sorted by `order`, then year, then title) and `projectMeta()` ("Category — Year").
- `src/lib/embed.ts` — `parseEmbed(url)`: YouTube/Vimeo URL → validated, privacy-mode embed src (or null).
- `src/lib/tokens.ts` — `fill("{client|[Client]}", project)` token filler used by project-meta.
- `src/lib/accent.ts` — `parseAccent(text)`: `*word*` / `*several words*` highlight flags.
- `src/lib/bleed.ts` — whether a page's first block runs under the top frame.

## Gotchas worth knowing
- `backdrop-filter`, `transform` and `filter` on an ancestor trap `position: fixed` children. That's why overlays live at body level, not inside the bar.
- Astro scoped CSS raises selector specificity; a media-query override can lose to a base rule. Repeat the stronger selector.
- `package-lock.json` must stay committed (CI runs `npm ci`).
