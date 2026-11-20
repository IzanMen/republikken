import { withPrices } from './data/copy';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    description: z.string().transform(withPrices).pipe(z.string().max(155)),
    category: z.string(),
    readingTime: z.string(),
    cta: z.string(),
    ctaLabel: z.string(),
  }),
});
export const collections = { guias };
