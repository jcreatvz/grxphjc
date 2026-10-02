import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const block = z.object({ type: z.string(), settings: z.record(z.any()).default({}) });
// Option A whitelist: pages may tweak chrome modifiers, never replace chrome blocks.
const chrome = z.object({
  theme: z.enum(['auto', 'light', 'dark']).optional(),
  transparent: z.boolean().optional(),
}).optional();

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    client: z.string().optional(),
    year: z.number().optional(),
    cover: z.string().optional(),
    summary: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional(),
    tags: z.array(z.string()).default([]),
    header: chrome,
    blocks: z.array(block),
  }),
});

// Pages are block-built too: home.json → "/", about.json → "/about", etc.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
    header: chrome,
    blocks: z.array(block),
  }),
});

export const collections = { projects, pages };
