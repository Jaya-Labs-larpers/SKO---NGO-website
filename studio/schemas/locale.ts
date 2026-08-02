import { defineField, defineType } from 'sanity';

/**
 * Field-level localisation (ADR-002).
 *
 * One document holds both languages, so there is one Publish button and English
 * and Khmer can never drift apart or get published separately by accident.
 * Staff write both — there is no machine translation anywhere in this system.
 *
 * A missing Khmer value is a warning, never a block: the site falls back to the
 * English text with lang="en" on that element so a screen reader still switches
 * voice correctly.
 */

const KHMER_TITLE = 'ខ្មែរ (Khmer)';

export const localeString = defineType({
  name: 'localeString',
  title: 'Text (both languages)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string' }),
    defineField({
      name: 'km',
      title: KHMER_TITLE,
      type: 'string',
      validation: (rule) =>
        rule.warning('Khmer visitors will see the English text until this is filled in.'),
    }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraph (both languages)',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
    defineField({
      name: 'km',
      title: KHMER_TITLE,
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.warning('Khmer visitors will see the English text until this is filled in.'),
    }),
  ],
});

/** Rich text. Headings start at H2 — the page owns the H1. */
const blockOptions = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Heading', value: 'h2' },
      { title: 'Sub-heading', value: 'h3' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Bold', value: 'strong' },
        { title: 'Italic', value: 'em' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule: { uri: (options: object) => unknown }) =>
                rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
            },
          ],
        },
      ],
    },
  },
  { type: 'imageWithAlt' },
  { type: 'callout' },
];

export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Rich text (both languages)',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'array', of: blockOptions }),
    defineField({
      name: 'km',
      title: KHMER_TITLE,
      type: 'array',
      of: blockOptions,
      validation: (rule) =>
        rule.warning('Khmer visitors will see the English text until this is filled in.'),
    }),
  ],
});
