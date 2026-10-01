import { trap, lock, unlock } from './focus';

export function initMenu() {
  const menu = document.getElementById('site-menu');
  if (!menu) return;
  const openers = [...document.querySelectorAll<HTMLElement>('[data-menu-open]')];
  let open = false, release: (() => void) | null = null, returnTo: HTMLElement | null = null;

  const set = (next: boolean) => {
    if (next === open) return;
    open = next;
    menu.classList.toggle('is-open', open);
    openers.forEach((b) => b.setAttribute('aria-expanded', String(open)));
    if (open) {
      returnTo = document.activeElement as HTMLElement;
      menu.inert = false; lock(); release = trap(menu);
      setTimeout(() => menu.querySelector<HTMLElement>('[data-menu-link]')?.focus({ preventScroll: true }), 80);
    } else {
      release?.(); release = null; unlock();
      setTimeout(() => { if (!open) menu.inert = true; }, 600);
      returnTo?.focus({ preventScroll: true });
    }
  };

  openers.forEach((b) => b.addEventListener('click', () => set(!open)));
  menu.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => set(false)));
  menu.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
}
