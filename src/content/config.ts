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
        z
          .object({
            id: z.string().optional(), // product-id uit src/content/producten → naam + link automatisch
            label: z.string(), // bijv. "Beste keuze", "Beste budget"
            product: z.string().optional(), // nodig als er geen id is
            reden: z.string().optional(), // één korte zin
            url: z.string().url().optional(), // nodig als er geen id is
            winkel: z.string().optional(),
            knop: z.string().optional(),
          })
          .refine((x) => x.id || (x.product && x.url), { message: 'snelleKeuze: geef een id, of product + url' })
      )
      .max(5)
      .optional(),
  }),
});

/**
 * Producten voor het vergelijk-/filteroverzicht op categoriepagina's.
 * Eén YAML-bestand per product in src/content/producten/ (bestandsnaam = id).
 * Toegestane kenmerken + labels per categorie: src/data/filters.mjs
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
    /** Basis voor huurder-score en badges (zie src/lib/producten.mjs). */
    huurder: z
      .object({
        boren: z.enum(['nee', 'optioneel', 'ja']).default('nee'),
        terugzetten: z.enum(['niets', 'onderdeel', 'nee']).default('niets'), // origineel onderdeel terugzetten bij vertrek?
        installatie: z.enum(['zelf', 'handig', 'installateur']).default('zelf'),
        toestemming: z.enum(['nee', 'aanrader', 'nodig']).default('nee'), // toestemming verhuurder
      })
      .default({}),
    /** Voor de 3-jaarskosten. */
    kosten: z
      .object({
        extra: z
          .array(z.object({ naam: z.string(), prijs: z.number().optional(), nodig: z.boolean(), reden: z.string().optional() }))
          .default([]),
        abonnement: z
          .object({ naam: z.string(), perMaand: z.number(), nodig: z.boolean(), voor: z.string().optional() })
          .optional(),
      })
      .default({}),
    /** Extra badges bovenop de automatisch afgeleide (zie huurderBadges). */
    huurderproof: z.array(z.object({ tekst: z.string(), status: z.enum(['ja', 'let-op', 'nee']) })).default([]),
    /** Categorie-specifieke kenmerken; sleutels en waarden zie src/data/filters.mjs */
    kenmerken: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    voordelen: z.array(z.string()).default([]),
    nadelen: z.array(z.string()).default([]),
    /** Winkel wordt herkend aan de URL (src/lib/winkels.mjs); naam optioneel overschrijven. */
    winkels: z.array(z.object({ url: z.string().url(), naam: z.string().optional() })).min(1),
    /** Extra verhuisstappen specifiek voor dit product (naast die van de categorie). */
    verhuizen: z.array(z.string()).default([]),
    artikel: z.string().optional(), // slug van de koopgids
    draft: z.boolean().default(false),
  }),
});

export const collections = { artikelen, producten };
