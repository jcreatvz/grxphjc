// Footer reveal (v0.9). The footer sits at zero height; as the end of the page comes
// within reach it opens to its natural height, and the watermark does one letter-swap.
// Scroll away and it collapses again — every approach repeats it.
//
// Settings come from site.json -> footer.reveal (tuned by John in the mock-up).
// Why it opens "at the end": with the footer collapsed the page can't scroll past its own end,
// so an earlier trigger would play the whole animation below the fold.
import { stepSpring, easeOutExpo } from './spring';
import { scrambleOnce, cancelScramble } from './scramble';

interface Cfg {
  enabled: boolean; triggerPct: number; closePct: number; assist: boolean; assistPct: number;
  motion: 'smooth' | 'spring'; smoothMs: number; stiffness: number; bounce: number; scrambleMs: number; scrambleAt: number;
}
const DEFAULTS: Cfg = { enabled: true, triggerPct: 15, closePct: 45, assist: true, assistPct: 10, motion: 'smooth',
  smoothMs: 650, stiffness: 260, bounce: 0.46, scrambleMs: 1100, scrambleAt: 65 };

export function initFooterReveal() {
  const footer = document.querySelector<HTMLElement>('[data-footer-reveal]');
  const marker = document.querySelector<HTMLElement>('[data-footer-marker]');
  if (!footer || !marker) return;
  let cfg: Cfg;
  try { cfg = { ...DEFAULTS, ...JSON.parse(footer.dataset.footerReveal || '{}') }; } catch { cfg = { ...DEFAULTS }; }
  if (!cfg.enabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return; // footer stays fully open

  const inner = footer.querySelector<HTMLElement>('.site-footer__inner')!;
  const wm = footer.querySelector<HTMLElement>('.site-footer__watermark');
  let H = inner.offsetHeight;
  const s = { x: 0, v: 0 };
  let open = false, forced = false, armed = false, running = false, last = 0;
  let tw: null | { from: number; to: number; t: number; dur: number } = null;
  let assistOn = false, assisted = 0, expectY = 0;

  const dist = () => marker.getBoundingClientRect().top - innerHeight; // how far the end of the page is below the screen
  const apply = () => { footer.style.height = `${(Math.max(0, s.x) * H).toFixed(1)}px`; };
  const atRest = () => cfg.motion === 'smooth'
    ? !tw && Math.abs(s.x - (open ? 1 : 0)) < 1e-3
    : Math.abs(s.x - (open ? 1 : 0)) < 5e-4 && Math.abs(s.v) < 5e-3;

  const frame = (t: number) => {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    const to = open ? 1 : 0;
    if (cfg.motion === 'smooth') {
      if (!tw && Math.abs(s.x - to) > 1e-3) tw = { from: s.x, to, t: 0, dur: (open ? cfg.smoothMs : cfg.smoothMs * 0.8) / 1000 };
      if (tw) { tw.t += dt; const k = Math.min(1, tw.t / tw.dur); s.x = tw.from + (tw.to - tw.from) * easeOutExpo(k); if (k >= 1) { s.x = tw.to; tw = null; } }
      s.v = 0;
    } else stepSpring(s, to, open ? cfg.stiffness : cfg.stiffness * 1.3, open ? cfg.bounce : 1, dt);

    if (armed && open && s.x >= cfg.scrambleAt / 100) { armed = false; if (wm) scrambleOnce(wm, { mode: 'swap', ms: cfg.scrambleMs, step: 60 }); }
    apply();
    // Scroll assist: nudge the page down in step with the opening so the footer rises into view.
    // Yields the moment the visitor scrolls back up.
    if (assistOn) {
      if (scrollY < expectY - 4) assistOn = false;
      else {
        const want = Math.min(1, s.x) * H * cfg.assistPct / 100;
        if (want > assisted) { scrollBy(0, want - assisted); assisted = want; expectY = scrollY; }
        if (s.x >= 1 && !tw && Math.abs(s.v) < 0.01) assistOn = false;
      }
    }
    if (atRest() && !assistOn && !armed) {
      running = false;
      if (open) footer.style.height = 'auto'; // fully open: follow content reflow naturally
      return;
    }
    requestAnimationFrame(frame);
  };
  const kick = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } };

  const setOpen = (next: boolean) => {
    if (next === open) return;
    open = next; tw = null; armed = next;
    if (!next) { assistOn = false; if (wm) cancelScramble(wm); }
    if (!next && footer.style.height === 'auto') apply(); // collapse from a px value, not 'auto'
    footer.dataset.state = next ? 'open' : 'closed';
    kick();
  };
  const check = () => {
    const d = dist(), vh = innerHeight;
    if (!open && d <= cfg.triggerPct / 100 * vh) { setOpen(true); assistOn = cfg.assist && d <= 0.2 * vh; assisted = 0; expectY = scrollY; }
    else if (open && !forced && d > cfg.closePct / 100 * vh) setOpen(false);
  };

  // Initial state, before the first paint of anything below the fold.
  document.documentElement.classList.add('footer-reveal');
  if (dist() <= cfg.triggerPct / 100 * innerHeight) { open = true; s.x = 1; footer.style.height = 'auto'; footer.dataset.state = 'open'; }
  else { s.x = 0; apply(); footer.dataset.state = 'closed'; }

  let queued = false;
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; check(); }); } }, { passive: true });
  addEventListener('resize', check);
  new ResizeObserver(() => { H = inner.offsetHeight; if (!running && !open) apply(); }).observe(inner);
  // Keyboard: focus inside a collapsed footer opens it and holds it open until focus leaves.
  footer.addEventListener('focusin', () => { forced = true; setOpen(true); });
  footer.addEventListener('focusout', (e) => { if (!footer.contains(e.relatedTarget as Node)) { forced = false; check(); } });

  if (/[?&]debug\b/.test(location.search)) (window as any).__grxFooter = { state: () => ({ open, x: s.x, H, dist: dist(), forced, cfg }) };
}
