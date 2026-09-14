import type { APIRoute } from 'astro';
import { isPreviewDeployment } from '~/lib/config';

export const GET: APIRoute = ({ site }) =>
  new Response(
    isPreviewDeployment
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
