// Visuele stijl per categorie (kleur + kort label voor de navigatie).
// Slugs moeten overeenkomen met src/data/categorieen.ts.
// Nieuwe categorie? Voeg hier een kleur toe én een icoon in src/components/Icon.astro.

export interface CategorieStijl {
  kleur: string; // basiskleur (hex); lichte/donkere varianten worden in CSS afgeleid
  kort: string; // kort label voor de hoofdnavigatie
}

export const categorieStijl: Record<string, CategorieStijl> = {
  'smart-lighting': { kleur: '#f59e0b', kort: 'Verlichting' },
  'smart-locks': { kleur: '#2563eb', kort: 'Sloten' },
  thermostats: { kleur: '#e11d48', kort: 'Thermostaten' },
  plugs: { kleur: '#16a34a', kort: 'Stekkers' },
  cameras: { kleur: '#7c3aed', kort: "Camera's" },
};

/** Inline style met de categoriekleur; gebruik samen met class="has-cat". */
export function catStyle(slug: string): string {
  const s = categorieStijl[slug];
  return s ? `--cat: ${s.kleur}` : '';
}
