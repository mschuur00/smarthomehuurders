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

/**
 * Producten voor het vergelijk-/filteroverzicht op categoriepagina's.
 * Eén YAML-bestand per product in src/content/producten/ (bestandsnaam = id).
 * Toegestane kenmerken + labels per categorie: src/data/filters.ts
 * (onbekende kenmerk-waarden laten de build falen met een duidelijke melding).
 */
const producten = defineCollection({
  type: 'data',
  schema: z.object({
    naam: z.string(),
    merk: z.string(),
    categorie: z.string(), // slug uit src/data/categorieen.ts
    label: z.string().optional(), // bijv. "Beste instap"
    volgorde: z.number().default(99), // sortering "Aanbevolen" (laag = eerst)
    samenvatting: z.string(),
    prijs: z.object({
      vanaf: z.number(), // voor sorteren/filteren, in euro
      tekst: z.string(), // zoals getoond, bijv. "ca. €17–€19 (2-pack)"
      gecontroleerd: z.date(),
    }),
    huurderproof: z
      .array(z.object({ tekst: z.string(), status: z.enum(['ja', 'let-op', 'nee']) }))
      .default([]),
    /** Categorie-specifieke kenmerken; sleutels en waarden zie src/data/filters.ts */
    kenmerken: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    voordelen: z.array(z.string()).default([]),
    nadelen: z.array(z.string()).default([]),
    winkels: z
      .array(
        z.object({
          naam: z.string(),
          url: z.string().url(),
          affiliate: z.boolean().default(true), // false = geen rel="sponsored" (bijv. IKEA)
        })
      )
      .min(1),
    artikel: z.string().optional(), // slug van de koopgids waarin dit product besproken wordt
    draft: z.boolean().default(false),
  }),
});

export const collections = { artikelen, producten };
