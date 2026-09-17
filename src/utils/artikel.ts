import { getCollection, type CollectionEntry } from 'astro:content';
import { categorieen } from '../data/categorieen';

export type Artikel = CollectionEntry<'artikelen'>;

/** Alle gepubliceerde artikelen (zonder draft: true). Gebruik dit i.p.v. getCollection. */
export async function getArtikelen(): Promise<Artikel[]> {
  return getCollection('artikelen', ({ data }) => !data.draft);
}

/** Nieuwste artikelen eerst. */
export function sorteerOpDatum(artikelen: Artikel[]): Artikel[] {
  return [...artikelen].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDatum(d: Date): string {
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Geschatte leestijd in minuten (~220 woorden/min), minimaal 1. */
export function leestijd(body: string): number {
  const woorden = body.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woorden / 220));
}

export function vindCategorie(slug: string) {
  return categorieen.find((c) => c.slug === slug);
}

export type Product = CollectionEntry<'producten'>;

/** Gepubliceerde producten van één categorie, in "aanbevolen"-volgorde. */
export async function getProducten(categorie: string): Promise<Product[]> {
  const alle = await getCollection('producten', ({ data }) => !data.draft && data.categorie === categorie);
  return alle.sort((a, b) => a.data.volgorde - b.data.volgorde || a.data.prijs.vanaf - b.data.prijs.vanaf);
}

export function formatPrijs(bedrag: number): string {
  return bedrag.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: bedrag % 1 === 0 ? 0 : 2 });
}

/** Populairste producten over alle categorieën (hoogste huurder-score, dan onze volgorde). */
export async function topProducten(aantal = 6): Promise<Product[]> {
  const { huurderScore } = await import('../lib/producten.mjs');
  const alle = await getCollection('producten', ({ data }) => !data.draft);
  return alle
    .sort((a, b) => huurderScore(b.data).score - huurderScore(a.data).score || a.data.volgorde - b.data.volgorde || a.data.prijs.vanaf - b.data.prijs.vanaf)
    .slice(0, aantal);
}

/** Per categorie: aantal producten/artikelen + vanafprijs, voor de categoriekaarten. */
export async function categorieSamenvatting(): Promise<Record<string, { tekst: string; vanaf?: number }>> {
  const artikelen = await getArtikelen();
  const producten = await getCollection('producten', ({ data }) => !data.draft);
  const uit: Record<string, { tekst: string; vanaf?: number }> = {};
  for (const c of categorieen) {
    const p = producten.filter((x) => x.data.categorie === c.slug);
    const na = artikelen.filter((a) => a.data.category === c.slug).length;
    uit[c.slug] = {
      tekst: p.length > 0 ? `${p.length} ${p.length === 1 ? 'product' : 'producten'}` : na > 0 ? `${na} ${na === 1 ? 'artikel' : 'artikelen'}` : 'Binnenkort',
      vanaf: p.length ? Math.min(...p.map((x) => x.data.prijs.vanaf)) : undefined,
    };
  }
  return uit;
}

/** Korte telling voor categorie-cards: "4 producten", "2 artikelen" of "Binnenkort". */
export async function categorieTelling(): Promise<Record<string, string>> {
  const artikelen = await getArtikelen();
  const producten = await getCollection('producten', ({ data }) => !data.draft);
  const uit: Record<string, string> = {};
  for (const c of categorieen) {
    const np = producten.filter((p) => p.data.categorie === c.slug).length;
    const na = artikelen.filter((a) => a.data.category === c.slug).length;
    uit[c.slug] = np > 0 ? `${np} ${np === 1 ? 'product' : 'producten'}` : na > 0 ? `${na} ${na === 1 ? 'artikel' : 'artikelen'}` : 'Binnenkort';
  }
  return uit;
}
