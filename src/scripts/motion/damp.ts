// Frame-rate-independent exponential damping — the "weight" behind smooth-following motion.
// `k` is the share of the remaining distance covered per 60fps frame (bokid used 0.09).
// At 120Hz or 30Hz the motion takes the same real time, because dt scales the exponent.
export const damp = (current: number, target: number, k: number, dtMs: number) =>
  current + (target - current) * (1 - Math.pow(1 - k, dtMs / (1000 / 60)));
