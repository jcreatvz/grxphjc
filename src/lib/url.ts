// Resolve authored paths against the deploy base (/grxphjc).
// External (http, mailto, tel) and pure hash links pass through untouched.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(h: string = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(h)) return h;
  return `${BASE}${h.startsWith('/') ? h : `/${h}`}`;
}

export function isExternal(h: string = ''): boolean {
  return /^https?:/.test(h);
}
