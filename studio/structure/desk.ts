import type { StructureResolver } from 'sanity/structure';

/**
 * Studio navigation in plain language, not a schema dump.
 *
 * Activities sits first because it is the thing staff open most days. The four
 * fixed pages are pinned as singletons so nobody can delete /about or create a
 * second /privacy.
 */
const FIXED_PAGES: { slug: string; title: string }[] = [
  { slug: 'about', title: 'About' },
  { slug: 'faq', title: 'Common questions' },
  { slug: 'volunteer', title: 'Volunteer' },
  { slug: 'partner-with-us', title: 'Partner & grants' },
  { slug: 'safeguarding', title: 'Safeguarding' },
  { slug: 'privacy', title: 'Privacy' },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Activities & news')
        .icon(() => '✍️')
        .child(S.documentTypeList('activity').title('Activities & news')),

      S.divider(),

      S.listItem()
        .title('Programs')
        .icon(() => '🏥')
        .child(S.documentTypeList('program').title('Programs')),

      S.listItem()
        .title('Impact statistics')
        .icon(() => '📊')
        .child(S.documentTypeList('impactStat').title('Impact statistics')),

      S.listItem()
        .title('Stories & testimonials')
        .icon(() => '💬')
        .child(S.documentTypeList('story').title('Stories & testimonials')),

      S.listItem()
        .title('Reports & policies')
        .icon(() => '📄')
        .child(S.documentTypeList('report').title('Reports & policies')),

      S.listItem()
        .title('Partners')
        .icon(() => '🤝')
        .child(S.documentTypeList('partner').title('Partners')),

      S.divider(),

      S.listItem()
        .title("Director's message")
        .icon(() => '👤')
        .child(S.document().schemaType('directorMessage').documentId('directorMessage')),

      S.listItem()
        .title('Organizational structure')
        .icon(() => '🗂️')
        .child(S.document().schemaType('orgChart').documentId('orgChart')),

      S.listItem()
        .title('Team')
        .icon(() => '👥')
        .child(S.documentTypeList('teamMember').title('Team')),

      S.listItem()
        .title('Jobs')
        .icon(() => '💼')
        .child(S.documentTypeList('jobPost').title('Jobs')),

      S.divider(),

      S.listItem()
        .title('Pages')
        .icon(() => '📃')
        .child(
          S.list()
            .title('Pages')
            .items(
              FIXED_PAGES.map(({ slug, title }) =>
                S.listItem()
                  .title(title)
                  .id(slug)
                  .child(S.document().schemaType('page').documentId(`page-${slug}`).title(title)),
              ),
            ),
        ),

      S.listItem()
        .title('Site settings')
        .icon(() => '📌')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ]);

/** Types that are edited only through the pinned singletons above. */
export const singletonTypes = new Set(['siteSettings', 'directorMessage', 'orgChart']);
