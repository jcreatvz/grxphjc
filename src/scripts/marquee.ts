// Duplicates marquee content until it overfills the track, so the loop never shows a gap.
export function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((track) => {
    const seq = track.querySelector<HTMLElement>('[data-marquee-seq]');
    if (!seq) return;
    const need = () => Math.ceil((track.parentElement!.offsetWidth * 2) / Math.max(1, seq.offsetWidth)) + 1;
    const fill = () => {
      track.querySelectorAll('[data-marquee-clone]').forEach((c) => c.remove());
      for (let i = 1; i < need(); i++) {
        const c = seq.cloneNode(true) as HTMLElement;
        c.removeAttribute('data-marquee-seq'); c.setAttribute('data-marquee-clone', ''); c.setAttribute('aria-hidden', 'true');
        track.appendChild(c);
      }
      track.style.setProperty('--seq-w', `${seq.offsetWidth}px`);
    };
    fill();
    let t = 0; addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(fill, 200); });
    document.fonts?.ready.then(fill);
  });
}
