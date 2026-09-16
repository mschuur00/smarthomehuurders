import type { CollectionEntry } from 'astro:content';
import { categorieen } from '../data/categorieen';

export type Artikel = CollectionEntry<'artikelen'>;

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
