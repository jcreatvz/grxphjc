# grxphjc

Personal portfolio site. Self-contained Astro build with a Shopify-style block system: content lives as JSON files in `src/content/projects/`; each project renders as an ordered list of blocks (`hero`, `gallery`, …) declared in `src/blocks/`. Deploys as static HTML to GitHub Pages.

Deliberately no server, no database, no auth.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321/grxphjc
npm run build    # → dist/
npm run preview
```

## Structure

```
src/
├── content/projects/*.json     ← the content
├── blocks/<type>/
│   ├── <Type>.astro            ← render
│   ├── schema.js               ← settings (source of truth)
│   └── (style is scoped in the .astro file)
├── blocks/registry.js          ← type → component wiring
├── pages/
│   ├── index.astro             ← project index
│   └── work/[slug].astro       ← project page (block renderer)
├── layout/Base.astro
└── styles/tokens.css           ← placeholder tokens — replace with your look
```

## Add a project

Drop a new file in `src/content/projects/`, e.g. `my-project.json`:

```json
{
  "title": "My Project",
  "slug": "my-project",
  "client": "Acme",
  "year": 2026,
  "tags": ["motion"],
  "blocks": [
    { "type": "hero",    "settings": { "headline": "…", "align": "center" } },
    { "type": "gallery", "settings": { "layout": "grid", "images": ["…"] } }
  ]
}
```

The route `/work/my-project` builds itself on next `npm run build`.

## Add a block type

1. `src/blocks/<type>/schema.js` — settings array
2. `src/blocks/<type>/<Type>.astro` — render component
3. Add one line to `src/blocks/registry.js`

Nothing else changes. Existing projects still render.

## Deploy to GitHub Pages

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

One-time setup on GitHub:
1. Create a repo at `jcreatvz/grxphjc`.
2. Push this project.
3. **Settings → Pages → Source: GitHub Actions**.
4. First push runs the workflow; site appears at `https://jcreatvz.github.io/grxphjc/`.

### If you'd rather deploy at the user root later

Rename the repo to `jcreatvz.github.io`, then in `astro.config.mjs`:

```js
site: 'https://jcreatvz.github.io',
base: '/',
```

## Push it up

```bash
cd grxphjc
git init
git add .
git commit -m "Initial scaffold"
git branch -M main
git remote add origin git@github.com:jcreatvz/grxphjc.git
git push -u origin main
```

## What's intentionally not here yet

- Advanced motion (Framer Motion / GSAP / Lenis / R3F) — the split of Content / Presentation / Behaviour means these plug in as separate modules in `src/motion/` without touching content shape.
- `tools/editor.html` — a self-contained form UI generated from the block schemas. Placeholder file included; build it once hand-editing JSON gets old.
- Media pipeline. Sample projects point at `picsum.photos` placeholders; swap for local assets in `public/` or a CDN.
