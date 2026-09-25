import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Projects live as JSON files in src/content/projects/*.json
// The `blocks` array is intentionally open-ended — each block's `settings`
// object is validated at render time against its own schema in src/blocks/*.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    client: z.string().optional(),
    year: z.number().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Optional per-page shell overrides (Option A: modifier fields only).
    header: z.object({
      theme: z.enum(['light', 'dark']).optional(),
      transparent: z.boolean().optional(),
      sticky: z.boolean().optional(),
    }).optional(),
    footer: z.object({
      theme: z.enum(['light', 'dark']).optional(),
    }).optional(),

    blocks: z.array(
      z.object({
        type: z.string(),
        settings: z.record(z.any()),
      })
    ),
  }),
});

export const collections = { projects };
