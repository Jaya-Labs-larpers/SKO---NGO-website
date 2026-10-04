import type { APIRoute } from 'astro';
import { preventIndexing } from '~/lib/config';

const AI_SEARCH_BOTS = [
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Amzn-SearchBot',
  'meta-webindexer',
  'Applebot',
];

const allowAll = [
  ...AI_SEARCH_BOTS.map((bot) => `User-agent: ${bot}`),
  'Allow: /',
  '',
  'User-agent: *',
  'Allow: /',
].join('\n');

export const GET: APIRoute = ({ site }) =>
  new Response(
    preventIndexing
      ? 'User-agent: *\nDisallow: /\n'
      : `${allowAll}\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
