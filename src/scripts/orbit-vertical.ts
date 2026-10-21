// Orbit v2 — the vertical list view (after John's bokid "vertical" mode), replacing v1's grid.
//
//   • Fills the screen and pins; the PAGE's own scroll drives the list (no wheel hijacking).
//     The list wraps, so it loops through the projects `loops` times (default 2), then the pin
//     releases into the next section.
//   • Damped follow (bokid's 0.09 per frame) gives it weight; snap-to-centre when scrolling stops.
//   • Number + title column on the right (≥900px), scrolling OPPOSITE to the images, continuously
//     in sync with them, infinite (repeated sets that wrap by exactly one set).
//   • 3D morph: the sphere's own cards travel in 3D — position, rotation, scale and the camera —
//     from the sphere into the flat column and back (motion/morph3d). List items share each
//     card's aspect ratio, so the card's final flat pose IS the list item: the handoff happens
//     in one frame with nothing to see.
import { damp, morph3d, applyPose, camCss, type Pose3, type Cam3 } from './motion';

interface PoseApi {
  worldNow(): Cam3; worldRest(): Cam3; cardNow(i: number): Pose3; cardRest(i: number): Pose3; reset(): void;
}
interface Api { cards: HTMLElement[]; pause(): void; resume(): void; toggle: HTMLButtonElement | null; reduce: boolean; world: HTMLElement; pose: PoseApi }
interface VItem { el: HTMLElement; i: number; clone: boolean; x: number; y: number; w: number; h: number; sy: number }

const FACT = [0.68, 0.89, 0.93, 0.68, 1.0]; // bokid's width rhythm: 190 / 250 / 260 / 190 / 280
const DAMP = 0.09, MORPH_MS = 1300;
const now = () => performance.now();
const instant = (top: number) => window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function setupVertical(sec: HTMLElement, api: Api) {
  const vlist = sec.querySelector<HTMLElement>('[data-orbit-vlist]')!;
  const ul = vlist.querySelector<HTMLElement>('.orbit__vul')!;
  const label = api.toggle?.querySelector<HTMLElement>('[data-orbit-toggle-label]');
  const num = (k: string, d: number) => { const v = parseFloat(sec.dataset[k] ?? ''); return Number.isFinite(v) && v > 0 ? v : d; };
  const loops = num('loops', 2), travel = num('travel', 1), snapOn = sec.dataset.snap !== 'false';

  const base = [...ul.querySelectorAll<HTMLElement>('.orbit__vitem')];
  const N = base.length;
  let items: VItem[] = base.map((el, i) => ({ el, i, clone: false, x: 0, y: 0, w: 0, h: 0, sy: 0 }));
  let active = false, staticMode = false, morphing = false, visible = false, running = false;
  let T = 0, maxH = 0, runway = 0, O0 = 0, cur = 0, last = 0, selected = -1, frac = 0;
  let lastInput = 0, lastScroll = 0, snapping = false, snapY = 0, snapTarget = 0;

  const secTop = () => sec.getBoundingClientRect().top + scrollY;
  // The list and the sphere share the sticky frame. Measure THAT — the list itself is display:none
  // while the cards are morphing, and a hidden box measures 0×0.
  const frameBox = () => { const f = sec.querySelector<HTMLElement>('.orbit__sticky')!; return { W: f.clientWidth, H: f.clientHeight }; };
  const cardRatio = (i: number) => { const c = api.cards[i]; return c && c.offsetHeight ? c.offsetWidth / c.offsetHeight : 1.5; };

  // ---------- title column (number + title), counter-scrolling and infinite ----------
  const titles = sec.querySelector<HTMLElement>('[data-orbit-titles]');
  const track = titles?.querySelector<HTMLElement>('.orbit__ttrack');
  const SETS = 5, MID = 2;
  let lineH = 0, onIdx = -1;
  if (track) {
    const set = track.querySelector<HTMLElement>('.orbit__tset')!;
    [...set.children].reverse().forEach((n) => set.appendChild(n));   // higher numbers above → titles travel DOWN as images travel UP
    for (let s = 1; s < SETS; s++) track.appendChild(set.cloneNode(true));
  }
  function placeTitles() {
    if (!track || !titles) return;
    // fractional line height from a whole set — offsetHeight rounds (37.8 → 38) and the error
    // accumulates over the ~70 rows above the centre, drifting the column out of sync
    if (!lineH) { const s = track.querySelector<HTMLElement>('.orbit__tset'); lineH = s ? s.getBoundingClientRect().height / N : 0; }
    if (!lineH) return;
    const row = MID * N + (N - 1 - frac);                                // continuous row of the centred project
    const ty = titles.clientHeight / 2 - (row * lineH + lineH / 2);
    track.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
    const k = ((Math.round(frac) % N) + N) % N;
    if (k !== onIdx) { onIdx = k; track.querySelectorAll<HTMLElement>('.orbit__ti').forEach((t) => t.classList.toggle('is-on', Number(t.dataset.i) === k)); }
  }

  // ---------- layout (bokid M0: a centred column, varied widths, tight gap) ----------
  function measure() {
    const vw = innerWidth, vh = innerHeight;
    const wBase = vw < 640 ? vw * 0.5 : Math.min(300, Math.max(150, vw * 0.2));
    const gap = Math.max(6, Math.round(vw * 0.005));
    let y = 0; maxH = 0;
    for (const it of items) {
      it.w = Math.round(wBase * FACT[it.i % FACT.length]);
      it.h = Math.round(it.w / cardRatio(it.i));           // same aspect as the sphere card → seamless morph
      it.x = Math.round(vw / 2 - it.w / 2); it.y = y; y += it.h + gap;
      maxH = Math.max(maxH, it.h);
      it.el.style.width = `${it.w}px`; it.el.style.height = `${it.h}px`;
    }
    T = y;
    if (T < vh + 2 * (maxH + gap) && base.length) { addCopies(); return measure(); }
    O0 = items[0].h / 2 - vh / 2;
    runway = (loops * T) / travel;
    sec.style.setProperty('--v-runway', `${Math.round(runway)}px`);
  }
  function addCopies() {
    for (const src of base) {
      const el = src.cloneNode(true) as HTMLElement;
      el.dataset.clone = '1'; el.setAttribute('aria-hidden', 'true');
      el.querySelectorAll('a,button').forEach((n) => {
        n.setAttribute('tabindex', '-1');
        [...n.attributes].forEach((a) => { if (a.name.startsWith('data-lb')) n.removeAttribute(a.name); });
        n.addEventListener('click', (e) => { e.preventDefault(); src.querySelector<HTMLElement>('a,button')?.click(); });
      });
      ul.appendChild(el);
      items.push({ el, i: Number(src.dataset.i), clone: true, x: 0, y: 0, w: 0, h: 0, sy: 0 });
    }
  }

  const offsetFor = (y: number) => O0 + clamp(y - secTop(), 0, runway) * travel;
  const wrapY = (it: VItem, O: number) => {
    let s = (((it.y - O) % T) + T) % T;
    if (s > T - maxH - 40) s -= T;
    return s;
  };
  /** Continuous index of the project under the centre line (0 → N, wraps). */
  function fracAt(O: number) {
    const M = items.length, u = (((O + innerHeight / 2) % T) + T) % T;
    const c = (r: number) => items[r].y + items[r].h / 2;
    for (let r = 0; r < M; r++) {
      const a = c(r), b = r + 1 < M ? c(r + 1) : T + c(0);
      if (u >= a && u < b) return (r + (u - a) / (b - a)) % N;
      if (r === 0 && u < a) { const p = c(M - 1); return (M - 1 + (u + T - p) / (a + T - p)) % N; }
    }
    return 0;
  }
  function place(O: number) {
    const vh = innerHeight; let best = -1, bd = Infinity;
    for (const it of items) {
      it.sy = wrapY(it, O);
      it.el.style.transform = `translate3d(${it.x}px, ${it.sy.toFixed(1)}px, 0)`;
      const d = Math.abs(it.sy + it.h / 2 - vh / 2);
      if (d < bd) { bd = d; best = it.i; }
    }
    if (best !== selected) { selected = best; for (const it of items) it.el.classList.toggle('is-selected', it.i === selected); }
    frac = fracAt(O); placeTitles();
  }

  // ---------- loop ----------
  function frame(t: number) {
    if (!active || staticMode || !visible) { running = false; last = 0; return; }
    const dt = last ? Math.min(64, t - last) : 16.67; last = t;
    const target = offsetFor(scrollY);
    if (!morphing) {
      cur = damp(cur, target, DAMP, dt);
      if (Math.abs(target - cur) < 0.2) cur = target;
      place(cur);
    }
    const st = secTop(), pinned = scrollY >= st - 1 && scrollY <= st + runway + 1;
    if (snapOn && !morphing && !snapping && pinned && now() - lastInput > 250 && now() - lastScroll > 140 && Math.abs(target - cur) < 5) {
      const vh = innerHeight; let d = Infinity;
      for (const it of items) { const c = it.sy + it.h / 2 - vh / 2; if (Math.abs(c) < Math.abs(d)) d = c; }
      const ty = scrollY + d / travel;
      if (Math.abs(d) > 1 && ty > st + 1 && ty < st + runway - 1) { snapping = true; snapY = scrollY; snapTarget = ty; }
    }
    if (snapping) {
      snapY = damp(snapY, snapTarget, 0.14, dt);
      if (Math.abs(snapTarget - snapY) < 0.5) { snapY = snapTarget; snapping = false; }
      instant(snapY);
    }
    requestAnimationFrame(frame);
  }
  const kick = () => { if (active && !staticMode && visible && !running) { running = true; requestAnimationFrame(frame); } };

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }).observe(sec);
  document.fonts?.ready.then(() => { lineH = 0; if (active && !staticMode) placeTitles(); });
  addEventListener('scroll', () => { lastScroll = now(); kick(); }, { passive: true });
  const userInput = () => { lastInput = now(); snapping = false; };
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach((e) => addEventListener(e, userInput, { passive: true }));
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = window.setTimeout(() => { lineH = 0; if (active && !staticMode && !morphing) { measure(); cur = offsetFor(scrollY); place(cur); } }, 150); });
  const sticky = sec.querySelector<HTMLElement>('.orbit__sticky');
  [vlist, sticky].forEach((el) => el?.addEventListener('scroll', () => { el.scrollTop = 0; el.scrollLeft = 0; }));
  vlist.addEventListener('focusin', (e) => {
    vlist.scrollTop = 0; if (sticky) sticky.scrollTop = 0;
    if (!active || staticMode) return;
    const li = (e.target as HTMLElement).closest<HTMLElement>('.orbit__vitem'); if (!li) return;
    const it = items.find((x) => x.el === li); if (!it) return;
    const d = it.sy + it.h / 2 - innerHeight / 2, st = secTop();
    instant(clamp(scrollY + d / travel, st, st + runway));
  });

  const setLabel = (vert: boolean) => {
    api.toggle?.setAttribute('aria-pressed', String(vert));
    if (label) label.textContent = vert ? 'Sphere' : 'List';
  };
  const shown = (el: HTMLElement, r: DOMRect) => {
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && +cs.opacity > 0.2 && r.width > 2 && r.bottom > 0 && r.top < innerHeight;
  };
  const baseOf = (i: number) => items.find((x) => x.i === i && !x.clone)!;
  /** A project's flat pose: its list item's box, expressed in the sphere's world space (camera at rest). */
  const flatPose = (i: number, W: number, H: number, clampY = false): Pose3 => {
    const it = baseOf(i), cw = api.cards[i].offsetWidth || it.w;
    let y = it.sy + it.h / 2 - H / 2;
    const off = y > H / 2 + it.h / 2 || y < -H / 2 - it.h / 2;
    if (clampY) y = clamp(y, -H * 0.62 - it.h / 2, H * 0.62 + it.h / 2);
    return { x: it.x + it.w / 2 - W / 2, y, z: 0, ry: 0, rx: 0, s: it.w / cw, o: clampY && off ? 0 : 1, d: 0, g: i === selected ? 0 : 1 };
  };
  const cascade = (poses: Pose3[], H: number) => poses.map((p) => clamp((Math.abs(p.y) / H) * 260, 0, 300));

  // ---------- sphere → list ----------
  async function enter(morph = true) {
    if (active) return;
    if (api.reduce) return enterStatic();
    let sel = 0, bd = Infinity;
    api.cards.forEach((c, i) => { const r = c.getBoundingClientRect(); if (!shown(c, r)) return;
      const d = Math.hypot(r.left + r.width / 2 - innerWidth / 2, r.top + r.height / 2 - innerHeight / 2); if (d < bd) { bd = d; sel = i; } });
    const from = morph ? api.cards.map((_, i) => api.pose.cardNow(i)) : [];
    const camFrom = api.pose.worldNow();
    api.pause();
    active = true;
    sec.classList.add('is-vertical'); if (morph) sec.classList.add('is-morphing');
    vlist.inert = false; setLabel(true);
    api.cards.forEach((c) => { c.style.visibility = ''; });
    measure();
    const it0 = baseOf(sel);
    let o = it0.y + it0.h / 2 - innerHeight / 2;
    while (o < O0) o += T; while (o >= O0 + T) o -= T;
    instant(secTop() + (o - O0) / travel);
    cur = o; place(cur);
    if (morph) {
      morphing = true;
      const { W, H } = frameBox();
      // cards bound for list slots far off-screen only travel just past the edge and fade out —
      // they're invisible at the handoff anyway, and streaking 3000px across the screen reads as noise
      const to = api.cards.map((_, i) => flatPose(i, W, H, true));
      await morph3d({ world: api.world, els: api.cards, from, to, camFrom, camTo: { camZ: 0, sx: 0, sy: 0 }, ms: MORPH_MS, delays: cascade(to, H) });
      place(cur);
      sec.classList.remove('is-morphing');           // handoff: the flat cards ARE the list — swap in one frame
      morphing = false;
    }
    lastInput = now(); kick();
  }

  // ---------- list → sphere ----------
  async function exit(morph = true) {
    if (!active) return;
    if (staticMode) { staticMode = false; active = false; sec.classList.remove('is-vertical', 'is-static'); vlist.inert = true; setLabel(false); api.resume(); return; }
    const { W, H } = frameBox();
    const from = api.cards.map((_, i) => flatPose(i, W, H, true));
    morphing = true; active = false; snapping = false;
    if (morph) {
      // swap list → flat cards in one frame, at exactly the same boxes
      sec.classList.add('is-morphing');
      api.world.style.transform = camCss({ camZ: 0, sx: 0, sy: 0 });
      api.cards.forEach((c, i) => applyPose(c, from[i]));
    }
    sec.classList.remove('is-vertical'); setLabel(false);
    instant(secTop());
    api.pose.reset();
    if (morph) {
      const to = api.cards.map((_, i) => api.pose.cardRest(i));
      await morph3d({ world: api.world, els: api.cards, from, to, camFrom: { camZ: 0, sx: 0, sy: 0 }, camTo: api.pose.worldRest(), ms: MORPH_MS, delays: cascade(from, H) });
      sec.classList.remove('is-morphing');
    }
    api.cards.forEach((c) => { c.style.setProperty('--g', '0'); });
    vlist.inert = true; morphing = false;
    api.resume();                                      // the live sphere continues from exactly this pose
  }

  // ---------- reduced motion: a plain, static column ----------
  function enterStatic() {
    staticMode = true; active = true;
    api.pause();
    sec.classList.add('is-vertical', 'is-static'); vlist.inert = false; setLabel(true);
    for (const it of items) { it.el.style.width = ''; it.el.style.height = ''; it.el.style.transform = ''; }
  }

  return {
    enter, exit, enterStatic,
    toggle: () => (morphing ? undefined : active ? exit() : enter()),
    get active() { return active; },
    state: () => ({ active, staticMode, morphing, selected, T, runway, loops, travel, cur, O0, snapping, frac, items: items.length }),
  };
}
