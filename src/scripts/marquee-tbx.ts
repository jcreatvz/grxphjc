// Mounts the TBX tube engine on every [data-tbx] section.
// The engine carries its own IntersectionObserver + rAF loop per instance and idles off-screen,
// so several tubes on one page are fine as long as each gets its OWN config object.
import TBX from './tbx';

export function initMarqueeTbx() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-tbx]');
  if (!nodes.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS shows the plain word list
  nodes.forEach((el) => {
    if (el.dataset.tbxMounted) return;
    el.dataset.tbxMounted = '1';
    let over: any = {};
    try { over = JSON.parse(el.dataset.tbxConfig || '{}'); } catch { over = {}; }
    const cfg = (TBX as any).resolve ? (TBX as any).resolve(over.preset || 'marquee') : null;
    const conf = cfg || JSON.parse(JSON.stringify((window as any).TBX_DEFAULTS || {}));
    if (over.words?.length) conf.words = over.words.slice();
    ['divider', 'fit', 'tube'].forEach((g) => { if (over[g]) Object.assign(conf[g] ||= {}, over[g]); });
    if (conf.divider?.mode === 'svg' && !conf.divider.svg) delete conf.divider.svg; // fall back to the bundled sample
    (TBX as any).mount(el, conf);
  });
}
