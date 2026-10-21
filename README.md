# grxphjc

Personal portfolio — an Astro static site with a Shopify-style block system. Every page and every project is a JSON list of blocks; the site chrome is configured in one JSON file. Deploys to <https://jcreatvz.github.io/grxphjc/> through GitHub Actions on every push to `main`. No server, database or login.

**Current version: v0.13** — see [`docs/CHANGELOG.md`](docs/CHANGELOG.md) for what changed and [`docs/ROADMAP.md`](docs/ROADMAP.md) for what's next.

```bash
npm install
npm run dev      # http://localhost:4321/grxphjc
npm run build    # → dist/
npm run docs     # regenerate docs/BLOCKS.md from every schema.js
```

## Docs

| File | Read it for |
|---|---|
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Where the project is, what's next, what's waiting on John |
| [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) | Editing pages, projects, images, video, footer, publishing |
| [`docs/BLOCKS.md`](docs/BLOCKS.md) | Every block and its settings (generated — don't hand-edit) |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Colours, type, spacing, motion |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the code fits together, and the traps |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Why things are the way they are |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Every release, newest first |

Hidden pages (not in the menu, not indexed): `/styleguide` (every block rendered) and `/orbit-v2` (orbit v2 preview).
Motion tuning tools: `/mocks/footer-reveal-mock.html` (curtain footer) and `/mocks/orbit-explode-mock.html` (orbit explosion) — each has a settings panel and a *Copy settings* button.

## Where things live

```
src/site.json                 brand, loader, frame labels, bottom bar, menu, cursor, footer (incl. curtain settings)
src/content/pages/*.json      block-built pages  (home.json → "/", about.json → "/about")
src/content/projects/*.json   case studies       (→ "/work/<slug>"; "order" sets the sequence)
src/blocks/<type>/            content blocks     (Component.astro + schema.js)
src/blocks/shell/<type>/      chrome blocks      (logo, nav-links, menu-toggle, footer-*)
src/layout/                   Base, Frame, Bar, Menu, Loader, Lightbox, Cursor, Footer
src/scripts/                  client JS — one entry, main.ts
src/scripts/motion/           shared motion toolkit (spring, damp, flip, morph3d)
src/lib/                      build-time helpers (url, media, projects, embed, tokens, accent)
src/styles/tokens.css         design tokens
public/images/placeholder/    placeholder frames — replace with real work
public/mocks/                 motion tuning tools
tools/                        docs generator; editor (not built yet)
```

## Content blocks (24)

`hero` · `gallery` · `orbit` · `orbit-v2` · `statement` · `project-grid` · `metrics` · `list-rows` · `steps` · `marquee` · `marquee-tbx` · `cta` · `text` · `video` · `embed` · `quote` · `credits` · `project-meta` · `fullbleed-image`

Settings for each: [`docs/BLOCKS.md`](docs/BLOCKS.md). Any block can take `"anchor": "id"` to become a link target (e.g. `/#work`).

## Add things

- **Project:** a new file in `src/content/projects/` with `title`, `slug`, `order`, `category`, `cover`, `summary`, `blocks`.
- **Page:** a new file in `src/content/pages/` with `title`, `slug`, `blocks` (add `"noindex": true` to hide it). Add it to `site.json → menu.items` to show it in the menu.
- **Block type:** `src/blocks/<type>/{Type.astro, schema.js}` + one line in `src/blocks/registry.js`, then `npm run docs`.

## Publish

Push to `main` and GitHub builds and deploys (about a minute). Step-by-step commands for Mac and PC are in [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md#publishing-a-new-version).
