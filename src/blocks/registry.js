// Content block registry — used by project pages.
// applyDefaults now lives in ./utils.js so shell blocks share it.
import Hero from './hero/Hero.astro';
import heroSchema from './hero/schema.js';
import Gallery from './gallery/Gallery.astro';
import gallerySchema from './gallery/schema.js';

export const blockRegistry = {
  hero:    { component: Hero,    schema: heroSchema },
  gallery: { component: Gallery, schema: gallerySchema },
};
