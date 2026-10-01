type Key = 'theme' | 'accent' | 'cursor';
const STORE: Record<Key, string> = { theme: 'grxphjc-theme', accent: 'grxphjc-accent', cursor: 'grxphjc-cursor' };
const root = document.documentElement;

function sync(key: Key) {
  const v = root.getAttribute(`data-${key}`);
  document.querySelectorAll<HTMLButtonElement>(`[data-pref="${key}"] button`).forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.value === v)));
}

export function setPref(key: Key, value: string) {
  root.setAttribute(`data-${key}`, value);
  try { localStorage.setItem(STORE[key], value); } catch {}
  sync(key);
  document.dispatchEvent(new CustomEvent('grx:pref', { detail: { key, value } }));
}

export function initPrefs() {
  (Object.keys(STORE) as Key[]).forEach(sync);
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pref] button');
    if (!btn) return;
    const key = btn.parentElement!.dataset.pref as Key;
    if (key && btn.dataset.value) setPref(key, btn.dataset.value);
  });
}
