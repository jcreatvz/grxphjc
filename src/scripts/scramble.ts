// Character scramble on hover/focus for [data-scramble] (terminal/brutalist nod).
const GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

function run(el: HTMLElement) {
  if (reduce.matches || el.dataset.scrambling) return;
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
