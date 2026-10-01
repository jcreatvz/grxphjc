// Shared popup. Triggers: any [data-lb] element (button/a). Items in the same
// [data-lb-group] become a browsable set. Other scripts can call openLightbox().
import { trap, lock, unlock } from './focus';

export interface LbItem { src: string; title: string; meta?: string; note?: string; href?: string; }

let api: { open: (items: LbItem[], i: number, from?: Element | null) => void } | null = null;
export const openLightbox = (items: LbItem[], i: number, from?: Element | null) => api?.open(items, i, from);

export function itemFrom(el: HTMLElement): LbItem {
  const d = el.dataset;
  return { src: d.lbSrc || '', title: d.lbTitle || '', meta: d.lbMeta, note: d.lbNote, href: d.lbHref };
}

export function initLightbox() {
  const lb = document.querySelector<HTMLElement>('.lb');
  if (!lb) return;
  const plate = lb.querySelector<HTMLElement>('.lb__plate')!;
  const img = lb.querySelector<HTMLImageElement>('.lb__img')!;
  const title = lb.querySelector<HTMLElement>('.lb__title')!;
  const sub = lb.querySelector<HTMLElement>('.lb__sub')!;
  const note = lb.querySelector<HTMLElement>('.lb__note')!;
  const link = lb.querySelector<HTMLAnchorElement>('.lb__link')!;
  const count = lb.querySelector<HTMLElement>('[data-lb-count]')!;
  let items: LbItem[] = [], idx = 0, from: Element | null = null, isOpen = false;
  let release: (() => void) | null = null, returnTo: HTMLElement | null = null;
  const pad = (n: number) => String(n).padStart(2, '0');

  const flip = (el: Element | null) => {
    if (!el) return 'translateY(24px) scale(0.96)';
    const a = el.getBoundingClientRect(), b = plate.getBoundingClientRect();
    const k = Math.max(0.05, a.width / (b.width || 1));
    return `translate(${(a.left + a.width / 2 - (b.left + b.width / 2)).toFixed(1)}px, ${(a.top + a.height / 2 - (b.top + b.height / 2)).toFixed(1)}px) scale(${k.toFixed(4)})`;
  };
  const fill = () => {
    const it = items[idx];
    img.src = it.src; img.alt = it.title;
    title.textContent = it.title; sub.textContent = it.meta || ''; note.textContent = it.note || '';
    note.hidden = !it.note;
    link.hidden = !it.href; if (it.href) link.href = it.href;
    count.textContent = `${pad(idx + 1)} / ${pad(items.length)}`;
    lb.classList.toggle('is-single', items.length < 2);
  };
  const open = (list: LbItem[], i: number, src?: Element | null) => {
    if (!list.length) return;
    items = list; idx = Math.max(0, Math.min(i, list.length - 1)); from = src ?? null;
    fill();
    returnTo = document.activeElement as HTMLElement;
    lb.inert = false; lb.classList.add('is-open'); lock(); release = trap(lb);
    plate.style.transition = 'none'; plate.style.opacity = '0'; plate.style.transform = flip(from);
    void plate.offsetWidth;
    plate.style.transition = ''; plate.style.opacity = ''; plate.style.transform = '';
    isOpen = true;
    lb.querySelector<HTMLElement>('.lb__btn--close')?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('grx:lightbox', { detail: { open: true } }));
  };
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    plate.style.transform = flip(from); plate.style.opacity = '0';
    lb.classList.remove('is-open'); release?.(); unlock();
    setTimeout(() => { if (!isOpen) { lb.inert = true; plate.style.transition = 'none'; plate.style.transform = ''; void plate.offsetWidth; plate.style.transition = ''; } }, 600);
    returnTo?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('grx:lightbox', { detail: { open: false } }));
  };
  const go = (d: number) => { if (items.length < 2) return; idx = (idx + d + items.length) % items.length; from = null; fill(); };

  api = { open };
  lb.querySelectorAll('[data-lb-close]').forEach((b) => b.addEventListener('click', close));
  lb.querySelector('[data-lb-prev]')?.addEventListener('click', () => go(-1));
  lb.querySelector('[data-lb-next]')?.addEventListener('click', () => go(1));
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });
  // Generic delegation (orbit sphere handles its own clicks to respect drag).
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-lb]');
    if (!t || t.closest('[data-orbit-stage]')) return;
    e.preventDefault();
    const group = t.closest('[data-lb-group]');
    const els = group ? [...group.querySelectorAll<HTMLElement>('[data-lb]')] : [t];
    open(els.map(itemFrom), els.indexOf(t), t.querySelector('img') ?? t);
  });
}
