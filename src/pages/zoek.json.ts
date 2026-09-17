import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categorieen } from '../data/categorieen';
import { formatPrijs } from '../lib/producten.mjs';

// Nederlandse zoekwoorden per categorie-slug, zodat "stekker" ook Tapo P110 vindt.
const synoniemen: Record<string, string> = {
  'smart-lighting': 'lamp lampen licht verlichting led',
  'smart-locks': 'slot sloten deurslot sleutel cilinder',
  thermostats: 'thermostaat verwarming radiator cv knop',
  plugs: 'stekker stopcontact schakelaar energiemeter verbruik',
  cameras: 'camera bewaking beveiliging babyfoon',
};
const woorden = Object.fromEntries(
  categorieen.map((c) => [c.slug, `${c.label} ${c.slug} ${synoniemen[c.slug] ?? ''}`.toLowerCase()]),
);

// Zoekindex voor de zoekbalk (client-side, klein: ~20 producten + ~20 artikelen).
export const GET: APIRoute = async () => {
  const base = import.meta.env.BASE_URL;
  const producten = await getCollection('producten', ({ data }) => !data.draft);
  const artikelen = await getCollection('artikelen', ({ data }) => !data.draft);
  const items = [
    ...producten.map((p) => ({
      t: p.data.naam,
      s: `${p.data.merk} · vanaf ${formatPrijs(p.data.prijs.vanaf)}`,
      u: `${base}product/${p.id}/`,
      c: woorden[p.data.categorie] ?? p.data.categorie,
      k: 'product',
    })),
    ...artikelen.map((a) => ({ t: a.data.title, s: a.data.description.slice(0, 80), u: `${base}artikelen/${a.slug}/`, c: woorden[a.data.category] ?? a.data.category, k: 'artikel' })),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};
