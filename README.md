# grxphjc

Personal portfolio — Astro static site with a Shopify-style block system. Every page (home, about, story, services, contact) and every project is a JSON list of blocks. Deploys to `https://jcreatvz.github.io/grxphjc/` via GitHub Actions. No server, database or auth.

```bash
npm install
npm run dev      # http://localhost:4321/grxphjc
npm run build    # → dist/
```

## Where things live

```
src/site.json                 brand, loader, frame labels, bottom bar, menu, cursor, footer
src/content/pages/*.json      block-built pages  (home.json → "/", about.json → "/about")
src/content/projects/*.json   case studies       (→ "/work/<slug>")
src/blocks/<type>/            content blocks     (Component.astro + schema.js)
src/blocks/shell/<type>/      chrome blocks      (logo, nav-links, menu-toggle, footer-*)
src/layout/                   Base, Frame, Bar, Menu, Loader, Lightbox, Cursor, Footer
src/scripts/                  client JS (one entry: main.ts)
src/styles/tokens.css         design tokens
public/images/placeholder/    placeholder frames — replace with real work
```

## Content blocks

`hero` · `gallery` · `orbit` · `statement` · `project-grid` · `metrics` · `list-rows` · `steps` · `marquee` · `cta` · `text`
Settings for each are listed in its `schema.js`. Any block can take `"anchor": "id"` to become a link target (e.g. `/#work`).

### Orbit (homepage hero)

```json
{ "type": "orbit", "settings": {
  "headline": "Experienced *n* Experimental",
  "source": "both",
  "projectAction": "popup",
  "items": [
    { "image": "/images/x.jpg", "title": "Frame", "meta": "Study — 2026",
      "note": "Shown in the popup", "action": "popup", "href": "/work/slug" }
  ]
}}
```

`action`: `popup` (lightbox; `href` adds a "View project" link) · `page` (navigates) · `url` (new tab).
`source`: `projects` (auto from case studies) · `manual` · `both`. `*word*` accents a word.

## Add things

- **Project:** new file in `src/content/projects/` with `title`, `slug`, `cover`, `summary`, `blocks`.
- **Page:** new file in `src/content/pages/` with `title`, `slug`, `blocks`. Add it to `site.json → menu.items`.
- **Block type:** `src/blocks/<type>/{Type.astro, schema.js}` + one line in `src/blocks/registry.js`.
- **Logo SVG:** paste the markup into `site.json → header.blocks[0].settings.svg`.

## Deploy

Push to `main`. One-time: repo **Settings → Pages → Source: GitHub Actions**.
