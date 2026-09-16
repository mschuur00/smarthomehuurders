import type { APIRoute } from 'astro';

// Let op: zolang de site onder github.io/smarthomehuurders/ draait, lezen crawlers
// deze robots.txt niet (die moet op domein-root staan). Werkt vanzelf zodra het
// eigen domein gekoppeld is. Tot die tijd: sitemap handmatig indienen in Search Console.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
