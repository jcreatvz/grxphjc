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

## Accent a word
In `statement` text and the orbit headline, wrap a word in asterisks: `Experienced *n* Experimental`.

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
