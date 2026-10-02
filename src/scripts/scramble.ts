// Character scramble on hover/focus for [data-scramble] (terminal/brutalist nod).
const GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// "swap" mode: the word's OWN letters trade places, then settle left to right.
// Used on the brand-font logo so every frame stays in the graffiti face.
function runSwap(el: HTMLElement) {
  const final = el.dataset.text ?? (el.dataset.text = el.textContent ?? '');
  const chars = [...final];
  const slots = chars.map((c, i) => (c.trim() ? i : -1)).filter((i) => i >= 0);
  if (slots.length < 2) return;
  el.dataset.scrambling = '1';
  const start = performance.now(), dur = Math.min(900, 320 + slots.length * 70), STEP = 70;
  let last = -STEP;
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / dur);
    if (t - last >= STEP || k >= 1) {
      last = t;
      const open = slots.slice(Math.floor(k * slots.length));
      const pool = open.map((i) => chars[i]);
      for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const out = chars.slice(); open.forEach((pos, n) => { out[pos] = pool[n]; });
      el.textContent = out.join('');
    }
    if (k < 1) requestAnimationFrame(step);
    else { el.textContent = final; delete el.dataset.scrambling; }
  };
  requestAnimationFrame(step);
}

function run(el: HTMLElement) {
  if (reduce.matches || el.dataset.scrambling) return;
  if (el.dataset.scramble === 'swap') return runSwap(el);
  const final = el.dataset.text ?? (el.dataset.text = el.textContent ?? '');
  el.dataset.scrambling = '1';
  const start = performance.now(), dur = Math.min(700, 220 + final.length * 45);
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / dur);
    const settled = Math.floor(k * final.length);
    let out = '';
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      out += i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (k < 1) requestAnimationFrame(step);
    else { el.textContent = final; delete el.dataset.scrambling; }
  };
  requestAnimationFrame(step);
}

export function initScramble() {
  const trigger = (e: Event) => {
    const host = (e.target as HTMLElement).closest?.('a, button, [data-scramble]');
    if (!host) return;
    const targets = host.matches('[data-scramble]') ? [host] : [...host.querySelectorAll('[data-scramble]')];
    targets.forEach((t) => run(t as HTMLElement));
  };
  document.addEventListener('pointerover', (e) => {
    const host = (e.target as HTMLElement).closest?.('a, button, [data-scramble]');
    const from = (e as PointerEvent).relatedTarget as Node | null;
    if (host && (!from || !host.contains(from))) trigger(e);
  });
  document.addEventListener('focusin', trigger);
}
