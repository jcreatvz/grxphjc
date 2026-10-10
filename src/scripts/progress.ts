// Top-frame scroll progress line.
// Since v0.10 (curtain footer) the page height never changes, so this simply measures the whole
// document. (A [data-footer-marker] element, if ever present, still caps it at the content end.)
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
