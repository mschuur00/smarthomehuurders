// Filterbare kenmerken per categorie (plain JS zodat ook de remark-plugin het kan lezen).
// - `waarden`: alle toegestane waarden + label. Onbekende waarde in een product → build faalt.
// - `verborgen`: waarden die wél op de kaart staan maar geen filteroptie zijn.
// - Filtergroep verschijnt alleen als die de lijst echt kan verkleinen.
// - `tabel`: kenmerken die als kolom in de vergelijkingstabel (artikelen) komen.

const hub = {
  key: 'hub',
  label: 'Hub of bridge',
  specLabel: 'Hub',
  uitleg: 'Zonder hub verbindt het apparaat direct met wifi of Bluetooth. Een hub geeft vaak meer functies of bediening op afstand.',
  waarden: { geen: 'Geen hub nodig', optioneel: 'Hub optioneel (meer functies)', nodig: 'Hub nodig' },
};

const matter = {
  key: 'matter',
  label: 'Matter',
  uitleg: 'Open standaard: werkt met Apple Home, Google Home en Alexa, zodat je minder vastzit aan één merk.',
  waarden: { ja: 'Matter-compatibel', 'via-hub': 'Matter via hub', model: 'Afhankelijk van model', nee: 'Geen Matter' },
  verborgen: ['model'],
};

export const ECOSYSTEMEN = {
  'apple-home': 'Apple Home',
  'google-home': 'Google Home',
  alexa: 'Amazon Alexa',
  homey: 'Homey',
  'home-assistant': 'Home Assistant',
};

const werktMet = { key: 'werktMet', label: 'Werkt met', waarden: ECOSYSTEMEN };

export const filtersPerCategorie = {
  'smart-lighting': {
    tabel: ['hub', 'matter', 'werktMet'],
    groepen: [
      hub, matter, werktMet,
      { key: 'licht', label: 'Lichtkleur', specLabel: 'Licht', waarden: { 'wit-spectrum': 'Warm- tot koelwit', kleur: 'Kleur + wit' } },
      { key: 'verbinding', label: 'Verbinding', waarden: { wifi: 'Wifi', bluetooth: 'Bluetooth', zigbee: 'Zigbee', thread: 'Thread' } },
      { key: 'fitting', label: 'Fitting', waarden: { E27: 'E27 (grote fitting)', E14: 'E14 (kleine fitting)', GU10: 'GU10 (spotje)' } },
    ],
  },
  plugs: {
    tabel: ['hub', 'energiemeting', 'maxVermogen', 'werktMet'],
    groepen: [
      hub, matter, werktMet,
      { key: 'energiemeting', label: 'Energiemeting', waarden: { ja: 'Met energiemeting', model: 'Afhankelijk van model', nee: 'Geen energiemeting' }, verborgen: ['model'] },
      {
        key: 'maxVermogen', label: 'Max. vermogen', specLabel: 'Vermogen',
        uitleg: 'Belangrijk voor zware apparaten zoals een kachel, airco of droger.',
        waarden: { '3680': 'Tot 3.680 W (16 A)', '2500': 'Tot 2.500 W (12 A)' },
      },
      { key: 'verbinding', label: 'Verbinding', waarden: { wifi: 'Wifi', bluetooth: 'Bluetooth', thread: 'Thread' } },
    ],
  },
  'smart-locks': {
    tabel: ['montage', 'opAfstand', 'werktMet'],
    groepen: [
      {
        key: 'montage', label: 'Montage',
        uitleg: 'Over je bestaande sleutel laat de deur ongemoeid. Bij een nieuwe cilinder bewaar je de originele voor bij vertrek.',
        waarden: { 'over-sleutel': 'Over je bestaande sleutel', cilinder: 'Nieuwe cilinder (geen boren)' },
      },
      { key: 'opAfstand', label: 'Op afstand bedienen', specLabel: 'Op afstand', waarden: { ingebouwd: 'Ingebouwde wifi', bridge: 'Met bridge of hub' } },
      hub, matter, werktMet,
      { key: 'voeding', label: 'Voeding', waarden: { batterij: 'Batterijen', accu: 'Oplaadbare accu' } },
    ],
  },
  thermostats: {
    tabel: ['hub', 'abonnement', 'werktMet'],
    groepen: [
      hub,
      { key: 'abonnement', label: 'Abonnement', waarden: { geen: 'Geen abonnement', optioneel: 'Optioneel abonnement' } },
      {
        key: 'opAfstand', label: 'Bediening buitenshuis', specLabel: 'Buitenshuis',
        waarden: { ja: 'Direct via app', thuishub: 'Met Apple TV of HomePod' },
      },
      werktMet,
    ],
  },
  cameras: {
    tabel: ['plaats', 'opslag', 'montage'],
    groepen: [
      { key: 'plaats', label: 'Binnen of buiten', specLabel: 'Plaats', uitleg: 'Buiten gelden privacyregels en vaak afspraken met je verhuurder.', waarden: { binnen: 'Binnen', buiten: 'Buiten' } },
      {
        key: 'opslag', label: 'Opslag', uitleg: 'Met lokale opslag (microSD) heb je geen abonnement nodig voor opnames.',
        waarden: { lokaal: 'Lokaal (microSD), zonder abonnement', cloud: 'Opnames alleen met abonnement' },
      },
      { key: 'montage', label: 'Montage', waarden: { neerzetten: 'Neerzetten', 'magneet-plak': 'Magneet of plakstrip' } },
      { key: 'panTilt', label: 'Draaien en kantelen', specLabel: 'Draaien', waarden: { ja: 'Draait en kantelt', nee: 'Vaste camera' } },
      { key: 'voeding', label: 'Voeding', waarden: { stekker: 'Stekker', accu: 'Accu' } },
    ],
  },
};

/** Prijsklassen (alle categorieën). */
export const prijsKlassen = [
  { key: 'tot-20', label: 'Tot €20', min: 0, max: 20 },
  { key: '20-50', label: '€20 – €50', min: 20, max: 50 },
  { key: '50-100', label: '€50 – €100', min: 50, max: 100 },
  { key: '100-200', label: '€100 – €200', min: 100, max: 200 },
  { key: 'boven-200', label: 'Boven €200', min: 200, max: Infinity },
];

export function prijsKlasse(prijs) {
  return (prijsKlassen.find((k) => prijs >= k.min && prijs < k.max) || prijsKlassen[prijsKlassen.length - 1]).key;
}

/** Huurder-score klassen voor de filter. */
export const scoreKlassen = [
  { key: 'top', label: '5/5 · perfect voor huurders', test: (s) => s >= 5 },
  { key: 'hoog', label: '4 – 4,5 · zeer geschikt', test: (s) => s >= 4 && s < 5 },
  { key: 'midden', label: 'Onder 4 · met aandachtspunten', test: (s) => s < 4 },
];
export function scoreKlasse(score) {
  return scoreKlassen.find((k) => k.test(score)).key;
}
