// Wekelijkse controle (GitHub Action): winkel-links bereikbaar? Prijzen te lang niet gecontroleerd?
// Schrijft een markdown-rapport naar stdout. Exit 0 = alles ok, 2 = er zijn aandachtspunten.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const MAP = 'src/content/producten';
const MAX_DAGEN = 60;
const rijen = [];
const vandaag = Date.now();

for (const f of fs.readdirSync(MAP).filter((x) => /\.ya?ml$/.test(x))) {
  const d = yaml.load(fs.readFileSync(path.join(MAP, f), 'utf8'));
  if (d.draft) continue;
  const dagen = Math.floor((vandaag - new Date(d.prijs.gecontroleerd)) / 864e5);
  if (dagen > MAX_DAGEN) rijen.push(`- **${d.naam}**: prijs ${dagen} dagen niet gecontroleerd (\`${f}\`)`);
  for (const w of d.winkels) {
    try {
      const res = await fetch(w.url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (SmartHomeHuurders linkcheck)' }, signal: AbortSignal.timeout(15000) });
      if (res.status === 404 || res.status === 410) rijen.push(`- **${d.naam}**: link geeft ${res.status} → ${w.url} (\`${f}\`)`);
      else if (res.status >= 400 && ![403, 429, 503].includes(res.status)) rijen.push(`- **${d.naam}**: link geeft ${res.status} → ${w.url} (\`${f}\`)`);
      // ponytail: 403/429/503 = bot-blokkade van de winkel, niet te beoordelen → overgeslagen
    } catch (e) {
      rijen.push(`- **${d.naam}**: link niet bereikbaar (${e.name}) → ${w.url} (\`${f}\`)`);
    }
  }
}

console.log(rijen.length ? `## Aandachtspunten productdata\n\n${rijen.join('\n')}\n` : 'Alles in orde.');
process.exit(rijen.length ? 2 : 0);
