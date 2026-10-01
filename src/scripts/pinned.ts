// Pinned horizontal gallery: vertical scroll drives a sideways slide.
// The section is a tall runway; its stage is position:sticky; the track is translated.
//   runway = horizontal overflow x ratio   ·   progress = scrolled / runway
// Eased with a lerp so it glides instead of tracking the wheel 1:1. When Lenis lands
// (Phase 4) set EASE = 1 so the two smoothings don't stack.
const EASE = 0.14;
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
  let distance = 0, runway = 0, x = 0, visible = false, running = false, first = true, active = -1;
  const pad = (n: number) => String(n).padStart(2, '0');

  const measure = () => {
    distance = Math.max(0, track.offsetWidth - stage.clientWidth);
    runway = distance * ratio;
    sec.classList.toggle('is-static', distance <= 1);
    sec.style.setProperty('--pin-h', `${Math.round(stage.offsetHeight + runway)}px`);
    first = true; kick();
  };

  const frame = () => {
    if (!visible) { running = false; return; }
    const top = sec.getBoundingClientRect().top;
    const p = runway > 0 ? clamp(-top / runway, 0, 1) : 0;
    const target = -p * distance;
    x = first ? target : x + (target - x) * EASE;
    if (Math.abs(target - x) < 0.05) x = target;
    first = false;
    track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    if (cur && items.length) {
      const mid = -x + stage.clientWidth / 2;
      let best = 0, bd = Infinity;
      items.forEach((it, i) => { const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      if (best !== active) { active = best; cur.textContent = pad(best + 1); }
    }
    requestAnimationFrame(frame);
  };
  const kick = () => { if (visible && !running) { running = true; requestAnimationFrame(frame); } };

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }, { rootMargin: '300px 0px' }).observe(sec);
  new ResizeObserver(measure).observe(track);
  new ResizeObserver(measure).observe(stage);
  addEventListener('resize', measure);
  document.fonts?.ready.then(measure);

  // Keyboard: tabbing to an off-screen frame scrolls the PAGE to where that frame is visible.
  track.addEventListener('focusin', (e) => {
    const it = (e.target as HTMLElement).closest<HTMLElement>('.gallery__item');
    if (!it || distance <= 0) return;
    const left = it.offsetLeft + x, w = it.offsetWidth;
    if (left >= 0 && left + w <= stage.clientWidth) return;
    const need = clamp(it.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || '0'), 0, distance);
    const secTop = sec.getBoundingClientRect().top + scrollY;
    scrollTo({ top: secTop + (need / distance) * runway, behavior: 'auto' });
  });
  // Safety net for browsers without overflow:clip — focus must never scroll the stage sideways.
  stage.addEventListener('scroll', () => { stage.scrollLeft = 0; });
}
