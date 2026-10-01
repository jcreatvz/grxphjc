// Intro loader: progress follows real image + font loading, with a floor so it
// reads as an intentional moment and a ceiling so it can never trap the visitor.
const MIN = 1500, MAX = 6500;

export function initLoader(done: () => void) {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('.loader');
  const ready = () => { document.dispatchEvent(new CustomEvent('grx:ready')); done(); };
  if (!el || !root.classList.contains('is-loading')) { ready(); return; }

  const count = el.querySelector<HTMLElement>('[data-loader-count]')!;
  const t0 = performance.now();
  const imgs = [...document.images].filter((i) => i.loading !== 'lazy');
  const total = imgs.length + 1;
  let loaded = 0, shown = 0, finished = false;
  const bump = () => { loaded++; };
  imgs.forEach((i) => (i.complete ? bump() : (i.addEventListener('load', bump, { once: true }), i.addEventListener('error', bump, { once: true }))));
  (document.fonts?.ready ?? Promise.resolve()).then(bump);

  const finish = () => {
    if (finished) return; finished = true;
    el.style.setProperty('--p', '1'); count.textContent = '100';
    setTimeout(() => el.classList.add('is-flood'), 180);
    setTimeout(() => el.classList.add('is-out'), 820);
    setTimeout(() => {
      root.classList.remove('is-loading');
      try { sessionStorage.setItem('grxphjc-loader', '1'); } catch {}
      ready();
    }, 1300);
  };
  const tick = () => {
    if (finished) return;
    const t = performance.now() - t0;
    const target = Math.min(loaded / total, t / MIN);       // never faster than MIN
    shown += (target - shown) * 0.12;
    el.style.setProperty('--p', shown.toFixed(3));
    count.textContent = String(Math.round(shown * 100));
    if ((shown > 0.985 && t >= MIN) || t >= MAX) return finish();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  el.querySelector('[data-loader-skip]')?.addEventListener('click', finish);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') finish(); }, { once: true });
}
