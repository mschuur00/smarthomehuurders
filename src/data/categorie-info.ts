// Uitleg per categorie: "waar let je op" (boven het productoverzicht), FAQ (onder de koopgidsen)
// en verhuisstappen (op productpagina's). Bron: de koopgids van elke categorie.
// Houd teksten kort; geen juridisch advies.

export interface CategorieInfo {
  letOp: { icon: string; titel: string; tekst: string }[];
  faq: { vraag: string; antwoord: string }[];
  verhuizen: string[];
}

export const categorieInfo: Record<string, CategorieInfo> = {
  'smart-lighting': {
    letOp: [
      { icon: 'plugs', titel: 'Hub of geen hub', tekst: 'Wifi-lampen werken direct. Met een hub (Zigbee/Thread) wordt een systeem met veel lampen stabieler.' },
      { icon: 'grid', titel: 'Matter', tekst: 'Werkt met Apple Home, Google Home én Alexa, zodat je niet vastzit aan één merk.' },
      { icon: 'smart-lighting', titel: 'Fitting en licht', tekst: 'Check E27, E14 of GU10. Kies wit spectrum voor functioneel licht, kleur voor sfeer.' },
    ],
    faq: [
      { vraag: 'Kan ik slimme lampen bedienen zonder hub?', antwoord: 'Ja. WiZ en Govee werken direct via wifi, Philips Hue via Bluetooth (beperkt) en IKEA KAJPLATS met de afstandsbediening. Voor alle functies heb je bij Hue en IKEA een hub nodig.' },
      { vraag: 'Waarom reageert mijn lamp niet na het uitzetten van de schakelaar?', antwoord: 'Zonder stroom kan de lamp geen signaal ontvangen. Laat de wandschakelaar aan en gebruik de app of een draadloze plak-schakelaar.' },
      { vraag: 'Werken slimme lampen op een gewone dimmer?', antwoord: 'Meestal niet goed. Zet een bestaande dimmer in de muur op vol vermogen en dim via de app.' },
    ],
    verhuizen: [
      'Draai je slimme lampen eruit en zet de oorspronkelijke lampen terug.',
      'Haal plak-schakelaars langzaam van de muur; een föhn maakt de lijm zachter.',
      'Neem je hub mee. Nieuw wifi-netwerk? Koppel wifi-lampen opnieuw.',
    ],
  },
  plugs: {
    letOp: [
      { icon: 'plugs', titel: 'Wifi of hub', tekst: 'Wifi-stekkers werken direct. Thread-modellen (zoals IKEA) hebben een hub nodig voor de app.' },
      { icon: 'scale', titel: 'Max. vermogen', tekst: 'Voor een kachel, airco of droger heb je een stekker tot 16 A / 3.680 W nodig.' },
      { icon: 'refresh', titel: 'Energiemeting', tekst: 'Zie wat apparaten verbruiken, ook in stand-by. Handig als je zelf je energie betaalt.' },
    ],
    faq: [
      { vraag: 'Heb ik toestemming van mijn verhuurder nodig?', antwoord: 'Nee. Een slimme stekker verandert niets aan de elektrische installatie, net als een stekkerdoos of tijdschakelaar.' },
      { vraag: 'Verbruikt een slimme stekker zelf stroom?', antwoord: 'Een beetje, meestal minder dan 1 watt. Met het uitzetten van sluipverbruik bespaar je doorgaans meer.' },
      { vraag: 'Werkt het met 5 GHz-wifi?', antwoord: 'De meeste slimme stekkers werken alleen met 2,4 GHz-wifi. Bij de meeste routers staat dat standaard aan.' },
      { vraag: 'Past hij in een Belgisch stopcontact?', antwoord: 'In België zijn stopcontacten met penaarde (type E) gebruikelijk. Controleer bij het kopen dat de stekker daarvoor geschikt is.' },
    ],
    verhuizen: [
      'Trek de stekkers eruit en neem ze mee.',
      'Nieuw wifi-netwerk? Reset de stekker en koppel hem opnieuw in de app.',
      'Laat je er een achter? Verwijder hem eerst uit je app en reset hem.',
    ],
  },
  'smart-locks': {
    letOp: [
      { icon: 'smart-locks', titel: 'Over je sleutel of nieuwe cilinder', tekst: 'Over je bestaande sleutel is het meest huurder-vriendelijk. Een nieuwe cilinder: bewaar de originele.' },
      { icon: 'alert', titel: 'Noodfunctie', tekst: 'Bij sloten over de sleutel moet je cilinder van buiten open kunnen terwijl binnen een sleutel zit.' },
      { icon: 'shield', titel: 'Veiligheid', tekst: 'Inbraakwerendheid blijft afhangen van cilinder en beslag (SKG-sterren), niet van de app.' },
    ],
    faq: [
      { vraag: 'Mag ik als huurder een slim slot plaatsen?', antwoord: 'Veranderingen die je zonder noemenswaardige kosten ongedaan maakt, mag je in Nederland in principe zonder toestemming doen. De voordeur zit aan de buitenzijde, dus check je huurcontract en overleg bij voorkeur even. Geen juridisch advies.' },
      { vraag: 'Wat als de batterij leeg is?', antwoord: 'Je krijgt ruim vooraf een melding. Je gewone sleutel blijft werken, dus neem altijd een fysieke sleutel mee.' },
      { vraag: 'Heb ik wifi nodig?', antwoord: 'Voor openen in de buurt van de deur niet (Bluetooth). Voor bediening op afstand wel, via ingebouwde wifi of een bridge.' },
    ],
    verhuizen: [
      'Verwijder het slot uit de app en trek gedeelde digitale sleutels in.',
      'Demonteer het slot. Cilinder vervangen? Zet de originele terug en lever alle sleutels in.',
      'Reset het slot voordat je het in je nieuwe woning installeert.',
    ],
  },
  thermostats: {
    letOp: [
      { icon: 'thermostats', titel: 'Radiatorknop i.p.v. thermostaat', tekst: 'Een radiatorknop raakt de cv-ketel niet; de kamerthermostaat vervangen vraagt vaak toestemming.' },
      { icon: 'check', titel: 'Past het?', tekst: 'Knop met cijfers 1–5? Dan past een slimme knop bijna altijd (M30 x 1,5 of met adapter).' },
      { icon: 'info', titel: 'Ketel blijft baas', tekst: 'De ketel springt aan op de kamerthermostaat. Zet die iets hoger en laat de knoppen per kamer regelen.' },
    ],
    faq: [
      { vraag: 'Mag ik als huurder slimme radiatorknoppen gebruiken?', antwoord: 'Ja, je verandert niets aan de cv-installatie. Bewaar de oude knoppen en zet ze terug bij vertrek.' },
      { vraag: 'Werkt dit met stadsverwarming of blokverwarming?', antwoord: 'Ja, zolang je radiatoren thermostatische knoppen met cijfers hebben.' },
      { vraag: 'Kan ik mijn Toon of Nest meenemen?', antwoord: 'Weinig zinvol: beide zijn in Nederland niet meer nieuw te koop en de ondersteuning is gestopt of stopt binnenkort.' },
    ],
    verhuizen: [
      'Draai de slimme knoppen los en zet de originele knoppen terug.',
      'Neem adapters en eventuele bridge mee.',
      'Verwijder de knoppen uit je app of zet je woning om naar het nieuwe adres.',
    ],
  },
  cameras: {
    letOp: [
      { icon: 'home', titel: 'Binnen of buiten', tekst: 'Binnen: geen toestemming nodig. Buiten, galerij of portiek: check je huurcontract en overleg.' },
      { icon: 'shield', titel: 'Privacy', tekst: 'Film alleen je eigen woning. Gebruik privacyzones en hang een bordje op. In België gelden extra regels.' },
      { icon: 'tag', titel: 'Abonnement of microSD', tekst: 'Met lokale opslag op microSD betaal je geen maandelijkse kosten voor opnames.' },
    ],
    faq: [
      { vraag: 'Mag mijn verhuurder een camera in mijn woning verbieden?', antwoord: 'Een camera die je binnen neerzet verandert niets aan het gehuurde. Voor montage buiten of in gemeenschappelijke ruimtes kan je verhuurder wel regels stellen.' },
      { vraag: 'Mag ik de galerij of het trappenhuis filmen?', antwoord: 'Dat is gemeenschappelijke ruimte: daar gelden AVG-regels en heb je in de praktijk toestemming van verhuurder of VvE nodig.' },
      { vraag: 'Heb ik een abonnement nodig?', antwoord: 'Niet bij camera\'s met microSD-opslag, zoals Tapo en Eufy. Bij Ring betaal je voor het terugkijken van opnames.' },
    ],
    verhuizen: [
      'Haal de camera weg en verwijder plakstrips langzaam.',
      'Verwijder het bordje of de sticker over camerabewaking.',
      'Wis oude opnames en reset de camera voor je nieuwe wifi.',
    ],
  },
};
