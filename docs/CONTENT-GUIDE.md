# Content guide

How to change what's on the site without touching components. Every change: edit JSON → commit → push → live in about a minute.

## Edit a page
Open `src/content/pages/<page>.json`. Each item in `blocks` is one section, top to bottom. Reorder, remove or duplicate them freely. Settings for every block type: [`BLOCKS.md`](BLOCKS.md). See them all rendered at `/styleguide`.

## Add a page
1. Create `src/content/pages/my-page.json` with `title`, `slug`, `blocks`.
2. Add it to the menu: `src/site.json → menu.items` → `{ "label": "My Page", "href": "/my-page" }`.

## Add a project
Create `src/content/projects/my-project.json`:
```json
{
  "title": "My Project", "slug": "my-project",
  "client": "Client", "year": 2026,
  "cover": "/images/my-project/cover.jpg",
  "summary": "One line — shown in the orbit popup and project grid.",
  "blocks": [ { "type": "hero", "settings": { "headline": "My Project" } } ]
}
```
It appears automatically in the homepage orbit and project grid, and gets its own page at `/work/my-project`.

For a dark full-bleed photo hero, add `"header": { "theme": "dark", "transparent": true }` and give the hero a `media` image.

## Project order and category
Each project has `"order"` (1 = first in the grid and orbit) and `"category"` (the small label under the title, e.g. "Collab", "Typeface"). Categories in the template projects are guesses — check them.

## Images
Image proportions are read automatically at build time, so galleries size each frame to its real shape. Nothing to set.
Put files in `public/images/<project-slug>/` and reference them as `/images/<project-slug>/01.jpg`. Placeholders live in `public/images/placeholder/` — delete them once replaced.

## Homepage orbit items
In `src/content/pages/home.json`, the orbit's `items` list takes:
`{ "image", "title", "meta", "note", "action": "popup | page | url", "href", "tall" }`
- `popup` opens the lightbox; adding `href` puts a "View project" link inside it.
- `page` navigates to an internal page. `url` opens an external link in a new tab.
- Projects with a `cover` are added automatically (`"source": "both"`).

## Gallery that scrolls sideways as you scroll down
In any `gallery` block set `"layout": "pinned-scroll"`. The section pins to the screen and the images slide sideways as the visitor scrolls down, with a counter and progress bar. `"pinDistance"` sets how much scrolling it takes (1 = one pixel of scroll per pixel of travel; 1.5 = slower, longer). Use 4–10 images; with only one or two it won't pin. `"horizontal-scroll"` (with `"behavior": "drag"`) is the older drag-to-scroll version.

## Accent words
In `statement`, `quote` and the orbit headline, wrap one or several words in asterisks: `Experienced *n* Experimental`, `about *working together* goes here`.

## Video, embeds, quotes, credits, meta strip, full-bleed
All settings: [`BLOCKS.md`](BLOCKS.md). See each rendered at `/styleguide`.

**Video file** (`video` block) — keep clips short (loops under ~10 s, ~1–3 MB). Put files in `public/media/`. Export an MP4 for every browser and an optional smaller WebM:
```bash
ffmpeg -i input.mov -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4
ffmpeg -i input.mov -vf scale=1920:-2 -c:v libvpx-vp9 -crf 34 -b:v 0 -an out.webm
```
(`-an` drops audio — right for loops. For `click` mode with sound, remove it.) Always add a `poster` image: it shows before play and on slow connections. **Full reels belong on Vimeo or YouTube** — use the `embed` block.

**Embed** — paste any normal YouTube or Vimeo share link in `url`; add a `poster` image. Nothing loads from YouTube/Vimeo until a visitor presses Play.

**project-meta** — cells like `{ "label": "Client", "value": "{client|[Client]}" }`. Add `"client"` / `"year"` to the project JSON and the strip fills itself; the text after `|` is only a fallback. Tokens: `{client}` `{year}` `{category}` `{title}`. A cell with no value is hidden.

**quote** — `tone`: `paper` · `accent` · `night`; `align`: `left` · `center`.
**credits** — `items` `{ role, name, href? }` plus `tools` tags.
**fullbleed-image** — `height`: `natural` (image's own shape) · `cinema` (21:9; 16:9 on phones) · `screen`. Use wide images (about 2400 px across).

## Footer reveal
`src/site.json → footer.reveal`: `enabled`, `triggerPct` (opens when the end of the page is within this % of a screen), `closePct` (collapses when farther than this), `assist` + `assistPct` (nudge the page as it opens — values under ~12% land under the bottom bar), `motion` (`smooth` uses `smoothMs`; `spring` uses `stiffness` + `bounce`), `scrambleMs`, `scrambleAt` (% open when the watermark swap starts). Set `enabled: false` for a normal static footer. Re-tune by feel at `/mocks/footer-reveal-mock.html` and paste the copied values here.

## Orbit explosion
On the `orbit` block: `explosion` (max spread; `0` = off), `burst` (extra spread from scroll speed), `stiffness`, `bounce` (1 = no bounce), `variation`, `stagger`, `tumble`, `fade`, `squeeze`, `runway` (svh of scrolling while pinned). Re-tune at `/mocks/orbit-explode-mock.html`.

## Scramble speed
Hover-scramble timing: add `data-scramble-ms="400"` to a `[data-scramble]` element, or set `--scramble-ms: 400` in CSS for a whole area (`:root` for everything). `auto` keeps the built-in timing.

## Contact email
`src/site.json → contact`:
- `email` — what visitors see (`hello@grxphjc.com`)
- `mailto` — where links actually send (`jcreatvz@gmail.com` for now)

When email hosting is live, set `mailto` to `hello@grxphjc.com`.

## Chrome text
`src/site.json`:
- `frame.left` / `frame.right` — top labels ("2026", "Dad Designer")
- `loader.coords` / `loader.lines` — intro text
- `menu.signature` — "JC by design"
- `footer` — footer columns and credits line
