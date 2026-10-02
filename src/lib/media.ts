// Build-time image aspect ratios for local images in /public.
// Lets layouts size frames explicitly (width = height x ratio) instead of relying on
// intrinsic image sizing, which WebKit/Safari resolves differently from Chrome.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { imageSize } from 'image-size';

const cache = new Map<string, number | null>();

/** width / height, or null if unknown (remote URL or unreadable). EXIF rotation respected. */
export function aspectOf(src: string): number | null {
  if (!src || /^(https?:)?\/\//.test(src)) return null;
  if (cache.has(src)) return cache.get(src)!;
  let r: number | null = null;
  try {
    const d = imageSize(readFileSync(join(process.cwd(), 'public', src.replace(/^\//, ''))));
    if (d.width && d.height) {
      const rotated = (d.orientation ?? 1) >= 5;
      r = rotated ? d.height / d.width : d.width / d.height;
    }
  } catch { r = null; }
  cache.set(src, r);
  return r;
}
