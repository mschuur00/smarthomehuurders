// Startpakketten: combinaties van producten (id's uit src/content/producten). Totalen worden berekend.
export const pakketten = [
  {
    titel: 'Slim beginnen',
    icon: 'plugs',
    kleur: '#16a34a',
    tekst: 'Twee slimme lampen en twee stekkers: sfeerlicht, schema\'s en sluipverbruik meten. Alles zonder hub.',
    items: [{ id: 'wiz-smart-lamp-e27', aantal: 1 }, { id: 'tapo-p110', aantal: 2 }],
  },
  {
    titel: 'Comfort',
    icon: 'thermostats',
    kleur: '#e11d48',
    tekst: 'Licht en stekker slim, plus een radiatorknop voor je slaapkamer en een binnencamera zonder abonnement.',
    items: [{ id: 'wiz-smart-lamp-e27', aantal: 1 }, { id: 'tapo-p110', aantal: 1 }, { id: 'shelly-trv', aantal: 1 }, { id: 'tapo-c210', aantal: 1 }],
  },
  {
    titel: 'Compleet',
    icon: 'smart-locks',
    kleur: '#2563eb',
    tekst: 'Een uitbreidbaar systeem: Philips Hue, tado° voor de verwarming, een slim slot over je sleutel en een camera.',
    items: [{ id: 'philips-hue-starterkit-e27', aantal: 1 }, { id: 'tado-radiatorknop-x', aantal: 1 }, { id: 'tedee-go', aantal: 1 }, { id: 'tapo-c210', aantal: 1 }],
  },
];
