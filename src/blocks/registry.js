// The one place block types are wired to their components + schemas.
// Add a new block: create src/blocks/<type>/{Component.astro, schema.js},
// then add one line here. Nothing else changes.
import Hero from './hero/Hero.astro';
import heroSchema from './hero/schema.js';
import Gallery from './gallery/Gallery.astro';
import gallerySchema from './gallery/schema.js';

export const blockRegistry = {
  hero:    { component: Hero,    schema: heroSchema },
  gallery: { component: Gallery, schema: gallerySchema },
};

/**
 * Apply a schema's defaults to a settings object.
 * Lets projects omit fields they don't care about.
 */
export function applyDefaults(type, settings = {}) {
  const entry = blockRegistry[type];
  if (!entry) return settings;
  const out = { ...settings };
  for (const field of entry.schema.settings) {
    if (out[field.id] === undefined && field.default !== undefined) {
      out[field.id] = field.default;
    }
  }
  return out;
}
