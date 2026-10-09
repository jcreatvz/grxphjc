// Top-frame scroll progress line.
// Measured against the CONTENT (up to the footer marker), not the whole document, so it
// doesn't jump when the footer opens or closes (v0.9).
export function initProgress() {
  const frame = document.querySelector<HTMLElement>('.site-frame');
  if (!frame) return;
  const marker = document.querySelector<HTMLElement>('[data-footer-marker]');
  let queued = false;
  const update = () => {
    queued = false;
    const end = marker ? marker.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight;
    const max = end - innerHeight;
    frame.style.setProperty('--progress', String(max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0));
  };
  const req = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
}
