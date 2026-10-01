// Top-frame scroll progress line.
export function initProgress() {
  const frame = document.querySelector<HTMLElement>('.site-frame');
  if (!frame) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    frame.style.setProperty('--progress', String(max > 0 ? Math.min(1, scrollY / max) : 0));
  };
  const req = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
}
