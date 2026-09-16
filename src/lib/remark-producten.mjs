// Remark-plugin: vervangt placeholders in markdown-artikelen door HTML uit de productdata
// en zet winkel-links om naar (affiliate-)links via src/lib/winkels.mjs.
//
// In markdown (op een eigen regel, met lege regel ervoor en erna):
//   <div data-product="tapo-p110"></div>
//   <div data-vergelijking="tapo-p110,ikea-grillplats,shelly-plug-s-gen3"></div>
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { productBoxHtml, vergelijkingHtml, valideerProduct } from './producten.mjs';
import { affiliateUrl, winkelInfo } from './winkels.mjs';

const MAP = path.resolve(process.cwd(), 'src/content/producten');

function laadProducten() {
  const uit = new Map();
  if (!fs.existsSync(MAP)) return uit;
  for (const f of fs.readdirSync(MAP)) {
    if (!/\.ya?ml$/.test(f)) continue;
    const id = f.replace(/\.ya?ml$/, '');
    const data = yaml.load(fs.readFileSync(path.join(MAP, f), 'utf8'));
    if (data?.draft) continue;
    valideerProduct(id, data);
    uit.set(id, data);
  }
  return uit;
}

function walk(node, fn) {
  fn(node);
  if (node.children) for (const c of node.children) walk(c, fn);
}

const RE_PRODUCT = /^<div\s+data-product="([a-z0-9-]+)"\s*(?:\/>|>\s*<\/div>)$/;
const RE_TABEL = /^<div\s+data-vergelijking="([a-z0-9,\s-]+)"\s*(?:\/>|>\s*<\/div>)$/;

export default function remarkProducten(opties = {}) {
  const base = opties.base || '/';
  return (tree, file) => {
    const producten = laadProducten();
    const pak = (id) => {
      const d = producten.get(id);
      if (!d) throw new Error(`Artikel ${file?.path || ''}: onbekend product "${id}" (verwacht src/content/producten/${id}.yaml).`);
      return d;
    };
    walk(tree, (node) => {
      if (node.type === 'html') {
        const v = node.value.trim();
        let m;
        if ((m = v.match(RE_PRODUCT))) {
          node.value = productBoxHtml(m[1], pak(m[1]), { base });
          return;
        }
        if ((m = v.match(RE_TABEL))) {
          const ids = m[1].split(',').map((x) => x.trim()).filter(Boolean);
          node.value = vergelijkingHtml(ids.map((id) => ({ id, data: pak(id) })), { base });
          return;
        }
        // Handgeschreven winkel-links in HTML → affiliate-link
        node.value = node.value.replace(/href="(https?:\/\/[^"]+)"/g, (heel, url) => {
          const w = winkelInfo(url.replace(/&amp;/g, '&'));
          return w.affiliate ? `href="${affiliateUrl(url.replace(/&amp;/g, '&')).replace(/&/g, '&amp;')}"` : heel;
        });
      } else if (node.type === 'link' && /^https?:/.test(node.url)) {
        const w = winkelInfo(node.url);
        if (w.affiliate) node.url = affiliateUrl(node.url);
      }
    });
  };
}
