// Filterbare kenmerken per categorie.
// - `waarden`: alle toegestane waarden + label. Een product met een waarde die hier niet
//   staat, laat de build falen (zo blijven filters en data consistent).
// - `verborgen`: waarden die wél op de productkaart staan maar geen filteroptie zijn
//   (bijv. "afhankelijk van model").
// - Een filtergroep verschijnt alleen als de producten minstens 2 verschillende waarden hebben.
// Nieuwe categorie? Voeg hier een blok toe met dezelfde sleutel als de categorie-slug.

export interface FilterGroep {
  key: string;
  label: string;
  /** Tekst in de specificatielijst op de kaart (default = label) */
  specLabel?: string;
  waarden: Record<string, string>;
  verborgen?: string[];
  uitleg?: string;
}

export const filtersPerCategorie: Record<string, FilterGroep[]> = {
  'smart-lighting': [
    {
      key: 'hub',
      label: 'Hub of bridge',
      specLabel: 'Hub',
      uitleg: 'Zonder hub verbindt de lamp direct met wifi of Bluetooth. Met hub krijg je meer functies en een stabieler netwerk bij veel lampen.',
      waarden: {
        geen: 'Geen hub nodig',
        optioneel: 'Hub optioneel (voor alle functies)',
        nodig: 'Hub nodig',
      },
    },
    {
      key: 'matter',
      label: 'Matter',
      uitleg: 'Open standaard: werkt met Apple Home, Google Home en Alexa, zodat je minder vastzit aan één merk.',
      waarden: {
        ja: 'Matter-compatibel',
        model: 'Afhankelijk van model',
        nee: 'Geen Matter',
      },
      verborgen: ['model'],
    },
    {
      key: 'werktMet',
      label: 'Werkt met',
      waarden: {
        'apple-home': 'Apple Home',
        'google-home': 'Google Home',
        alexa: 'Amazon Alexa',
        homey: 'Homey',
      },
    },
    {
      key: 'licht',
      label: 'Lichtkleur',
      specLabel: 'Licht',
      waarden: {
        'wit-spectrum': 'Warm- tot koelwit',
        kleur: 'Kleur + wit',
      },
    },
    {
      key: 'verbinding',
      label: 'Verbinding',
      waarden: {
        wifi: 'Wifi',
        bluetooth: 'Bluetooth',
        zigbee: 'Zigbee',
        thread: 'Thread',
      },
    },
    {
      key: 'fitting',
      label: 'Fitting',
      waarden: {
        E27: 'E27 (grote fitting)',
        E14: 'E14 (kleine fitting)',
        GU10: 'GU10 (spotje)',
      },
    },
  ],
};

/** Prijsklassen (gelden voor alle categorieën). */
export const prijsKlassen = [
  { key: 'tot-20', label: 'Tot €20', min: 0, max: 20 },
  { key: '20-50', label: '€20 – €50', min: 20, max: 50 },
  { key: '50-100', label: '€50 – €100', min: 50, max: 100 },
  { key: 'boven-100', label: 'Boven €100', min: 100, max: Infinity },
];

export function prijsKlasse(prijs: number): string {
  return prijsKlassen.find((k) => prijs >= k.min && prijs < k.max)?.key ?? 'boven-100';
}
