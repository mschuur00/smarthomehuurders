import { defineCollection, z } from 'astro:content';

const artikelen = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.string(), // bijv. "smart-lighting", "smart-locks"
    affiliateDisclosure: z.boolean().default(true),
  }),
});

export const collections = { artikelen };
