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

## Orbit v2 (home page hero)
Same settings as `orbit` (headline, source, projectAction, explosion…), plus:

**Centre media** — something in the middle of the sphere. Cards pass in front of and behind it.
- `showHeadline`: `true`/`false` — the big headline. It sits *inside* the sphere, behind the centre media (cards and the cube pass in front of it). Headline and media can be on together, or either off.
- `headlineGlow`: `true`/`false` — a soft halo behind the letters for legibility over busy cards (off by default).
- `media`: `none` · `cube` (sample wireframe placeholder) · `image` · `video`.
- `mediaSrc`: the file. Put it in `public/media/` and write `/media/name.ext`, or use a full `https://` URL. Images: jpg, png, gif, svg, webp (transparent PNG/SVG look best — the sphere shows through). Video: mp4 (H.264) or webm; it plays muted on a loop while the sphere is on screen. Keep video short and small (a few MB).
- `mediaPoster`: a still for video (shown before it plays and for reduced-motion visitors).
- `mediaAlt`: describe it for screen readers, or leave empty if it's decorative.
- `mediaSize`: its width as a share of the sphere (0.15–0.7; default 0.36).
- Images and video always face the viewer; the cube turns with the sphere. When switching to Vertical the media grows 25% as it fades away, and shrinks back into place as the sphere returns.
- **3D objects (Spline):** coming next. Send Claude the scene's public URL (Spline → Export → Code → the link ending in `scene.splinecode`), the names of the objects to control, and what should drive them (sphere rotation, scroll, pointer).

**Vertical list** — `loops` (passes through the projects before the page moves on, default 2), `travel` (speed; higher = shorter section), `snap` (centre the nearest project when scrolling stops). The centred project is framed by accent `[ ]` brackets fixed at the centre of the screen (they resize to each card); once it has snapped, the cards above and below ease 2rem away from the brackets, closing again as you scroll; on screens 900px and wider a number + title column runs down the right, scrolling opposite to the images. Titles come from each project's `title`. `startView`: `sphere` or `vertical`.

## Tube marquee (`marquee-tbx`)
`words` ride a 3D cylinder. `preset`: `marquee` (drifts on its own, words wrap onto the tube) or `tube` (scroll-driven only, flat words). `height`: `band` (exactly as tall as the tube needs — measured, so it's never cut off) or `full` (at least a whole screen). `tone`: `auto` (default — the same background and ink as the sections around it, flipping with light/dark mode) / `contrast` (a band that stands out) / accent / ink / paper. Dividers always follow the accent colour. `divider`: `text` (a character), `svg` (paste inline SVG; blank uses a bundled sample) or `none`. `idleSpin` 0 turns the drift off. The solver measures every word in the real font and will condense, shrink or grow the ring so nothing ever overlaps — long words are safe.

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

## Scroll progress outline
`site.json → frame.progress`: `enabled`, `direction` (`clockwise` · `counter-clockwise`, both starting at the top-left corner), `thickness` (visible px, default 2), `inset` (px from the screen edge; 0 = on the edge), `radius` (corner rounding; 0 = square), `nub` (`true` puts a square dot on the tip).

## Publishing a new version
Claude sends a zip (e.g. `grxphjc-v0.12.zip`). Put it in the folder that holds your `repo` folder, open a terminal there, and paste **one block at a time** — never paste the `#` comment lines, or the terminal gets stuck at `quote>` (press **Ctrl+C** to get out).

**Mac (Terminal)** — the first line moves Terminal to the right folder, wherever it was:
```bash
cd ~/Downloads/Widgets/grxphjc
```
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

