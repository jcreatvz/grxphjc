// Curtain footer (v0.10) — the Nakula reveal, tuned by John in the mock-up.
// The window (in flow, last in the footer, clip-path) crops a panel fixed to the bottom of the
// screen; scrolling uncovers it. This script only adds the FEEL, all scroll-linked and reversible:
//   target = how far the window has risen into the screen (0 → 1)
//   cur    = target, smoothed with an exponential lag (the "weight")
//   remaining = 1 − ease(cur) drives the panel rise and the wordmark lift / skew / stretch.
// The watermark letter-swap fires once at `scrambleAt`% revealed and re-arms below `rearm`%.
import { scrambleOnce, cancelScramble } from './scramble';

interface Cfg {
  enabled: boolean; look: 'accent' | 'ghost'; parallax: number; lag: number; lift: number; stretch: number; skew: number;
  ease: 'linear' | 'out' | 'inout'; height: number; scrambleMs: number; scrambleAt: number; rearm: number;
}
const DEFAULTS: Cfg = { enabled: true, look: 'accent', parallax: 45, lag: 120, lift: 90, stretch: 30, skew: -6,
  ease: 'linear', height: 100, scrambleMs: 1100, scrambleAt: 65, rearm: 30 };
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function initFooterCurtain() {
  const footer = document.querySelector<HTMLElement>('[data-footer-curtain]');
  if (!footer) return;
  let cfg: Cfg;
  try { cfg = { ...DEFAULTS, ...JSON.parse(footer.dataset.footerCurtain || '{}') }; } catch { cfg = { ...DEFAULTS }; }
  const win = footer.querySelector<HTMLElement>('.site-footer__window');
  const panel = footer.querySelector<HTMLElement>('.site-footer__panel');
  const wm = footer.querySelector<HTMLElement>('.site-footer__watermark');
  if (!win || !panel || !wm) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS shows a plain, static footer
  const root = document.documentElement;
  const ease = (p: number) => cfg.ease === 'out' ? 1 - (1 - p) ** 3 : cfg.ease === 'inout' ? p * p * (3 - 2 * p) : p;

  let raf = 0, last = 0, cur = 0, target = 0, first = true, swapReady = true, lastKey = '';
  const draw = (time: number) => {
    raf = 0;
    const dt = last ? Math.min(time - last, 64) : 16; last = time;
    const box = win.getBoundingClientRect();
    target = clamp01((innerHeight - box.top) / box.height);
    if (first) { first = false; cur = target; swapReady = target < cfg.scrambleAt / 100; } // no replay when loading at the end
    const a = cfg.lag ? 1 - Math.exp(-dt / cfg.lag) : 1;
    cur += (target - cur) * a;
    if (Math.abs(target - cur) < 1e-4) cur = target;
    const m = 1 - ease(cur);
    const key = `${m.toFixed(4)}|${box.height}`;
    if (key !== lastKey) {
      lastKey = key;
      panel.style.transform = `translate3d(0, ${(m * box.height * cfg.parallax / 100).toFixed(2)}px, 0)`;
      wm.style.transform = `translateY(${(m * cfg.lift).toFixed(2)}px) skewY(${(m * cfg.skew).toFixed(3)}deg) scaleY(${(1 + m * cfg.stretch / 100).toFixed(4)})`;
    }
    if (swapReady && cur >= cfg.scrambleAt / 100) { swapReady = false; scrambleOnce(wm, { mode: 'swap', ms: cfg.scrambleMs, step: 60 }); }
    else if (!swapReady && cur <= cfg.rearm / 100) { swapReady = true; cancelScramble(wm); }
    const atEnd = cur > 0.98;
    if (atEnd && root.dataset.footerEnd !== cfg.look) root.dataset.footerEnd = cfg.look;
    else if (!atEnd && root.dataset.footerEnd) delete root.dataset.footerEnd;
    if (Math.abs(target - cur) > 1e-4) request(); else last = 0;
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(draw); };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  addEventListener('pageshow', request);
  new ResizeObserver(request).observe(win);
  request();

  if (/[?&]debug\b/.test(location.search)) (window as any).__grxFooter = { state: () => ({ target, cur, remaining: 1 - ease(cur), swapReady, cfg }) };
}
