// Orbit v2 — the vertical list view (after John's bokid "vertical" mode), replacing v1's grid.
//
//   • Fills the screen and pins; the PAGE's own scroll drives the list (no wheel hijacking, so the
//     rest of the site keeps working). The list wraps, so it loops through the projects `loops`
//     times (default 2), then the pin releases into the next section.
//   • Damped follow (bokid's 0.09 per frame) gives it weight.
//   • Snap-to-centre: once scrolling stops, the nearest project eases to the middle.
//   • Morph: switching views FLIPs every visible card from its sphere position into the list, and
//     the list items fly back onto the sphere on the way out.
// Items are real elements (buttons/links, popup attributes) rendered once; they are recycled by
// wrapping their offset, and only cloned when the list is shorter than the screen needs.
import { damp, flipFrom, flipTo, fadeIn, type Box } from './motion';

interface Api { cards: HTMLElement[]; pause(): void; resume(): void; toggle: HTMLButtonElement | null; reduce: boolean }
interface VItem { el: HTMLElement; i: number; clone: boolean; x: number; y: number; w: number; h: number; sy: number }

const FACT = [0.68, 0.89, 0.93, 0.68, 1.0]; // bokid's width rhythm: 190 / 250 / 260 / 190 / 280
const DAMP = 0.09;
const now = () => performance.now();
const instant = (top: number) => window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });

export function setupVertical(sec: HTMLElement, api: Api) {
  const vlist = sec.querySelector<HTMLElement>('[data-orbit-vlist]')!;
  const ul = vlist.querySelector<HTMLElement>('.orbit__vul')!;
  const label = api.toggle?.querySelector<HTMLElement>('[data-orbit-toggle-label]');
  const num = (k: string, d: number) => { const v = parseFloat(sec.dataset[k] ?? ''); return Number.isFinite(v) && v > 0 ? v : d; };
  const loops = num('loops', 2), travel = num('travel', 1), snapOn = sec.dataset.snap !== 'false';

  const base = [...ul.querySelectorAll<HTMLElement>('.orbit__vitem')];
  let items: VItem[] = base.map((el, i) => ({ el, i, clone: false, x: 0, y: 0, w: 0, h: 0, sy: 0 }));
  let active = false, staticMode = false, morphing = false, visible = false, running = false;
  let T = 0, maxH = 0, runway = 0, O0 = 0, cur = 0, last = 0, selected = -1;
  let lastInput = 0, lastScroll = 0, snapping = false, snapY = 0, snapTarget = 0;

  const secTop = () => sec.getBoundingClientRect().top + scrollY;

  // ---------- layout (bokid M0: a centred column, varied widths, tight gap) ----------
  function measure() {
    const vw = innerWidth, vh = innerHeight;
    const wBase = vw < 640 ? vw * 0.5 : Math.min(300, Math.max(150, vw * 0.2));
    const gap = Math.max(6, Math.round(vw * 0.005));
    const ratio = (it: VItem) => {
      const img = it.el.querySelector('img');
      return img && img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : (it.el.dataset.tall ? 0.8 : 1.5);
    };
    let y = 0; maxH = 0;
    for (const it of items) {
      it.w = Math.round(wBase * FACT[it.i % FACT.length]);
      it.h = Math.round(it.w / ratio(it));
      it.x = Math.round(vw / 2 - it.w / 2); it.y = y; y += it.h + gap;
      maxH = Math.max(maxH, it.h);
      it.el.style.width = `${it.w}px`; it.el.style.height = `${it.h}px`;
    }
    T = y;
    // too short to fill the screen seamlessly? add decorative copies until it is
    if (T < vh + 2 * (maxH + gap) && base.length) { addCopies(); return measure(); }
    O0 = items[0].h / 2 - vh / 2;                  // offset that centres the first project
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

  // list offset ⇄ page scroll (1:1 × travel). After `loops` full passes it is back where it began.
  const offsetFor = (y: number) => O0 + Math.min(Math.max(y - secTop(), 0), runway) * travel;
  const wrapY = (it: VItem, O: number) => {
    let s = (((it.y - O) % T) + T) % T;
    if (s > T - maxH - 40) s -= T;  // items past the bottom wrap above the top
    return s;
  };
  function place(O: number) {
    const vh = innerHeight; let best = -1, bd = Infinity;
    for (const it of items) {
      it.sy = wrapY(it, O);
      it.el.style.transform = `translate3d(${it.x}px, ${it.sy.toFixed(1)}px, 0)`;
      const d = Math.abs(it.sy + it.h / 2 - vh / 2);
      if (d < bd) { bd = d; best = it.i; }
    }
    if (best !== selected) {
      selected = best;
      for (const it of items) it.el.classList.toggle('is-selected', it.i === selected);
    }
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
    // snap-to-centre once the visitor has stopped (wheel/touch/keys idle, momentum over)
    const st = secTop(), pinned = scrollY >= st - 1 && scrollY <= st + runway + 1;
    if (snapOn && !morphing && !snapping && pinned && now() - lastInput > 250 && now() - lastScroll > 140 && Math.abs(target - cur) < 5) { // bokid: within 5px
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
  addEventListener('scroll', () => { lastScroll = now(); kick(); }, { passive: true });
  const userInput = () => { lastInput = now(); snapping = false; };
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach((e) => addEventListener(e, userInput, { passive: true }));
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = window.setTimeout(() => { if (active && !staticMode) { measure(); cur = offsetFor(scrollY); place(cur); } }, 150); });
  // real image ratios arrive as images load → relayout (debounced)
  let rl = 0;
  ul.querySelectorAll('img').forEach((img) => img.addEventListener('load', () => {
    clearTimeout(rl); rl = window.setTimeout(() => { if (active && !staticMode && !morphing) { measure(); cur = offsetFor(scrollY); place(cur); } }, 120);
  }));
  // Focusing a link inside a clipped box makes the browser scroll THAT box to reveal it, which would
  // shift every item. Pin the containers at 0 — the page scroll is the only scroll that moves the list.
  const sticky = sec.querySelector<HTMLElement>('.orbit__sticky');
  [vlist, sticky].forEach((el) => el?.addEventListener('scroll', () => { el.scrollTop = 0; el.scrollLeft = 0; }));
  // keyboard: tabbing to a project scrolls the page so it sits in the middle
  vlist.addEventListener('focusin', (e) => {
    vlist.scrollTop = 0; if (sticky) sticky.scrollTop = 0;
    if (!active || staticMode) return;
    const li = (e.target as HTMLElement).closest<HTMLElement>('.orbit__vitem'); if (!li) return;
    const it = items.find((x) => x.el === li); if (!it) return;
    const d = it.sy + it.h / 2 - innerHeight / 2, st = secTop();
    instant(Math.min(Math.max(scrollY + d / travel, st), st + runway));
  });

  const setLabel = (vert: boolean) => {
    api.toggle?.setAttribute('aria-pressed', String(vert));
    if (label) label.textContent = vert ? 'Sphere' : 'List';
  };
  const boxOf = (r: DOMRect, origin: DOMRect): Box => ({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });
  const shown = (el: HTMLElement, r: DOMRect) => {
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && +cs.opacity > 0.2 && r.width > 2 && r.bottom > 0 && r.top < innerHeight;
  };

  // ---------- sphere → list ----------
  async function enter(morph = true) {
    if (active) return;
    if (api.reduce) return enterStatic();
    const rects = new Map<number, DOMRect>();
    if (morph) api.cards.forEach((c, i) => { const r = c.getBoundingClientRect(); if (shown(c, r)) rects.set(i, r); });
    // keep the card nearest the middle of the screen as the centred project
    let sel = 0, bd = Infinity;
    rects.forEach((r, i) => { const d = Math.hypot(r.left + r.width / 2 - innerWidth / 2, r.top + r.height / 2 - innerHeight / 2); if (d < bd) { bd = d; sel = i; } });

    api.pause();
    active = true; sec.classList.add('is-vertical'); vlist.inert = false; setLabel(true);
    measure();
    const it0 = items.find((x) => x.i === sel && !x.clone)!;
    let o = it0.y + it0.h / 2 - innerHeight / 2;
    while (o < O0) o += T; while (o >= O0 + T) o -= T;            // first pass
    instant(secTop() + (o - O0) / travel);
    cur = o; place(cur);

    if (morph) {
      morphing = true;
      const origin = vlist.getBoundingClientRect(), jobs: Promise<void>[] = [], used = new Set<number>();
      for (const it of items) {
        if (it.sy + it.h < 0 || it.sy > innerHeight) continue;
        const to: Box = { x: it.x, y: it.sy, w: it.w, h: it.h };
        const r = rects.get(it.i);
        if (r && !used.has(it.i)) { used.add(it.i); jobs.push(flipFrom(it.el, boxOf(r, origin), to)); }
        else jobs.push(fadeIn(it.el));
      }
      await Promise.all(jobs);
      morphing = false;
    }
    lastInput = now(); kick();
  }

  // ---------- list → sphere ----------
  async function exit(morph = true) {
    if (!active) return;
    if (staticMode) { staticMode = false; active = false; sec.classList.remove('is-vertical', 'is-static'); vlist.inert = true; setLabel(false); api.resume(); return; }
    const ghosts = morph ? items.filter((it) => !it.clone && it.sy + it.h > 0 && it.sy < innerHeight) : [];
    morphing = true; active = false; snapping = false;
    if (morph) sec.classList.add('is-morphing');
    sec.classList.remove('is-vertical'); setLabel(false);
    instant(secTop());
    api.resume();
    if (morph && ghosts.length) {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));   // let the sphere draw once
      const origin = vlist.getBoundingClientRect(), jobs: Promise<void>[] = [];
      for (const it of ghosts) {
        const card = api.cards[it.i]; if (!card) continue;
        const r = card.getBoundingClientRect();
        if (!shown(card, r)) continue;
        jobs.push(flipTo(it.el, { x: it.x, y: it.sy, w: it.w, h: it.h }, boxOf(r, origin), 700));
      }
      await Promise.all(jobs);
      sec.classList.add('is-landing');                          // cross-fade list → sphere
      await new Promise((r) => setTimeout(r, 260));
    }
    sec.classList.remove('is-morphing', 'is-landing');
    vlist.inert = true; morphing = false;
    for (const it of items) { it.el.style.transform = ''; it.el.style.transition = ''; it.el.style.transformOrigin = ''; }
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
    toggle: () => (active ? exit() : enter()),
    get active() { return active; },
    state: () => ({ active, staticMode, morphing, selected, T, runway, loops, travel, cur, O0, snapping, items: items.length }),
  };
}
