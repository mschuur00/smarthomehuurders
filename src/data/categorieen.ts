export interface Categorie {
  slug: string;
  label: string;
  omschrijving: string;
}

export const categorieen: Categorie[] = [
  { slug: 'smart-lighting', label: 'Smart verlichting', omschrijving: 'Slimme lampen en verlichting zonder te boren.' },
  { slug: 'smart-locks', label: 'Slimme sloten', omschrijving: 'Deursloten die je zonder verbouwing installeert en bij verhuizing meeneemt.' },
  { slug: 'thermostats', label: 'Thermostaten', omschrijving: 'Slimme thermostaten die werken met huurwoning-cv-ketels.' },
  { slug: 'plugs', label: 'Slimme stekkers', omschrijving: 'Apparaten op afstand aan/uit, geen installatie nodig.' },
  { slug: 'cameras', label: "Camera's", omschrijving: "Beveiligingscamera's zonder boren, huurcontract-vriendelijk." },
];
