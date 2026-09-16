import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Live op github.io/smarthomehuurders totdat eigen domein (smarthomehuurders.nl)
// aan GitHub Pages gekoppeld is — dan site veranderen naar 'https://smarthomehuurders.nl' en base weghalen.
export default defineConfig({
  site: 'https://mschuur00.github.io',
  base: '/smarthomehuurders/',
  integrations: [sitemap()],
});
