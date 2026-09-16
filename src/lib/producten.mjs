// Gedeelde productlogica: huurder-score, badges, 3-jaarskosten, HTML voor productboxen
// en vergelijkingstabellen in artikelen. Plain JS: gebruikt door Astro-pagina's én de
// remark-plugin (src/lib/remark-producten.mjs).
import { affiliateUrl, relVoor, winkelInfo } from './winkels.mjs';
import { filtersPerCategorie, ECOSYSTEMEN } from '../data/filters.mjs';

export const JAREN = 3;

export const lijst = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function formatPrijs(bedrag) {
  const heel = Math.round(bedrag * 100) % 100 === 0;
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: heel ? 0 : 2, maximumFractionDigits: 2 }).format(bedrag);
}

export function formatDatum(d) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatScore(s) {
  return String(s).replace('.', ',');
}

/* ---------- Huurder-score (1–5) ---------- */
// Transparant model, uitgelegd op /over-ons/. Start op 5, aftrek per aandachtspunt, afgerond op 0,5.
const AFTREK = {
  boren: { nee: 0, optioneel: 0.5, ja: 2 },
  terugzetten: { niets: 0, onderdeel: 0.5, nee: 2 },
  installatie: { zelf: 0, handig: 0.5, installateur: 1.5 },
  toestemming: { nee: 0, aanrader: 0.5, nodig: 1.5 },
};
const FACTOR_TEKST = {
  boren: { optioneel: 'Boren optioneel (bijv. voor een beugel)', ja: 'Boren nodig' },
  terugzetten: { onderdeel: 'Origineel onderdeel bewaren en terugzetten bij vertrek', nee: 'Niet mee te nemen' },
  installatie: { handig: 'Wat handigheid nodig', installateur: 'Installateur nodig' },
  toestemming: { aanrader: 'Overleg met je verhuurder is verstandig', nodig: 'Toestemming verhuurder nodig' },
};

export function huurder(d) {
  return { boren: 'nee', terugzetten: 'niets', installatie: 'zelf', toestemming: 'nee', ...(d.huurder || {}) };
}

export function huurderScore(d) {
  const h = huurder(d);
  const factoren = [];
  for (const key of Object.keys(AFTREK)) {
    const a = AFTREK[key][h[key]] || 0;
    if (a) factoren.push({ tekst: FACTOR_TEKST[key][h[key]], aftrek: a });
  }
  if (d.kenmerken?.hub === 'nodig') factoren.push({ tekst: 'Hub nodig', aftrek: 0.5 });
  if (d.kosten?.abonnement?.nodig) factoren.push({ tekst: `Abonnement nodig voor ${d.kosten.abonnement.voor || 'volledige functies'}`, aftrek: 1 });
  const ruw = 5 - factoren.reduce((s, f) => s + f.aftrek, 0);
  const score = Math.max(1, Math.min(5, Math.round(ruw * 2) / 2));
  const oordeel = score >= 5 ? 'Perfect voor huurders' : score >= 4 ? 'Zeer geschikt' : score >= 3 ? 'Geschikt, met aandachtspunten' : 'Let op als huurder';
  return { score, oordeel, factoren };
}

/* ---------- Huurder-badges (afgeleid + extra uit YAML) ---------- */
export function huurderBadges(d) {
  const h = huurder(d);
  const b = [];
  b.push(h.boren === 'nee' ? { tekst: 'Zonder boren', status: 'ja' } : h.boren === 'optioneel' ? { tekst: 'Boren optioneel', status: 'let-op' } : { tekst: 'Boren nodig', status: 'nee' });
  b.push(h.terugzetten === 'niets' ? { tekst: 'Mee bij verhuizing', status: 'ja' } : h.terugzetten === 'onderdeel' ? { tekst: 'Origineel bewaren', status: 'let-op' } : { tekst: 'Niet meeneembaar', status: 'nee' });
  b.push(h.installatie === 'zelf' ? { tekst: 'Zelf te installeren', status: 'ja' } : h.installatie === 'handig' ? { tekst: 'Wat handigheid nodig', status: 'let-op' } : { tekst: 'Installateur nodig', status: 'nee' });
  if (h.toestemming === 'aanrader') b.push({ tekst: 'Overleg met verhuurder', status: 'let-op' });
  if (h.toestemming === 'nodig') b.push({ tekst: 'Toestemming verhuurder', status: 'nee' });
  if (d.kenmerken?.hub === 'geen') b.push({ tekst: 'Geen hub nodig', status: 'ja' });
  if (d.kenmerken?.hub === 'nodig') b.push({ tekst: 'Hub nodig', status: 'let-op' });
  const ab = d.kosten?.abonnement;
  if (ab?.nodig) b.push({ tekst: `Abonnement voor ${ab.voor || 'functies'}`, status: 'nee' });
  else if (d.kenmerken?.abonnement === 'geen' || d.kenmerken?.opslag === 'lokaal') b.push({ tekst: 'Geen abonnement nodig', status: 'ja' });
  for (const x of d.huurderproof || []) b.push(x);
  // Aandachtspunten eerst
  const orde = { nee: 0, 'let-op': 1, ja: 2 };
  return b.sort((x, y) => orde[x.status] - orde[y.status]);
}

/* ---------- Kosten over 3 jaar ---------- */
export function kosten3Jaar(d) {
  const aanschaf = d.prijs.vanaf;
  const extra = d.kosten?.extra || [];
  const extraNodig = extra.filter((e) => e.nodig && typeof e.prijs === 'number').reduce((s, e) => s + e.prijs, 0);
  const onbekend = extra.filter((e) => e.nodig && typeof e.prijs !== 'number');
  const optioneel = extra.filter((e) => !e.nodig);
  const ab = d.kosten?.abonnement;
  const abonnement = ab?.nodig ? ab.perMaand * 12 * JAREN : 0;
  const totaal = Math.round((aanschaf + extraNodig + abonnement) * 100) / 100;
  return { aanschaf, extraNodig, abonnement, totaal, onbekend, optioneel, abonnementInfo: ab };
}

/** Korte tekstregel over de 3-jaarskosten. */
export function kostenRegel(d) {
  const k = kosten3Jaar(d);
  const delen = [];
  if (k.abonnement) delen.push(`incl. ${formatPrijs(k.abonnement)} abonnement`);
  if (k.extraNodig) delen.push(`incl. ${formatPrijs(k.extraNodig)} accessoires`);
  let regel = `${JAREN} jaar: ${formatPrijs(k.totaal)}`;
  if (delen.length) regel += ` (${delen.join(', ')})`;
  if (k.onbekend.length) regel += ` + ${k.onbekend.map((e) => e.naam.replace(/\s*\(.*\)/, '')).join(', ')}`;
  else if (!delen.length) regel += ' · geen bijkomende kosten';
  return regel;
}

/* ---------- Winkels ---------- */
export function winkels(d) {
  return (d.winkels || []).map((w) => {
    const info = winkelInfo(w.url);
    return { ...info, naam: w.naam || info.naam, url: affiliateUrl(w.url), origineel: w.url, rel: relVoor(w.url) };
  });
}

/* ---------- Specificaties ---------- */
export function specs(d) {
  const cfg = filtersPerCategorie[d.categorie];
  if (!cfg) return [];
  return cfg.groepen
    .filter((g) => d.kenmerken?.[g.key] !== undefined)
    .map((g) => ({
      key: g.key,
      label: g.specLabel || g.label,
      waarden: lijst(d.kenmerken[g.key]).map((v) => g.waarden[v] ?? v),
      positief: (g.key === 'matter' && d.kenmerken[g.key] === 'ja') || (g.key === 'hub' && d.kenmerken[g.key] === 'geen') || (g.key === 'abonnement' && d.kenmerken[g.key] === 'geen') || (g.key === 'opslag' && d.kenmerken[g.key] === 'lokaal'),
    }));
}

/** Controleert kenmerken tegen filters.mjs; gooit een duidelijke fout. */
export function valideerProduct(id, d) {
  const cfg = filtersPerCategorie[d.categorie];
  if (!cfg) throw new Error(`Product "${id}": geen filterdefinitie voor categorie "${d.categorie}" in src/data/filters.mjs.`);
  for (const [key, waarde] of Object.entries(d.kenmerken || {})) {
    const g = cfg.groepen.find((x) => x.key === key);
    if (!g) throw new Error(`Product "${id}": onbekend kenmerk "${key}" voor categorie "${d.categorie}". Toegestaan: ${cfg.groepen.map((x) => x.key).join(', ')}.`);
    for (const v of lijst(waarde)) {
      if (!(v in g.waarden)) throw new Error(`Product "${id}": kenmerk "${key}" heeft onbekende waarde "${v}". Toegestaan: ${Object.keys(g.waarden).join(', ')}.`);
    }
  }
}

export function ecoLijst(d) {
  return lijst(d.kenmerken?.werktMet).filter((v) => v in ECOSYSTEMEN);
}

/* ---------- HTML voor artikelen ---------- */
const huisIcoon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/></svg>';

export function scoreHtml(d, { groot = false } = {}) {
  const s = huurderScore(d);
  return `<span class="hp-score${groot ? ' hp-score--lg' : ''}" style="--score:${s.score}" title="Huurder-score: ${formatScore(s.score)} van 5 — ${esc(s.oordeel)}">${huisIcoon}<b>${formatScore(s.score)}</b><small>/5</small><span class="sr-only"> huurder-score, ${esc(s.oordeel)}</span></span>`;
}

function badgesHtml(d, max = 99) {
  return `<ul class="huurderproof">${huurderBadges(d).slice(0, max).map((b) => `<li class="${b.status}">${esc(b.tekst)}</li>`).join('')}</ul>`;
}

function ctaHtml(d) {
  const ws = winkels(d);
  return `<div class="cta-row">${ws
    .map((w, i) => `<a class="cta${i > 0 ? ' cta--secondary' : ''}" href="${esc(w.url)}" rel="${w.rel}" target="_blank" data-land="${w.landen.join(' ')}">${esc(i === 0 ? `Bekijk bij ${w.naam}` : w.naam)}</a>`)
    .join('')}</div>`;
}

export function productBoxHtml(id, d, { base = '/' } = {}) {
  const k = kosten3Jaar(d);
  const sp = specs(d).slice(0, 4);
  const eco = ecoLijst(d).join(' ');
  return `<div class="product-box product-box--data has-cat" data-product-id="${esc(id)}" data-cat="${esc(d.categorie)}">
<div class="pb-head">${d.label ? `<span class="badge">${esc(d.label)}</span>` : ''}${scoreHtml(d)}</div>
<h3 id="product-${esc(id)}">${esc(d.naam)}</h3>
<p class="pb-price"><strong>vanaf ${formatPrijs(d.prijs.vanaf)}</strong> <span>${esc(d.prijs.tekst)}</span></p>
${badgesHtml(d)}
<span class="eco-fit" data-eco="${esc(eco)}" hidden></span>
<p>${esc(d.samenvatting)}</p>
<dl class="pb-specs">${sp.map((s) => `<div${s.positief ? ' class="is-positive"' : ''}><dt>${esc(s.label)}</dt><dd>${esc(s.waarden.join(', '))}</dd></div>`).join('')}<div><dt>${JAREN} jaar</dt><dd>${esc(formatPrijs(k.totaal))}${k.abonnement ? ` <small>incl. abonnement</small>` : ''}${k.onbekend.length ? ` <small>+ ${esc(k.onbekend.map((e) => e.naam).join(', '))}</small>` : ''}</dd></div></dl>
<div class="pros-cons">
<div class="pros"><strong>Pluspunten</strong><ul>${(d.voordelen || []).map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
<div class="cons"><strong>Minpunten</strong><ul>${(d.nadelen || []).map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
</div>
${ctaHtml(d)}
<p class="pb-foot"><span>Prijs gecontroleerd ${esc(formatDatum(d.prijs.gecontroleerd))}</span><a href="${base}product/${esc(id)}/">Alle details en alternatieven →</a></p>
</div>`;
}

export function vergelijkingHtml(items, { base = '/' } = {}) {
  // items: [{id, data}]
  if (!items.length) return '';
  const cfg = filtersPerCategorie[items[0].data.categorie];
  const kolommen = (cfg?.tabel || []).map((key) => cfg.groepen.find((g) => g.key === key)).filter(Boolean);
  const laatste = items.map((i) => new Date(i.data.prijs.gecontroleerd)).sort((a, b) => b - a)[0];
  const cel = (d, g) => {
    const w = lijst(d.kenmerken?.[g.key]).map((v) => g.waarden[v] ?? v);
    return w.length ? esc(w.join(', ')) : '–';
  };
  return `<div class="vergelijking">
<table>
<thead><tr><th scope="col">Product</th><th scope="col">Vanaf</th><th scope="col">${JAREN} jaar</th><th scope="col">Huurder-score</th>${kolommen.map((g) => `<th scope="col">${esc(g.specLabel || g.label)}</th>`).join('')}</tr></thead>
<tbody>
${items
  .map(({ id, data: d }) => {
    const k = kosten3Jaar(d);
    return `<tr><th scope="row"><a href="${base}product/${esc(id)}/">${esc(d.naam)}</a>${d.label ? `<small>${esc(d.label)}</small>` : ''}</th><td>${formatPrijs(d.prijs.vanaf)}</td><td>${formatPrijs(k.totaal)}${k.abonnement ? '<small>incl. abonnement</small>' : ''}</td><td>${scoreHtml(d)}</td>${kolommen.map((g) => `<td>${cel(d, g)}</td>`).join('')}</tr>`;
  })
  .join('\n')}
</tbody>
</table>
<p class="vergelijking-note">Prijzen gecontroleerd op ${esc(formatDatum(laatste))}. Prijzen en voorraad wisselen snel; check de actuele prijs via de knoppen. ${JAREN}-jaarskosten = aanschaf + verplichte accessoires + verplicht abonnement.</p>
</div>`;
}
