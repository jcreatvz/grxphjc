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

## Footer curtain
`src/site.json → footer.curtain`: `enabled`, `look` (`accent` | `ghost`), `parallax` (% of the panel's height it rises from), `lag` (smoothing, ms), `lift` (px) / `stretch` (%) / `skew` (°) — the wordmark's starting pose, `ease` (`linear` | `out` | `inout`), `height` (panel height %), `scrambleMs`, `scrambleAt` (% revealed when the letter-swap fires), `rearm` (% it must drop below before it can fire again). Re-tune by feel at `/mocks/footer-reveal-mock.html` (curtain mode) and paste the values here.

## Orbit explosion
On the `orbit` block: `explosion` (max spread; `0` = off), `burst` (extra spread from scroll speed), `stiffness`, `bounce` (1 = no bounce), `variation`, `stagger`, `tumble`, `fade`, `squeeze`, `runway` (svh of scrolling while pinned). Re-tune at `/mocks/orbit-explode-mock.html`.

## Scramble speed
Hover-scramble timing: add `data-scramble-ms="400"` to a `[data-scramble]` element, or set `--scramble-ms: 400` in CSS for a whole area (`:root` for everything). `auto` keeps the built-in timing.

## Orbit v2
Same settings as `orbit` (headline, source, projectAction, explosion…), plus the list view: `loops` (passes through the projects before the page moves on, default 2), `travel` (list speed — higher makes the section shorter), `snap` (centre the nearest project when scrolling stops). On screens 900px and wider a number + title column runs down the right, scrolling opposite to the images; phones show the title on the centred image instead. Titles come from each project's `title`. `startView`: `sphere` or `vertical`. Preview: `/orbit-v2`. To use it on the home page, change the home page's `"type": "orbit"` to `"orbit-v2"`.

## Tube marquee (`marquee-tbx`)
`words` ride a 3D cylinder. `preset`: `marquee` (drifts on its own, words wrap onto the tube) or `tube` (scroll-driven only, flat words). `height`: `band` (exactly as tall as the tube needs — measured, so it's never cut off) or `full` (at least a whole screen). `tone`: accent / ink / paper. `divider`: `text` (a character), `svg` (paste inline SVG; blank uses a bundled sample) or `none`. `idleSpin` 0 turns the drift off. The solver measures every word in the real font and will condense, shrink or grow the ring so nothing ever overlaps — long words are safe.

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

## Publishing a new version
Claude sends a zip (e.g. `grxphjc-v0.12.zip`). Put it in the folder that holds your `repo` folder, open a terminal there, and paste **one block at a time** — never paste the `#` comment lines, or the terminal gets stuck at `quote>` (press **Ctrl+C** to get out).

**Mac (Terminal):**
```bash
rm -rf /tmp/grx-unzip && unzip -q grxphjc-v0.12.zip -d /tmp/grx-unzip
```
```bash
[ -d repo/.git ] && git -C repo pull || git clone https://github.com/jcreatvz/grxphjc.git repo
```
```bash
rsync -a --delete --exclude .git /tmp/grx-unzip/grxphjc/ repo/
```
```bash
cd repo && git add -A && git commit -m "v0.12" && git push
```

**PC (PowerShell):**
```powershell
Remove-Item -Recurse -Force "$env:TEMP\grx-unzip" -ErrorAction SilentlyContinue; Expand-Archive -Path .\grxphjc-v0.12.zip -DestinationPath "$env:TEMP\grx-unzip"
```
```powershell
if (Test-Path .\repo\.git) { git -C .\repo pull } else { git clone https://github.com/jcreatvz/grxphjc.git repo }
```
```powershell
robocopy "$env:TEMP\grx-unzip\grxphjc" .\repo /MIR /XD .git /NFL /NDL /NJH /NJS
```
```powershell
cd repo; git add -A; git commit -m "v0.12"; git push
```

If `git pull` says you have local changes (e.g. edits made in VS Code), stop and send Claude the output of `git status` before continuing — the copy step would overwrite them. After pushing, the run at `github.com/jcreatvz/grxphjc/actions` goes green in about a minute; hard-refresh the site (Cmd/Ctrl+Shift+R).

