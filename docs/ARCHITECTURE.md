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
One entry, `src/scripts/main.ts`, ~5 KB gzipped. Each module no-ops if its markup is absent: prefs, menu, scramble, reveal, progress, cursor, lightbox, marquee, orbit, pinned (scroll-driven gallery), loader. `focus.ts` holds the shared focus trap and scroll lock.

`src/layout/Base.astro` has an inline `<head>` script that sets theme, accent, cursor and the loader flag **before first paint** — keep it inline.

## Gotchas worth knowing
- `backdrop-filter`, `transform` and `filter` on an ancestor trap `position: fixed` children. That's why overlays live at body level, not inside the bar.
- Astro scoped CSS raises selector specificity; a media-query override can lose to a base rule. Repeat the stronger selector.
- `package-lock.json` must stay committed (CI runs `npm ci`).
