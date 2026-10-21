// Shared spring physics — the same model John tuned in the v0.9 mock-ups.
// Semi-implicit Euler with 240 Hz sub-steps: stable at any frame rate.
//   a = -k·(x - target) - 2ζ√k·v + force      (mass = 1)
// k = stiffness, ζ = damping ratio (1 = no bounce, lower = bouncier).
export interface Spring { x: number; v: number }

export function stepSpring(s: Spring, target: number, k: number, zeta: number, dt: number, force = 0) {
  const c = 2 * zeta * Math.sqrt(k), t = Math.min(dt, 1 / 20), n = Math.max(1, Math.ceil(t * 240)), h = t / n;
  for (let i = 0; i < n; i++) { const a = -k * (s.x - target) - c * s.v + force; s.v += a * h; s.x += s.v * h; }
}

/** Quick, smooth deceleration (the footer's "smooth" motion). */
export const easeOutExpo = (k: number) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
