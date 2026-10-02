// Video + embed behaviour. Everything is opt-in markup: [data-video] and [data-embed].
//
// loop mode   muted + playsinline, plays while >=35% on screen, pauses when it leaves.
//             Reduced motion or data-saver: no autoplay — poster + Play button instead.
// click mode  poster + Play button; click starts it (with sound) and shows native controls.
//             Pauses if scrolled away; the visitor can resume with the controls.
// embeds      a facade: nothing from YouTube/Vimeo loads until Play is clicked.
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = () => (navigator as any).connection?.saveData === true;

export function initVideos() {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach(setupVideo);
  document.querySelectorAll<HTMLElement>('[data-embed]').forEach(setupEmbed);
}

function setupVideo(box: HTMLElement) {
  const v = box.querySelector<HTMLVideoElement>('video');
  if (!v) return;
  const btn = box.querySelector<HTMLButtonElement>('[data-video-play]');
  const loopMode = box.dataset.mode === 'loop';
  v.removeAttribute('controls'); v.controls = false; // custom Play button until started (no-JS keeps native controls)

  const started = () => { box.classList.add('is-playing'); box.classList.remove('needs-play'); };
  v.addEventListener('playing', started);
  const tryPlay = () => v.play().then(started).catch((err: DOMException) => {
    if (err?.name === 'NotAllowedError') box.classList.add('needs-play'); // AbortError = we paused it ourselves
  });

  btn?.addEventListener('click', () => {
    if (!loopMode) v.muted = false;
    if (!loopMode || reduce() || saveData()) v.controls = true;
    if (loopMode && reduce()) v.loop = false;
    tryPlay();
  });

  if (loopMode) {
    if (reduce() || saveData()) { box.classList.add('needs-play'); return; }
    new IntersectionObserver(([e]) => { e.isIntersecting ? tryPlay() : v.pause(); }, { threshold: 0.35 }).observe(box);
  } else {
    new IntersectionObserver(([e]) => { if (!e.isIntersecting && !v.paused) v.pause(); }, { threshold: 0.1 }).observe(box);
  }
}

function setupEmbed(box: HTMLElement) {
  const btn = box.querySelector<HTMLButtonElement>('[data-embed-play]');
  const src = box.dataset.embedSrc;
  if (!btn || !src) return;
  btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.className = 'embed__frame';
    f.src = src;
    f.title = box.dataset.embedTitle || 'Video';
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    box.appendChild(f);
    box.classList.add('is-loaded');
    f.focus();
  });
}
