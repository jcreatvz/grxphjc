import { getCollection } from 'astro:content';

/** Projects in display order: `order` ascending, then newest year, then title. */
export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) =>
    (a.data.order ?? 999) - (b.data.order ?? 999) ||
    (b.data.year ?? 0) - (a.data.year ?? 0) ||
    a.data.title.localeCompare(b.data.title));
}

/** "Category — Year" (falls back to client). */
export const projectMeta = (d: { category?: string; client?: string; year?: number }) =>
  [d.category ?? d.client, d.year].filter(Boolean).join(' — ');
