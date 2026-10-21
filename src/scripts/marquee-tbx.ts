// Mounts the TBX tube engine on every [data-tbx] section, and sizes the section so the tube is
// never cut off at the top or bottom.
//
// Why sizing is needed: the engine sets the tube's radius from the WINDOW (min(vw, vh) × radius),
// tilts it, and projects it with perspective — so how tall the tube looks depends on the
// viewport, not the section. A fixed band height clipped it on some screens. After each engine
// layout we read back the real radius, type size and perspective, and compute the tallest the
// tilted, perspective-projected ring can ever get as it spins; the section is made that tall.
// The engine reads the window, not the section, so resizing the section can't feed back into it.
import TBX from './tbx';

const DEG = Math.PI / 180;

/** Half-height (px) the tube can reach above/below its centre line, over a full rotation. */
function tubeHalfExtent(R: number, font: number, P: number, tiltDeg: number) {
  const sinT = Math.sin(tiltDeg * DEG), cosT = Math.cos(tiltDeg * DEG);
  // An item's own half-height once tilted: glyph box (≈0.75em wide × 1em tall) rotated by the tilt,
  // plus a little for flat words, which are short chords (< 8–30° of arc) of the circle.
  const item = (0.75 * font * sinT + font * cosT) / 2 + 0.03 * R;
  let max = 0;
  for (let a = 0; a < 360; a += 2) {
    const s = Math.sin(a * DEG), c = Math.cos(a * DEG);
    const mag = P / Math.max(1, P - R * c);            // nearer items project larger
    max = Math.max(max, (R * Math.abs(s) * sinT + item) * mag);
  }
  return max;
}

export function initMarqueeTbx() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-tbx]');
  if (!nodes.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS shows the plain word list
  nodes.forEach((el) => {
    if (el.dataset.tbxMounted) return;
    el.dataset.tbxMounted = '1';
    let over: any = {};
    try { over = JSON.parse(el.dataset.tbxConfig || '{}'); } catch { over = {}; }
    const conf = (TBX as any).resolve(over.preset || 'marquee');
    if (over.words?.length) conf.words = over.words.slice();
    ['divider', 'fit', 'tube'].forEach((g) => { if (over[g]) Object.assign(conf[g] ||= {}, over[g]); });
    if (conf.divider?.mode === 'svg' && !conf.divider.svg) delete conf.divider.svg; // bundled sample
    (TBX as any).mount(el, conf);

    // ---- size the section to the tube ----
    const host = el.closest<HTMLElement>('.mtbx') || el;
    const full = host.dataset.height === 'full';
    let queued = 0;
    const fit = () => {
      queued = 0;
      const cell = el.querySelector<HTMLElement>('.tbx__cell');
      if (!cell) return;
      const m = /translate3d\(\s*(-?[\d.]+)px\s*,[^,]+,\s*(-?[\d.]+)px/.exec(cell.style.transform || '');
      if (!m) return;
      const R = Math.hypot(parseFloat(m[1]), parseFloat(m[2]));
      const font = parseFloat(getComputedStyle(cell).fontSize) || 40;
      const P = parseFloat(getComputedStyle(el).perspective) || 1000;
      const margin = Math.max(24, Math.min(64, innerHeight * 0.05));
      const need = Math.ceil(2 * tubeHalfExtent(R, font, P, conf.tube.tilt || 0) + 2 * margin);
      const h = full ? Math.max(innerHeight, need) : need;
      if (Math.abs((parseFloat(host.style.getPropertyValue('--mtbx-h')) || 0) - h) > 1) host.style.setProperty('--mtbx-h', `${h}px`);
    };
    const request = () => { if (!queued) queued = requestAnimationFrame(fit); };
    // the engine rewrites --tbx-perspective on the section after every layout → refit then
    new MutationObserver(request).observe(el, { attributes: true, attributeFilter: ['style'] });
    addEventListener('resize', request);
    document.fonts?.ready.then(() => setTimeout(request, 60));
    request();
  });
}
