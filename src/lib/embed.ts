// YouTube / Vimeo URL -> a privacy-friendly embed src. We never use the pasted URL as the
// iframe src: only an ID that passes strict validation is placed into a URL we build.
export interface Embed { provider: 'youtube' | 'vimeo'; id: string; label: string; src: string; }

export function parseEmbed(input: string): Embed | null {
  let u: URL;
  try { u = new URL(String(input ?? '').trim()); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const host = u.hostname.replace(/^(www|m)\./, '');

  let yt: string | null = null;
  if (host === 'youtu.be') yt = u.pathname.split('/')[1] || null;
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (u.pathname === '/watch') yt = u.searchParams.get('v');
    else { const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]+)/); yt = m ? m[1] : null; }
  }
  if (yt && /^[\w-]{11}$/.test(yt)) {
    return { provider: 'youtube', id: yt, label: 'YouTube',
      src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1` };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/\/(\d{6,12})(?:\/([a-f0-9]{6,12}))?/);
    if (m) {
      const hash = m[2] || u.searchParams.get('h') || '';
      const h = /^[a-f0-9]{6,12}$/.test(hash) ? `&h=${hash}` : '';
      return { provider: 'vimeo', id: m[1], label: 'Vimeo',
        src: `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1&title=0&byline=0&portrait=0${h}` };
    }
  }
  return null;
}
