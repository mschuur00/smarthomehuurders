import { defineCollection, z } from 'astro:content';

const artikelen = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    /** Optioneel: datum van laatste inhoudelijke update (toont "Bijgewerkt op"). */
    updatedDate: z.date().optional(),
    category: z.string(), // bijv. "smart-lighting", "smart-locks"
    affiliateDisclosure: z.boolean().default(true),
    /** true = niet publiceren (pagina wordt niet gebouwd en nergens getoond). */
    draft: z.boolean().default(false),
    /** Optioneel: eigen social-afbeelding, pad t.o.v. public/ (bijv. "og/beste-slimme-stekkers.png", 1200x630). */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** Optioneel: "Snelle keuze"-box bovenaan het artikel (max 5 producten). */
    snelleKeuze: z
      .array(
        z.object({
          label: z.string(), // bijv. "Beste keuze", "Beste budget"
          product: z.string(),
          reden: z.string().optional(), // één korte zin
          url: z.string().url(), // affiliate link
          winkel: z.string().optional(), // bijv. "bol" → knoptekst "Bekijk bij bol"
          knop: z.string().optional(), // eigen knoptekst (overschrijft winkel)
        })
      )
      .max(5)
      .optional(),
  }),
});

export const collections = { artikelen };
