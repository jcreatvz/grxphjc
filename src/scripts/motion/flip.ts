// FLIP morphs (First, Last, Invert, Play) for absolutely positioned elements whose resting place
// is a translate3d(x, y, 0). An element is drawn at a previous box (position + size) and animated
// into its new one with a single transform, so the browser only composites — no layout per frame.
export interface Box { x: number; y: number; w: number; h: number }
export const EASE_OUT = 'cubic-bezier(.16,1,.3,1)'; // the site's --ease-out
const at = (b: Box) => `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)`;

function settle(el: HTMLElement, ms: number, end: () => void) {
  return new Promise<void>((res) => {
    let done = false;
    const fin = () => { if (done) return; done = true; end(); res(); };
    el.addEventListener('transitionend', fin, { once: true });
    setTimeout(fin, ms + 80);
  });
}

/** Animate `el` (resting at box `to`) from box `from`. */
export function flipFrom(el: HTMLElement, from: Box, to: Box, ms = 850, easing = EASE_OUT) {
  el.style.transition = 'none';
  el.style.transformOrigin = '0 0';
  el.style.transform = `${at(from)} scale(${(from.w / Math.max(to.w, 0.1)).toFixed(4)}, ${(from.h / Math.max(to.h, 0.1)).toFixed(4)})`;
  void el.offsetHeight;
  el.style.transition = `transform ${ms}ms ${easing}`;
  el.style.transform = `${at(to)} scale(1, 1)`;
  return settle(el, ms, () => { el.style.transition = ''; el.style.transformOrigin = ''; el.style.transform = at(to); });
}

/** Animate `el` (currently at box `from`) out to box `to`, leaving it there (ghost morphs). */
export function flipTo(el: HTMLElement, from: Box, to: Box, ms = 850, easing = EASE_OUT) {
  el.style.transition = 'none';
  el.style.transformOrigin = '0 0';
  el.style.transform = `${at(from)} scale(1, 1)`;
  void el.offsetHeight;
  el.style.transition = `transform ${ms}ms ${easing}`;
  el.style.transform = `${at(to)} scale(${(to.w / Math.max(from.w, 0.1)).toFixed(4)}, ${(to.h / Math.max(from.h, 0.1)).toFixed(4)})`;
  return settle(el, ms, () => {});
}

/** Fade an element in where it already sits. */
export function fadeIn(el: HTMLElement, ms = 600, easing = EASE_OUT) {
  el.style.transition = 'none';
  el.style.opacity = '0';
  void el.offsetHeight;
  el.style.transition = `opacity ${ms}ms ${easing}`;
  el.style.opacity = '1';
  return settle(el, ms, () => { el.style.transition = ''; el.style.opacity = ''; });
}
