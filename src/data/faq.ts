// Veelgestelde vragen op de homepage (ook als FAQPage JSON-LD).
// Antwoorden bewust voorzichtig geformuleerd: geen juridisch advies.
// Content-agent mag deze aanscherpen/uitbreiden; houd antwoorden kort (2-4 zinnen).
// `antwoord` mag eenvoudige HTML bevatten (<strong>, <a>).

export interface FaqItem {
  vraag: string;
  antwoord: string;
}

export const faq: FaqItem[] = [
  {
    vraag: 'Mag ik als huurder smart home producten gebruiken?',
    antwoord:
      'Producten die je alleen inplugt, indraait of neerzet — zoals slimme stekkers, lampen in een bestaande fitting of een losse camera — veranderen niets aan de woning. Die kun je doorgaans gewoon gebruiken. Ga je iets vastmaken of onderdelen vervangen, check dan eerst je huurcontract en vraag bij twijfel toestemming aan je verhuurder.',
  },
  {
    vraag: 'Kan ik een slim slot plaatsen in een huurwoning?',
    antwoord:
      'Er zijn slimme sloten die over je bestaande slot of cilinder heen worden gemonteerd, zonder boren. Andere modellen vervangen de cilinder; bewaar dan de originele cilinder zodat je die bij vertrek terugplaatst. Omdat het om de toegang tot de woning gaat, is het verstandig dit vooraf met je verhuurder of woningcorporatie af te stemmen.',
  },
  {
    vraag: 'Werkt een slimme thermostaat als de cv-ketel niet van mij is?',
    antwoord:
      'Slimme radiatorknoppen vervangen alleen de thermostaatknop op je radiator; aan de ketel verandert niets en de oude knop zet je later terug. Een thermostaat die je aan de cv-ketel koppelt is een grotere ingreep — overleg daarover met je verhuurder.',
  },
  {
    vraag: 'Neem ik alles mee als ik verhuis?',
    antwoord:
      'Dat is precies het idee: we selecteren producten die je kunt meenemen. Zet originele onderdelen (zoals een radiatorknop of cilinder) terug, reset de apparaten en haal ze uit je app-account voordat je ze in je nieuwe woning installeert.',
  },
  {
    vraag: 'Mag ik een beveiligingscamera ophangen?',
    antwoord:
      'Een camera binnen in je eigen woning is meestal geen probleem. Filmt de camera ook de straat, gedeelde ruimtes of de buren, dan gelden er privacyregels. In België gelden daarnaast de regels van de camerawet, met in bepaalde gevallen een aangifteplicht. Zoek dit uit vóór je de camera plaatst.',
  },
  {
    vraag: 'Heb ik een hub of bridge nodig?',
    antwoord:
      'Niet altijd. Veel lampen, stekkers en camera\'s werken direct via wifi met een app. Sommige systemen hebben een hub nodig om ze op afstand of met automatiseringen te bedienen. In onze artikelen staat per product of een hub nodig is.',
  },
];
