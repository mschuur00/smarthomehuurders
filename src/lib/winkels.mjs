// Centrale winkel- en affiliate-configuratie.
// Winkel wordt herkend aan de URL; affiliate-links worden hier op één plek opgebouwd.
//
// NA GOEDKEURING AFFILIATE-PROGRAMMA'S: vul alleen de ID's hieronder in.
// Alle productkaarten, productboxen, "snelle keuze"-knoppen en sponsored links in
// artikelen worden dan bij de volgende build automatisch partner-links.
// (Affiliate-ID's staan altijd zichtbaar in links, dit zijn geen geheimen.)

export const affiliateConfig = {
  bol: {
    siteId: '', // bol.com Partnerprogramma → site-ID (controleer linkformaat in het bol-dashboard)
  },
  awin: {
    publisherId: '', // Awin publisher-ID
    merchants: {
      'coolblue-nl': '', // Awin merchant-ID Coolblue NL
      'coolblue-be': '', // Awin merchant-ID Coolblue BE
    },
  },
  amazon: {
    'amazon-nl': '', // tracking-tag Amazon.nl PartnerNet, bijv. "smarthomehuur-21"
    'amazon-be': '',
  },
};

const hostIs = (host, domein) => host === domein || host.endsWith('.' + domein);

/** Bekende winkels. `programma` = affiliate-programma (null = geen affiliate → geen rel="sponsored"). */
const WINKELS = [
  { id: 'bol', naam: 'bol', programma: 'bol', match: (u) => hostIs(u.hostname, 'bol.com'), landen: () => ['nl', 'be'] },
  { id: 'coolblue-nl', naam: 'Coolblue', programma: 'awin', match: (u) => hostIs(u.hostname, 'coolblue.nl'), landen: () => ['nl'] },
  { id: 'coolblue-be', naam: 'Coolblue', programma: 'awin', match: (u) => hostIs(u.hostname, 'coolblue.be'), landen: () => ['be'] },
  { id: 'amazon-nl', naam: 'Amazon', programma: 'amazon', match: (u) => hostIs(u.hostname, 'amazon.nl'), landen: () => ['nl'] },
  { id: 'amazon-be', naam: 'Amazon', programma: 'amazon', match: (u) => hostIs(u.hostname, 'amazon.com.be'), landen: () => ['be'] },
  {
    id: 'ikea', naam: 'IKEA', programma: null, match: (u) => hostIs(u.hostname, 'ikea.com'),
    landen: (u) => (u.pathname.startsWith('/be/') ? ['be'] : u.pathname.startsWith('/nl/') ? ['nl'] : ['nl', 'be']),
  },
];

/** Info over de winkel achter een URL. */
export function winkelInfo(url) {
  let u;
  try { u = new URL(url); } catch { return { id: 'onbekend', naam: url, affiliate: false, landen: ['nl', 'be'] }; }
  const w = WINKELS.find((x) => x.match(u));
  if (!w) {
    const naam = u.hostname.replace(/^www\./, '');
    return { id: naam, naam, affiliate: false, landen: ['nl', 'be'] };
  }
  const landen = w.landen(u);
  const naam = w.id === 'ikea' && landen.length === 1 ? `IKEA ${landen[0] === 'be' ? 'België' : 'NL'}` : w.naam;
  return { id: w.id, naam, affiliate: w.programma !== null, programma: w.programma, landen };
}

/** Bouwt de (affiliate-)link. Zonder ingevulde ID's: de gewone URL. */
export function affiliateUrl(url) {
  const w = winkelInfo(url);
  const enc = encodeURIComponent(url);
  if (w.programma === 'bol' && affiliateConfig.bol.siteId) {
    return `https://partner.bol.com/click/click?p=2&t=url&s=${affiliateConfig.bol.siteId}&f=TXL&url=${enc}&name=SmartHomeHuurders`;
  }
  if (w.programma === 'awin') {
    const mid = affiliateConfig.awin.merchants[w.id];
    if (affiliateConfig.awin.publisherId && mid) {
      return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${affiliateConfig.awin.publisherId}&ued=${enc}`;
    }
  }
  if (w.programma === 'amazon' && affiliateConfig.amazon[w.id]) {
    const u = new URL(url);
    u.searchParams.set('tag', affiliateConfig.amazon[w.id]);
    return u.toString();
  }
  return url;
}

/** rel-attribuut: sponsored voor winkels met affiliate-programma (ook vóór goedkeuring, conform afspraak). */
export function relVoor(url) {
  return winkelInfo(url).affiliate ? 'sponsored nofollow noopener' : 'nofollow noopener';
}
