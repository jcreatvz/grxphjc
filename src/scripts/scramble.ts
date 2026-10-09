// Character scramble for [data-scramble] (terminal/brutalist nod).
//
// Speed (v0.9) — first match wins:
//   1. data-scramble-ms="400" on the element
//   2. CSS custom property --scramble-ms (global default lives in tokens.css; "auto" = built-in)
//   3. built-in auto timing (random: 220ms + 45ms/char, max 700 · swap: 320ms + 70ms/letter, max 900)
// Nothing changes until a speed is declared.
const GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const frames = new WeakMap<HTMLElement, number>();

const finalOf = (el: HTMLElement) => el.dataset.text ?? (el.dataset.text = el.textContent ?? '');
function msFor(el: HTMLElement, auto: number) {
  const a = parseFloat(el.dataset.scrambleMs ?? '');
  if (a > 0) return a;
  const c = parseFloat(getComputedStyle(el).getPropertyValue('--scramble-ms'));
  return c > 0 ? c : auto;
}

export function cancelScramble(el: HTMLElement) {
  const id = frames.get(el);
  if (id !== undefined) { cancelAnimationFrame(id); frames.delete(el); }
  if (el.dataset.text !== undefined) el.textContent = el.dataset.text;
  delete el.dataset.scrambling;
}

// "swap": the word's OWN letters trade places, then settle left to right — stays in the brand font.
function runSwap(el: HTMLElement, ms?: number, step = 70) {
  const final = finalOf(el);
  const chars = [...final];
  const slots = chars.map((c, i) => (c.trim() ? i : -1)).filter((i) => i >= 0);
  if (slots.length < 2) return;
  el.dataset.scrambling = '1';
  const start = performance.now(), dur = ms ?? msFor(el, Math.min(900, 320 + slots.length * 70));
  let last = -step;
  const tick = (t: number) => {
    const k = Math.min(1, (t - start) / dur);
    if (t - last >= step || k >= 1) {
      last = t;
      const open = slots.slice(Math.floor(k * slots.length));
      const pool = open.map((i) => chars[i]);
      for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const out = chars.slice(); open.forEach((pos, n) => { out[pos] = pool[n]; });
      el.textContent = out.join('');
    }
    if (k < 1) frames.set(el, requestAnimationFrame(tick));
    else { frames.delete(el); el.textContent = final; delete el.dataset.scrambling; }
  };
  frames.set(el, requestAnimationFrame(tick));
}

function runRandom(el: HTMLElement, ms?: number) {
  const final = finalOf(el);
  el.dataset.scrambling = '1';
  const start = performance.now(), dur = ms ?? msFor(el, Math.min(700, 220 + final.length * 45));
  const tick = (t: number) => {
    const k = Math.min(1, (t - start) / dur);
    const settled = Math.floor(k * final.length);
    let out = '';
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      out += i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (k < 1) frames.set(el, requestAnimationFrame(tick));
    else { frames.delete(el); el.textContent = final; delete el.dataset.scrambling; }
  };
  frames.set(el, requestAnimationFrame(tick));
}

function run(el: HTMLElement) {
  if (reduce.matches || el.dataset.scrambling) return;
  if (el.dataset.scramble === 'swap') return runSwap(el);
  runRandom(el);
}

/** Programmatic one-shot (e.g. the footer watermark). Cancels any run in progress first. */
export function scrambleOnce(el: HTMLElement, opts: { mode?: 'swap' | 'random'; ms?: number; step?: number } = {}) {
  if (reduce.matches) return;
  cancelScramble(el);
  if (opts.mode === 'random') runRandom(el, opts.ms); else runSwap(el, opts.ms, opts.step);
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
