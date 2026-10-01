// Orbit — 3D image sphere (adapted from the supplied index.html).
// Differences from the original: contained in its own section (no window
// takeover or scrollTo hijack), scroll-dolly tied to the section's own
// progress, rAF loop pauses when off-screen, cards are real <a>/<button>
// elements (keyboard + native navigation), popups use the shared lightbox.
import { openLightbox, itemFrom } from './lightbox';

const DEG = Math.PI / 180;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function initOrbits() {
  document.querySelectorAll<HTMLElement>('[data-orbit]').forEach(setup);
}

function setup(sec: HTMLElement) {
  const stage = sec.querySelector<HTMLElement>('[data-orbit-stage]')!;
  const world = sec.querySelector<HTMLElement>('.orbit__world')!;
  const headline = sec.querySelector<HTMLElement>('.orbit__headline');
  const cardEls = [...sec.querySelectorAll<HTMLElement>('.orbit__card')];
  const toggle = sec.querySelector<HTMLButtonElement>('[data-orbit-toggle]');
  const grid = sec.querySelector<HTMLElement>('.orbit__grid');
  const N = cardEls.length;
  if (!N) return;


  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fibonacci sphere placement
  const GA = Math.PI * (3 - Math.sqrt(5));
  const cards = cardEls.map((el, i) => {
    const y = N === 1 ? 0 : 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * GA;
    const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
    return { el, x, y, z, lat: Math.asin(y) / DEG, lon: Math.atan2(x, z) / DEG, d: -1, o: -1 };
  });

  // ---- layout from the section's own box ----
  let R = 300, persp = 1150, lw = 0, lh = 0;
  const layout = (force = false) => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!force && Math.abs(w - lw) < 20 && Math.abs(h - lh) < 20) return;
    lw = w; lh = h;
    const small = w <= 640, tiny = w <= 380;
    const hr = tiny ? 0.36 : small ? 0.4 : 0.42;
    const wr = tiny ? 0.48 : small ? 0.52 : w <= 900 ? 0.44 : 0.56;
    R = Math.max(tiny ? 108 : small ? 120 : 155, Math.min(480, h * hr, w * wr));
    const cw = Math.round(Math.max(72, R * (small ? 0.46 : 0.47)));
    persp = tiny ? 620 : small ? 760 : w <= 900 ? 920 : 1150;
    sec.style.setProperty('--persp', `${persp}px`);
    sec.style.setProperty('--cw', `${cw}px`);
    for (const c of cards) {
      c.el.style.transform = `translate3d(${(c.x * R).toFixed(2)}px, ${(-c.y * R).toFixed(2)}px, ${(c.z * R).toFixed(2)}px) rotateY(${c.lon.toFixed(3)}deg) rotateX(${c.lat.toFixed(3)}deg)`;
    }
  };
  new ResizeObserver(() => layout()).observe(stage);
  layout(true);

  // ---- camera state ----
  const tilt = -4, PITCH = 32;
  let dragX = 0, dragY = 0, velX = reduce ? 0 : 0.06, velY = 0, camZ = 0;
  let dragging = false, lbOpen = false, visible = true, running = false, gridMode = false;
  const idle = reduce ? 0 : 0.045; // gentle auto-rotation when untouched

  const progress = () => {
    const r = sec.getBoundingClientRect();
    const span = sec.offsetHeight - innerHeight;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  };

  const frame = () => {
    if (!visible || gridMode) { running = false; return; }
    if (!dragging && !lbOpen) {
      dragX += velX; dragY += velY;
      velX = velX * 0.94 + idle * 0.06; velY *= 0.94;
      if (Math.abs(velY) < 0.002) velY = 0;
    }
    dragY = clamp(dragY, -PITCH - tilt, PITCH - tilt);
    const p = progress();
    camZ += (p * Math.min(80, R * 0.16) - camZ) * 0.075;
    const sx = tilt + dragY, sy = dragX;
    world.style.transform = `translateZ(${camZ.toFixed(2)}px) rotateY(${sy.toFixed(3)}deg) rotateX(${sx.toFixed(3)}deg)`;
    if (headline) {
      headline.style.opacity = Math.max(0, 1 - p * 1.6).toFixed(3);
      headline.style.transform = `translate(-50%, calc(-50% - ${(p * 40).toFixed(1)}px)) scale(${(1 + p * 0.08).toFixed(3)})`;
    }
    const cX = Math.cos(sx * DEG), sX = Math.sin(sx * DEG), cY = Math.cos(sy * DEG), sY = Math.sin(sy * DEG);
    const shade = 1 - Math.min(1, p * 1.6), near = persp * 0.66;
    for (const c of cards) {
      const z1 = -c.y * sX + c.z * cX;
      const zf = -c.x * sY + z1 * cY;
      let dim = shade * (1 - (0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85)));
      let fade = 1;
      const absZ = zf * R + camZ;
      if (absZ > near) fade = Math.max(0, 1 - (absZ - near) / 190);
      if (lbOpen) dim = Math.min(1, dim + 0.7);
      const d = Math.round(dim * 100) / 100, o = Math.round(fade * 100) / 100;
      if (d !== c.d) { c.d = d; c.el.style.setProperty('--d', String(d)); }
      if (o !== c.o) { c.o = o; c.el.style.opacity = String(o); c.el.style.pointerEvents = o < 0.2 ? 'none' : ''; }
    }
    requestAnimationFrame(frame);
  };
  const kick = () => { if (!running && visible && !gridMode) { running = true; requestAnimationFrame(frame); } };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }).observe(sec);

  // ---- drag (mouse captures after 4px; touch only after a horizontal intent) ----
  let drag: null | { id: number; type: string; x0: number; y0: number; lx: number; ly: number; t: number; moved: number; active: boolean } = null;
  let suppress = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, type: e.pointerType, x0: e.clientX, y0: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: 0, active: false };
    suppress = false;
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const ox = e.clientX - drag.x0, oy = e.clientY - drag.y0, dist = Math.hypot(ox, oy);
    drag.moved = Math.max(drag.moved, dist);
    if (!drag.active) {
      const slop = drag.type === 'touch' ? 10 : 4;
      if (dist < slop) return;
      if (drag.type === 'touch' && Math.abs(oy) > Math.abs(ox) * 1.15) { drag = null; return; } // let the page scroll
      drag.active = true; dragging = true; velX = velY = 0; suppress = true;
      try { stage.setPointerCapture(e.pointerId); } catch {}
      sec.classList.add('is-dragging');
      drag.lx = e.clientX; drag.ly = e.clientY; drag.t = performance.now();
      return;
    }
    const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
    drag.lx = e.clientX; drag.ly = e.clientY; drag.t = performance.now();
    dragX += dx * 0.13; dragY -= dy * 0.13; velX = dx * 0.13; velY = -dy * 0.13;
  });
  const end = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.active && performance.now() - drag.t > 90) { velX = velY = 0; }
    try { stage.releasePointerCapture(e.pointerId); } catch {}
    drag = null; dragging = false; sec.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  // Clicks: swallow the click that ends a drag; popup cards open the lightbox.
  const popupItems = () => cardEls.filter((c) => c.hasAttribute('data-lb'));
  stage.addEventListener('click', (e) => {
    if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false; return; }
    const card = (e.target as HTMLElement).closest<HTMLElement>('.orbit__card[data-lb]');
    if (!card) return;
    e.preventDefault();
    const list = popupItems();
    velX = velY = 0;
    openLightbox(list.map(itemFrom), list.indexOf(card), card.querySelector('figure'));
  }, true);
  document.addEventListener('grx:lightbox', (e) => { lbOpen = (e as CustomEvent).detail.open; });

  // ---- sphere ⇄ grid ----
  const setGrid = (on: boolean) => {
    gridMode = on;
    sec.classList.toggle('is-grid', on);
    toggle?.setAttribute('aria-pressed', String(on));
    if (toggle) toggle.querySelector('[data-orbit-toggle-label]')!.textContent = on ? 'Sphere' : 'Grid';
    stage.inert = on; if (grid) grid.inert = !on;
    if (!on) { layout(true); kick(); }
  };
  toggle?.addEventListener('click', () => setGrid(!gridMode));
  // Reduced motion and no-pointer-precision keyboard-first users start in grid.
  setGrid(sec.dataset.start === 'grid' || reduce);

  // Headline word reveal once the loader has cleared.
  const reveal = () => sec.classList.add('is-revealed');
  if (document.documentElement.classList.contains('is-loading')) document.addEventListener('grx:ready', reveal, { once: true });
  else requestAnimationFrame(reveal);
  kick();
}
