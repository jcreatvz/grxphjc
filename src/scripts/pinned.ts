// Pinned horizontal gallery: vertical scroll drives a sideways slide.
// The section is a tall runway; its stage is position:sticky; the track is translated.
//   runway = horizontal overflow x pinDistance   ·   progress = scrolled / runway
//
// Safari hardening (v0.7):
//  - Frame sizes are explicit in CSS (build-time ratios), so the strip width is final on
//    first paint and never changes mid-scroll as images decode.
//  - measure() only acts when a width/height it depends on really changed, and never snaps
//    the position. iOS fires resize events as the address bar collapses; those are ignored
//    because the stage is sized in svh and the widths don't change.
//  - Touch (coarse pointer): EASE = 1 — the strip tracks iOS momentum scrolling directly.
//    An extra easing layer on top of native momentum is what felt rubbery/glitchy.
//  - Mouse/trackpad: keep the eased glide John liked in Chrome. Set to 1 when Lenis lands.
//  - Translate snapped to device pixels so images stay crisp in WebKit while moving.
const EASE = matchMedia('(pointer: coarse)').matches ? 1 : 0.14;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function initPinnedGalleries() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS falls back to native scroller
  document.querySelectorAll<HTMLElement>('.gallery[data-layout="pinned-scroll"]').forEach(setup);
}

function setup(sec: HTMLElement) {
  const stage = sec.querySelector<HTMLElement>('.gallery__stage')!;
  const track = sec.querySelector<HTMLElement>('.gallery__track')!;
  const items = [...track.querySelectorAll<HTMLElement>('.gallery__item')];
  const cur = sec.querySelector<HTMLElement>('[data-pin-current]');
  const bar = sec.querySelector<HTMLElement>('[data-pin-bar]');
  const ratio = parseFloat(sec.dataset.pinRatio || '1') || 1;
  const dpr = () => window.devicePixelRatio || 1;
  const pad = (n: number) => String(n).padStart(2, '0');
  let distance = 0, runway = 0, x = 0, visible = false, running = false, first = true, active = -1;
  let centers: number[] = [];
  let sw = -1, tw = -1, sh = -1;

  const measure = () => {
    const nsw = stage.clientWidth, ntw = track.offsetWidth, nsh = stage.offsetHeight;
    if (nsw === sw && ntw === tw && nsh === sh) return; // nothing that matters changed
    sw = nsw; tw = ntw; sh = nsh;
    distance = Math.max(0, tw - sw);
    runway = distance * ratio;
    centers = items.map((it) => it.offsetLeft + it.offsetWidth / 2);
    sec.classList.toggle('is-static', distance <= 1);
    sec.style.setProperty('--pin-h', `${Math.round(sh + runway)}px`);
    kick();
  };

  const frame = () => {
    if (!visible) { running = false; return; }
    const top = sec.getBoundingClientRect().top;
    const p = runway > 0 ? clamp(-top / runway, 0, 1) : 0;
    const target = -p * distance;
    x = first || EASE >= 1 ? target : x + (target - x) * EASE;
    if (Math.abs(target - x) < 0.1) x = target;
    first = false;
    const k = dpr(), px = Math.round(x * k) / k;
    track.style.transform = `translate3d(${px}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    if (cur && centers.length) {
      const mid = -x + sw / 2;
      let best = 0, bd = Infinity;
      for (let i = 0; i < centers.length; i++) { const d = Math.abs(centers[i] - mid); if (d < bd) { bd = d; best = i; } }
      if (best !== active) { active = best; cur.textContent = pad(best + 1); }
    }
    requestAnimationFrame(frame);
  };
  const kick = () => { if (visible && !running) { running = true; requestAnimationFrame(frame); } };

  // Remote images have no build-time ratio: set it from the decoded image, once.
  track.querySelectorAll<HTMLElement>('[data-ar-auto]').forEach((it) => {
    const img = it.querySelector('img'); if (!img) return;
    const set = () => { if (img.naturalWidth) { it.style.setProperty('--ar', String(img.naturalWidth / img.naturalHeight)); it.removeAttribute('data-ar-auto'); measure(); } };
    img.complete ? set() : img.addEventListener('load', set, { once: true });
  });

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }, { rootMargin: '300px 0px' }).observe(sec);
  new ResizeObserver(measure).observe(stage);
  let t = 0; addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(measure, 120); });
  document.fonts?.ready.then(measure);
  measure();

  // Keyboard: tabbing to an off-screen frame scrolls the PAGE to where that frame is visible.
  track.addEventListener('focusin', (e) => {
    const it = (e.target as HTMLElement).closest<HTMLElement>('.gallery__item');
    if (!it || distance <= 0) return;
    const left = it.offsetLeft + x, w = it.offsetWidth;
    if (left >= 0 && left + w <= sw) return;
    const need = clamp(it.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || '0'), 0, distance);
    const secTop = sec.getBoundingClientRect().top + scrollY;
    scrollTo({ top: secTop + (need / distance) * runway, behavior: 'auto' });
  });
  // Browsers without overflow:clip could scroll the stage sideways on focus — undo it.
  stage.addEventListener('scroll', () => { stage.scrollLeft = 0; });
}
