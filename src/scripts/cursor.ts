// Crosshair follower. Works only with a fine pointer + data-cursor="custom".
export function initCursor() {
  const el = document.querySelector<HTMLElement>('.cursor');
  if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const root = document.documentElement;
  let tx = -100, ty = -100, x = -100, y = -100, running = false;
  const HOVER = 'a, button, [role="button"], label, summary, [data-cursor-hover]';
  const loop = () => {
    x += (tx - x) * 0.28; y += (ty - y) * 0.28;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (Math.abs(tx - x) + Math.abs(ty - y) > 0.2) requestAnimationFrame(loop); else running = false;
  };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || root.dataset.cursor !== 'custom') return;
    tx = e.clientX; ty = e.clientY;
    el.classList.add('is-on');
    el.classList.toggle('is-hover', !!(e.target as HTMLElement).closest?.(HOVER));
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });
  addEventListener('pointerdown', () => el.classList.add('is-down'));
  addEventListener('pointerup', () => el.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => el.classList.remove('is-on'));
  addEventListener('blur', () => el.classList.remove('is-on'));
}
