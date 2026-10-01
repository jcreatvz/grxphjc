// Tiny focus-trap + scroll-lock helpers shared by menu and lightbox.
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function trap(container: HTMLElement) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const els = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null && !el.hidden);
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

let locks = 0;
export function lock()   { if (locks++ === 0) document.body.classList.add('is-locked'); }
export function unlock() { if (--locks <= 0) { locks = 0; document.body.classList.remove('is-locked'); } }
