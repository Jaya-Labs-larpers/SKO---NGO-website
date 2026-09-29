/**
 * Inline links in plain strings: `[anchor](/path)`.
 *
 * Page intros, FAQ answers and report summaries are plain locale strings, not
 * Portable Text. This lets staff and fixtures put a link in one without turning
 * the field into a rich-text editor. Only site paths and http(s) URLs become
 * links; everything else is escaped.
 */

import type { PortableMarkDef, PortableSpan } from './content/types';

const LINK = /\[([^\]]+)\]\(((?:\/|https?:\/\/)[^)\s]*)\)/g;

export interface InlineParts {
  children: PortableSpan[];
  markDefs: PortableMarkDef[];
}

export function inlineLinkSpans(value: string): InlineParts {
  const children: PortableSpan[] = [];
  const markDefs: PortableMarkDef[] = [];
  let last = 0;
  for (const match of value.matchAll(LINK)) {
    const start = match.index ?? 0;
    if (start > last) children.push({ _type: 'span', text: value.slice(last, start) });
    const key = `l${markDefs.length}`;
    markDefs.push({ _key: key, _type: 'link', href: match[2] });
    children.push({ _type: 'span', text: match[1] ?? '', marks: [key] });
    last = start + match[0].length;
  }
  if (last < value.length) children.push({ _type: 'span', text: value.slice(last) });
  return { children, markDefs };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Safe for `set:html`: text is escaped, links become anchors. */
export function inlineLinksToHtml(value: string): string {
  const { children, markDefs } = inlineLinkSpans(value);
  return children
    .map((span) => {
      const text = escapeHtml(span.text);
      const def = markDefs.find((entry) => entry._key === span.marks?.[0]);
      if (!def?.href) return text;
      const external = /^https?:\/\//i.test(def.href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(def.href)}"${attrs}>${text}</a>`;
    })
    .join('');
}

/** The anchor text only, for metadata and structured data that cannot hold links. */
export function stripInlineLinks(value: string): string {
  return value.replace(LINK, '$1');
}

export function hasInlineLinks(value: string): boolean {
  return new RegExp(LINK.source).test(value);
}
