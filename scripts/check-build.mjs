// Draait automatisch na `npm run build` (postbuild), dus ook in de GitHub-deploy.
// Faalt (exit 1) bij kapotte interne links, te zware CSS of kapotte kernlogica.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import { affiliateConfig, affiliateUrl, relVoor } from '../src/lib/winkels.mjs';
import { huurderScore, kosten3Jaar } from '../src/lib/producten.mjs';

const DIST = 'dist';
const BASE = '/smarthomehuurders/';
const SITE = 'https://mschuur00.github.io';
const fouten = [];

// 1. Interne links en assets
const html = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) html.push(p);
  }
})(DIST);
let n = 0;
for (const file of html) {
  const src = fs.readFileSync(file, 'utf8');
  for (const [, raw] of src.matchAll(/(?:href|src|content)="([^"]+)"/g)) {
    let u = raw.startsWith(SITE) ? raw.slice(SITE.length) : raw;
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    n++;
    if (!u.startsWith(BASE)) { fouten.push(`${file}: link zonder base: ${u}`); continue; }
    const doel = path.join(DIST, decodeURIComponent(u.slice(BASE.length).split(/[?#]/)[0]));
    if (!(fs.existsSync(doel) && fs.statSync(doel).isFile()) && !fs.existsSync(path.join(doel, 'index.html'))) fouten.push(`${file}: kapotte link ${u}`);
  }
}

// 2. Budget: CSS klein houden (laadsnelheid = SEO)
const cssDir = path.join(DIST, '_astro');
for (const f of fs.existsSync(cssDir) ? fs.readdirSync(cssDir) : []) {
  if (!f.endsWith('.css')) continue;
  const gz = zlib.gzipSync(fs.readFileSync(path.join(cssDir, f))).length;
  if (gz > 25_000) fouten.push(`CSS ${f} is ${gz} bytes gzip (budget 25 KB)`);
}

// 3. Kernlogica
const oud = structuredClone(affiliateConfig);
affiliateConfig.bol.siteId = '123';
affiliateConfig.awin.publisherId = '9';
affiliateConfig.awin.merchants['coolblue-nl'] = '77';
assert.match(affiliateUrl('https://www.bol.com/nl/nl/p/x/1/'), /^https:\/\/partner\.bol\.com\/click\/click\?.*s=123.*url=https%3A%2F%2Fwww\.bol\.com/);
assert.match(affiliateUrl('https://www.coolblue.nl/product/1'), /awinmid=77&awinaffid=9&ued=/);
assert.equal(affiliateUrl('https://www.ikea.com/nl/nl/p/x/'), 'https://www.ikea.com/nl/nl/p/x/');
assert.equal(relVoor('https://www.ikea.com/nl/'), 'nofollow noopener');
Object.assign(affiliateConfig, oud);
const basis = { prijs: { vanaf: 50 }, kenmerken: {}, kosten: {} };
assert.equal(huurderScore(basis).score, 5);
assert.equal(huurderScore({ ...basis, huurder: { terugzetten: 'onderdeel', toestemming: 'aanrader' } }).score, 4);
assert.equal(huurderScore({ ...basis, kosten: { abonnement: { perMaand: 4, nodig: true } } }).score, 4);
assert.equal(kosten3Jaar({ ...basis, kosten: { abonnement: { perMaand: 4, nodig: true }, extra: [{ prijs: 10, nodig: true }, { prijs: 99, nodig: false }] } }).totaal, 50 + 144 + 10);

if (fouten.length) {
  console.error(`\n✗ check-build: ${fouten.length} probleem/problemen\n` + fouten.slice(0, 50).join('\n'));
  process.exit(1);
}
console.log(`✓ check-build: ${html.length} pagina's, ${n} interne links, CSS-budget en logica OK`);
