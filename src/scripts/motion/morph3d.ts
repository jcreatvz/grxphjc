// 3D morphs — tween every element's full 3D pose AND the camera together, in the perspective
// space the scene already lives in. No library: CSS 3D transforms are the renderer.
//
//   card:   translate3d(x, y, z) rotateY(ry) rotateX(rx) scale(s)   (+ opacity, --d shade, --g grayscale)
//   camera: translateZ(camZ) rotateY(sy) rotateX(sx)                 (the `.orbit__world` element)
//
// Angles always take the short way round, so a card on the far side of a sphere swings through
// at most a half-turn. Each element can start late (`delays`) for a cascade; everything still
// lands together at `ms`.
export interface Pose3 { x: number; y: number; z: number; ry: number; rx: number; s: number; o: number; d: number; g: number }
export interface Cam3 { camZ: number; sx: number; sy: number }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** `to`, shifted by whole turns so it is within half a turn of `from`. */
export const shortestTo = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360 - 180);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const poseCss = (p: Pose3) =>
  `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, ${p.z.toFixed(2)}px) rotateY(${p.ry.toFixed(3)}deg) rotateX(${p.rx.toFixed(3)}deg) scale(${p.s.toFixed(4)})`;
export const camCss = (c: Cam3) => `translateZ(${c.camZ.toFixed(2)}px) rotateY(${c.sy.toFixed(3)}deg) rotateX(${c.sx.toFixed(3)}deg)`;

export function applyPose(el: HTMLElement, p: Pose3) {
  el.style.transform = poseCss(p);
  el.style.opacity = p.o.toFixed(3);
  el.style.setProperty('--d', p.d.toFixed(3));
  el.style.setProperty('--g', p.g.toFixed(3));
}

export function morph3d(o: {
  world: HTMLElement; els: HTMLElement[]; from: Pose3[]; to: Pose3[]; camFrom: Cam3; camTo: Cam3;
  ms?: number; delays?: number[]; ease?: (t: number) => number; onFrame?: (k: number, cam: Cam3) => void;
}): Promise<void> {
  const ms = o.ms ?? 1250, ease = o.ease ?? easeInOutCubic;
  const delays = o.delays ?? o.els.map(() => 0);
  const maxD = Math.min(ms * 0.4, Math.max(0, ...delays));
  const to = o.to.map((t, i) => ({ ...t, ry: shortestTo(o.from[i].ry, t.ry), rx: shortestTo(o.from[i].rx, t.rx) }));
  const camTo = { ...o.camTo, sy: shortestTo(o.camFrom.sy, o.camTo.sy), sx: shortestTo(o.camFrom.sx, o.camTo.sx) };
  return new Promise((res) => {
    const t0 = performance.now();
    const step = (now: number) => {
      const el = now - t0, kc = ease(clamp01(el / ms));
      const cam = { camZ: lerp(o.camFrom.camZ, camTo.camZ, kc), sx: lerp(o.camFrom.sx, camTo.sx, kc), sy: lerp(o.camFrom.sy, camTo.sy, kc) };
      o.world.style.transform = camCss(cam);
      for (let i = 0; i < o.els.length; i++) {
        const a = o.from[i], b = to[i], k = ease(clamp01((el - Math.min(delays[i], maxD)) / (ms - maxD)));
        applyPose(o.els[i], { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k), ry: lerp(a.ry, b.ry, k), rx: lerp(a.rx, b.rx, k),
          s: lerp(a.s, b.s, k), o: lerp(a.o, b.o, k), d: lerp(a.d, b.d, k), g: lerp(a.g, b.g, k) });
      }
      o.onFrame?.(kc, cam);
      if (el < ms) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}
