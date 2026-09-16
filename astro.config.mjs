import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkProducten from './src/lib/remark-producten.mjs';

// Live op github.io/smarthomehuurders totdat eigen domein (smarthomehuurders.nl)
// aan GitHub Pages gekoppeld is — dan site veranderen naar 'https://smarthomehuurders.nl' en base weghalen.
export default defineConfig({
  site: 'https://mschuur00.github.io',
  base: '/smarthomehuurders/',
  integrations: [sitemap()],
  markdown: {
    // Productboxen/vergelijkingstabellen uit src/content/producten + centrale affiliate-links
    remarkPlugins: [[remarkProducten, { base: '/smarthomehuurders/' }]],
  },
});
