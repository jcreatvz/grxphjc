// Scroll progress (v0.14): drawn as an outline of the whole screen.
// A rounded rectangle just inside the screen edges (inset + device safe areas, corner radius from
// CSS via .edge-ruler), starting at the top-left corner, clockwise by default. Progress = how much
// of its perimeter is drawn (stroke-dasharray), so it reads the same on every screen shape.
// The page's --progress (0..1) is still set on .site-frame for anything else that wants it.
export function initProgress() {
  const frame = document.querySelector<HTMLElement>('.site-frame');
  const svg = document.querySelector<SVGSVGElement>('[data-edge-progress]');
  const ruler = document.querySelector<HTMLElement>('[data-edge-ruler]');
  const line = svg?.querySelector<SVGPathElement>('.edge-progress__line') ?? null;
  const nub = svg?.querySelector<SVGRectElement>('.edge-progress__nub') ?? null;
  let L = 0, queued = false;

  const geometry = () => {
    if (!svg || !ruler || !line) return;
    const cs = getComputedStyle(ruler), sw = 2;
    const W = svg.clientWidth, H = svg.clientHeight;
    const t = parseFloat(cs.paddingTop) + sw / 2, r0 = parseFloat(cs.paddingRight) + sw / 2;
    const b = parseFloat(cs.paddingBottom) + sw / 2, l = parseFloat(cs.paddingLeft) + sw / 2;
    const r = Math.max(0, Math.min(parseFloat(cs.borderTopLeftRadius) || 0, (W - l - r0) / 2, (H - t - b) / 2));
    const R = W - r0, B = H - b, f = (n: number) => n.toFixed(2);
    // starts AT the top-left corner and ends there after one lap
    const cw = `M${f(l)} ${f(t + r)} A${f(r)} ${f(r)} 0 0 1 ${f(l + r)} ${f(t)} H${f(R - r)} A${f(r)} ${f(r)} 0 0 1 ${f(R)} ${f(t + r)} ` +
               `V${f(B - r)} A${f(r)} ${f(r)} 0 0 1 ${f(R - r)} ${f(B)} H${f(l + r)} A${f(r)} ${f(r)} 0 0 1 ${f(l)} ${f(B - r)} V${f(t + r)}`;
    const ccw = `M${f(l + r)} ${f(t)} A${f(r)} ${f(r)} 0 0 0 ${f(l)} ${f(t + r)} V${f(B - r)} A${f(r)} ${f(r)} 0 0 0 ${f(l + r)} ${f(B)} ` +
                `H${f(R - r)} A${f(r)} ${f(r)} 0 0 0 ${f(R)} ${f(B - r)} V${f(t + r)} A${f(r)} ${f(r)} 0 0 0 ${f(R - r)} ${f(t)} H${f(l + r)}`;
    line.setAttribute('d', svg.dataset.direction === 'counter-clockwise' ? ccw : cw);
    L = line.getTotalLength();
    line.style.strokeDasharray = `${L} ${L}`;
  };
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    frame?.style.setProperty('--progress', String(p));
    if (line && L) {
      line.style.strokeDashoffset = (L * (1 - p)).toFixed(2);
      if (nub) { const pt = line.getPointAtLength(L * p); nub.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); nub.style.opacity = p > 0.001 ? '1' : '0'; }
    }
  };
  const req = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  const reshape = () => { geometry(); req(); };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', reshape);
  if (svg) new ResizeObserver(reshape).observe(svg);
  new ResizeObserver(req).observe(document.documentElement);   // page height changes (images, toggles)
  reshape();
}
