/**
 * Local fixture content.
 *
 * Used whenever PUBLIC_SANITY_PROJECT_ID is unset, so the site builds, previews
 * and can be reviewed before SKO's Sanity project exists. Once the project id is
 * configured the content layer switches to GROQ and this file is never read.
 *
 * EVERYTHING HERE IS MARKED [PLACEHOLDER].
 * No SKO facts, statistics, staff names or a director's name are invented — the
 * bracketed values exist to exercise the components, not to make claims.
 * Khmer strings need review by an SKO staff member before launch.
 */

import type {
  Activity,
  DirectorMessage,
  ImpactStat,
  JobPost,
  LocaleBlocks,
  OrgChart,
  Page,
  Partner,
  PortableBlock,
  Program,
  Report,
  SiteSettings,
  Story,
  TeamMember,
} from './types';

/** Compact Portable Text builder. A paragraph beginning "## " becomes an h2. */
function blocks(en: string[], km: string[]): LocaleBlocks {
  const build = (paragraphs: string[]): PortableBlock[] =>
    paragraphs.map((raw, index) => {
      const isHeading = raw.startsWith('## ');
      return {
        _type: 'block' as const,
        _key: `b${index}`,
        style: isHeading ? ('h2' as const) : ('normal' as const),
        children: [{ _type: 'span' as const, text: isHeading ? raw.slice(3) : raw }],
      };
    });
  return { en: build(en), km: build(km) };
}

export const siteSettings: SiteSettings = {
  orgName: { en: '[PLACEHOLDER] Samatapheap Khnom Organization', km: '[PLACEHOLDER] អង្គការសមធម៌ខ្ញុំ' },
  orgShortName: 'SKO',
  tagline: {
    en: '[PLACEHOLDER] Safe children. Stronger families.',
    km: '[PLACEHOLDER] កុមារមានសុវត្ថិភាព គ្រួសាររឹងមាំ។',
  },
  registration: {
    en: '[PLACEHOLDER] Registered with the Ministry of Interior, 2007 · Reg. No. 0000',
    km: '[PLACEHOLDER] ចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃ ឆ្នាំ ២០០៧ · លេខបញ្ជិកា ០០០០',
  },
  address: {
    en: '[PLACEHOLDER] Street address, Sangkat, Khan,\nPhnom Penh, Cambodia',
    km: '[PLACEHOLDER] អាសយដ្ឋាន សង្កាត់ ខណ្ឌ\nរាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា',
  },
  officeHours: { en: 'Monday–Friday, 8:00–17:00 ICT', km: 'ថ្ងៃចន្ទ–សុក្រ ម៉ោង ៨:០០–១៧:០០' },
  mapUrl: 'https://www.google.com/maps',
  phone: '[+855 00 000 000]',
  email: 'placeholder@example.org',
  partnerEmail: 'placeholder-partnerships@example.org',
  safeguardingContact: {
    en: '[PLACEHOLDER] To report a safeguarding concern, contact [name/role] directly at [email] rather than using the form below.',
    km: '[PLACEHOLDER] ដើម្បីរាយការណ៍អំពីកង្វល់ការពារកុមារ សូមទាក់ទង [ឈ្មោះ/តួនាទី] ដោយផ្ទាល់តាម [អ៊ីមែល]។',
  },
  socials: [
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'YouTube', url: 'https://youtube.com' },
  ],
  donation: {
    qrCodes: [
      {
        label: { en: '[PLACEHOLDER — Bank name]', km: '[PLACEHOLDER — ឈ្មោះធនាគារ]' },
        instructions: { en: '[Account name] · KHR / USD', km: '[ឈ្មោះគណនី] · KHR / USD' },
      },
      {
        label: { en: '[PLACEHOLDER — Wallet name]', km: '[PLACEHOLDER — ឈ្មោះកាបូបអេឡិចត្រូនិក]' },
        instructions: { en: '[Account name] · KHR', km: '[ឈ្មោះគណនី] · KHR' },
      },
      {
        label: { en: 'KHQR', km: 'KHQR' },
        instructions: {
          en: 'Works with any Cambodian banking app',
          km: 'ប្រើបានជាមួយកម្មវិធីធនាគារកម្ពុជាទាំងអស់',
        },
      },
    ],
    bankAccounts: [
      {
        bankName: '[PLACEHOLDER — Bank name]',
        accountName: '[PLACEHOLDER — Account name]',
        accountNumber: '[0000 0000 0000]',
        swift: '[XXXXKHPP]',
        branchAddress: '[PLACEHOLDER — Branch address, Phnom Penh]',
        currency: 'USD / KHR',
      },
    ],
    allocation: [
      {
        label: { en: 'Programs', km: 'កម្មវិធី' },
        percent: 78,
        note: {
          en: '[PLACEHOLDER] Direct family support, case work, community outreach',
          km: '[PLACEHOLDER] ការគាំទ្រគ្រួសារដោយផ្ទាល់ ការងារករណី និងការចុះសហគមន៍',
        },
      },
      {
        label: { en: 'Staff & training', km: 'បុគ្គលិក និងការបណ្តុះបណ្តាល' },
        percent: 14,
        note: {
          en: '[PLACEHOLDER] Social workers, safeguarding training',
          km: '[PLACEHOLDER] បុគ្គលិកសង្គមកិច្ច និងការបណ្តុះបណ្តាលការពារកុមារ',
        },
      },
      {
        label: { en: 'Administration', km: 'រដ្ឋបាល' },
        percent: 8,
        note: {
          en: '[PLACEHOLDER] Audit, compliance, office',
          km: '[PLACEHOLDER] សវនកម្ម ការអនុលោមភាព និងការិយាល័យ',
        },
      },
    ],
    note: blocks(
      [
        '[PLACEHOLDER] For a receipt or a donation acknowledgement letter, email us with your transfer reference and we will reply within [n] working days.',
      ],
      [
        '[PLACEHOLDER] សម្រាប់បង្កាន់ដៃ ឬលិខិតបញ្ជាក់ការបរិច្ចាគ សូមផ្ញើអ៊ីមែលមកយើងជាមួយលេខយោងនៃការផ្ទេរប្រាក់។',
      ],
    ),
  },
};

export const impactStats: ImpactStat[] = [
  {
    _id: 'stat-1',
    value: 1240,
    displayValue: '[1,240]',
    label: { en: 'Families supported', km: 'គ្រួសារដែលបានទទួលការគាំទ្រ' },
    context: { en: '[PLACEHOLDER] Since 2007', km: '[PLACEHOLDER] ចាប់តាំងពីឆ្នាំ ២០០៧' },
    order: 1,
  },
  {
    _id: 'stat-2',
    value: 3800,
    displayValue: '[3,800]',
    label: { en: 'Children reached', km: 'កុមារដែលបានទទួលសេវា' },
    context: { en: '[PLACEHOLDER] Cumulative', km: '[PLACEHOLDER] សរុបបូកបញ្ចូលគ្នា' },
    order: 2,
  },
  {
    _id: 'stat-3',
    value: 18,
    displayValue: '[18]',
    label: { en: 'Communes', km: 'ឃុំ/សង្កាត់' },
    context: { en: '[PLACEHOLDER] Phnom Penh & Kandal', km: '[PLACEHOLDER] ភ្នំពេញ និងកណ្តាល' },
    order: 3,
  },
  {
    _id: 'stat-4',
    value: 96,
    displayValue: '[96%]',
    label: { en: 'Children remained in family care', km: 'កុមារនៅតែស្ថិតក្នុងការថែទាំគ្រួសារ' },
    context: { en: '[PLACEHOLDER] 2025 cohort', km: '[PLACEHOLDER] ក្រុមឆ្នាំ ២០២៥' },
    order: 4,
  },
];

export const programs: Program[] = [
  {
    _id: 'program-1',
    slug: 'family-care',
    order: 1,
    title: { en: 'Family care', km: 'ការថែទាំគ្រួសារ' },
    summary: {
      en: '[PLACEHOLDER] Case management, counselling and economic strengthening so families can stay together.',
      km: '[PLACEHOLDER] ការគ្រប់គ្រងករណី ការប្រឹក្សា និងការពង្រឹងសេដ្ឋកិច្ច ដើម្បីឱ្យគ្រួសារនៅជាមួយគ្នា។',
    },
    body: blocks(
      [
        '[PLACEHOLDER] A paragraph describing the family care programme, who it serves and how a family enters it.',
        '## [PLACEHOLDER] How it works',
        '[PLACEHOLDER] A second paragraph describing the steps, the staff involved and the referral pathway.',
      ],
      [
        '[PLACEHOLDER] កថាខណ្ឌពិពណ៌នាអំពីកម្មវិធីថែទាំគ្រួសារ អ្នកទទួលផល និងរបៀបចូលរួម។',
        '## [PLACEHOLDER] របៀបដំណើរការ',
        '[PLACEHOLDER] កថាខណ្ឌទីពីរពិពណ៌នាអំពីជំហាន បុគ្គលិកពាក់ព័ន្ធ និងផ្លូវបញ្ជូនករណី។',
      ],
    ),
    impactStats: [impactStats[0]!, impactStats[3]!],
  },
  {
    _id: 'program-2',
    slug: 'child-protection',
    order: 2,
    title: { en: 'Child protection', km: 'ការការពារកុមារ' },
    summary: {
      en: '[PLACEHOLDER] Community-based prevention, referral and response for children at risk of harm.',
      km: '[PLACEHOLDER] ការទប់ស្កាត់ ការបញ្ជូន និងការឆ្លើយតបនៅតាមសហគមន៍ សម្រាប់កុមារដែលប្រឈមនឹងគ្រោះថ្នាក់។',
    },
    body: blocks(
      [
        '[PLACEHOLDER] A paragraph describing the child protection programme and how it works with government referral systems.',
        '## [PLACEHOLDER] Our approach',
        '[PLACEHOLDER] A second paragraph on training community focal points and working with schools.',
      ],
      [
        '[PLACEHOLDER] កថាខណ្ឌពិពណ៌នាអំពីកម្មវិធីការពារកុមារ និងការសហការជាមួយប្រព័ន្ធបញ្ជូនរបស់រដ្ឋ។',
        '## [PLACEHOLDER] វិធីសាស្ត្ររបស់យើង',
        '[PLACEHOLDER] កថាខណ្ឌទីពីរអំពីការបណ្តុះបណ្តាលចំណុចប្រសព្វសហគមន៍ និងការធ្វើការជាមួយសាលារៀន។',
      ],
    ),
    impactStats: [impactStats[1]!, impactStats[2]!],
  },
  {
    _id: 'program-3',
    slug: 'gbv-prevention',
    order: 3,
    title: {
      en: 'Gender-based violence prevention',
      km: 'ការទប់ស្កាត់អំពើហិង្សាលើយេនឌ័រ',
    },
    summary: {
      en: '[PLACEHOLDER] Education, outreach and survivor support that shifts what communities accept.',
      km: '[PLACEHOLDER] ការអប់រំ ការចុះសហគមន៍ និងការគាំទ្រអ្នករងគ្រោះ ដើម្បីផ្លាស់ប្តូរឥរិយាបថសហគមន៍។',
    },
    body: blocks(
      [
        '[PLACEHOLDER] A paragraph describing the GBV prevention programme.',
        '## [PLACEHOLDER] Working with communities',
        '[PLACEHOLDER] A second paragraph on outreach sessions and survivor support pathways.',
      ],
      [
        '[PLACEHOLDER] កថាខណ្ឌពិពណ៌នាអំពីកម្មវិធីទប់ស្កាត់អំពើហិង្សាលើយេនឌ័រ។',
        '## [PLACEHOLDER] ការធ្វើការជាមួយសហគមន៍',
        '[PLACEHOLDER] កថាខណ្ឌទីពីរអំពីវគ្គចុះសហគមន៍ និងផ្លូវគាំទ្រអ្នករងគ្រោះ។',
      ],
    ),
  },
];

const programRef = (slug: string) => {
  const program = programs.find((entry) => entry.slug === slug);
  return program ? { slug: program.slug, title: program.title ?? null } : null;
};

const primaryActivities: Activity[] = [
  {
    _id: 'activity-1',
    slug: 'community-safeguarding-workshop',
    publishedAt: '2026-07-12T09:00:00+07:00',
    category: 'event',
    author: 'SKO Communications',
    featured: true,
    program: programRef('child-protection'),
    title: {
      en: '[PLACEHOLDER] Community safeguarding workshop in Phnom Penh',
      km: '[PLACEHOLDER] សិក្ខាសាលាការពារកុមារក្នុងសហគមន៍នៅរាជធានីភ្នំពេញ',
    },
    excerpt: {
      en: '[PLACEHOLDER] A two-day workshop with community focal points on recognising and referring child protection concerns.',
      km: '[PLACEHOLDER] សិក្ខាសាលារយៈពេលពីរថ្ងៃជាមួយចំណុចប្រសព្វសហគមន៍ ស្តីពីការសម្គាល់ និងការបញ្ជូនករណីការពារកុមារ។',
    },
    body: blocks(
      [
        '[PLACEHOLDER] A standfirst paragraph carrying the summary a reader needs before committing to the article.',
        '[PLACEHOLDER] Body copy from the CMS. Portable Text renders headings, lists, links and inline images through the same components used everywhere else on the site.',
        '## [PLACEHOLDER] What happened',
        '[PLACEHOLDER] A closing paragraph describing outcomes and next steps.',
      ],
      [
        '[PLACEHOLDER] កថាខណ្ឌសង្ខេបដែលអ្នកអានត្រូវការមុនពេលអានអត្ថបទទាំងមូល។',
        '[PLACEHOLDER] អត្ថបទមេពី CMS។ Portable Text បង្ហាញចំណងជើង បញ្ជី តំណភ្ជាប់ និងរូបភាព។',
        '## [PLACEHOLDER] អ្វីដែលបានកើតឡើង',
        '[PLACEHOLDER] កថាខណ្ឌបញ្ចប់ពិពណ៌នាអំពីលទ្ធផល និងជំហានបន្ទាប់។',
      ],
    ),
  },
  {
    _id: 'activity-2',
    slug: 'new-partnership-announced',
    publishedAt: '2026-06-28T09:00:00+07:00',
    category: 'news',
    author: 'SKO Communications',
    featured: true,
    title: {
      en: '[PLACEHOLDER] New partnership announced',
      km: '[PLACEHOLDER] ការប្រកាសភាពជាដៃគូថ្មី',
    },
    excerpt: {
      en: '[PLACEHOLDER] A short summary of a new partnership and what it means for the families we work with.',
      km: '[PLACEHOLDER] សេចក្តីសង្ខេបអំពីភាពជាដៃគូថ្មី និងអត្ថន័យរបស់វាចំពោះគ្រួសារដែលយើងធ្វើការជាមួយ។',
    },
    body: blocks(
      ['[PLACEHOLDER] Article body.'],
      ['[PLACEHOLDER] អត្ថបទ។'],
    ),
  },
  {
    _id: 'activity-3',
    slug: 'one-year-on',
    publishedAt: '2026-06-03T09:00:00+07:00',
    category: 'story',
    author: 'SKO Communications',
    featured: true,
    program: programRef('family-care'),
    title: {
      en: '[PLACEHOLDER] One family, one year on',
      km: '[PLACEHOLDER] គ្រួសារមួយ ក្រោយមួយឆ្នាំ',
    },
    excerpt: {
      en: '[PLACEHOLDER] Following up with a family a year after their case closed. Names and details are changed.',
      km: '[PLACEHOLDER] ការតាមដានគ្រួសារមួយ បន្ទាប់ពីករណីត្រូវបានបិទរយៈពេលមួយឆ្នាំ។ ឈ្មោះត្រូវបានផ្លាស់ប្តូរ។',
    },
    body: blocks(
      ['[PLACEHOLDER] Article body. No identifying details about any child are ever published.'],
      ['[PLACEHOLDER] អត្ថបទ។ ព័ត៌មានសម្គាល់អត្តសញ្ញាណកុមារ មិនត្រូវបានផ្សព្វផ្សាយឡើយ។'],
    ),
  },
  {
    _id: 'activity-4',
    slug: 'annual-report-published',
    publishedAt: '2026-05-20T09:00:00+07:00',
    category: 'announcement',
    author: 'SKO Communications',
    title: {
      en: '[PLACEHOLDER] Annual report published',
      km: '[PLACEHOLDER] របាយការណ៍ប្រចាំឆ្នាំត្រូវបានចេញផ្សាយ',
    },
    excerpt: {
      en: '[PLACEHOLDER] Our annual report and audited financial statements are now available to download.',
      km: '[PLACEHOLDER] របាយការណ៍ប្រចាំឆ្នាំ និងរបាយការណ៍ហិរញ្ញវត្ថុដែលបានធ្វើសវនកម្ម អាចទាញយកបានឥឡូវនេះ។',
    },
    body: blocks(['[PLACEHOLDER] Article body.'], ['[PLACEHOLDER] អត្ថបទ។']),
  },
];

/**
 * Filler posts so the archive spills onto a second page and pagination is
 * actually exercised in preview. Obviously placeholder — they exist to test the
 * layout, not to look like content.
 */
const fillerActivities: Activity[] = Array.from({ length: 8 }, (_, index) => {
  const number = index + 5;
  const month = 4 - Math.floor(index / 2);
  const day = index % 2 === 0 ? 18 : 4;
  const categories = ['news', 'event', 'story', 'announcement'] as const;
  return {
    _id: `activity-${number}`,
    slug: `placeholder-post-${number}`,
    publishedAt: `2026-${String(Math.max(month, 1)).padStart(2, '0')}-${String(day).padStart(2, '0')}T09:00:00+07:00`,
    category: categories[index % categories.length]!,
    author: 'SKO Communications',
    title: {
      en: `[PLACEHOLDER] Activity post ${number}`,
      km: `[PLACEHOLDER] សកម្មភាពទី ${number}`,
    },
    excerpt: {
      en: '[PLACEHOLDER] A one- or two-sentence summary of this activity, written by staff in the CMS.',
      km: '[PLACEHOLDER] សេចក្តីសង្ខេបមួយ ឬពីរប្រយោគអំពីសកម្មភាពនេះ សរសេរដោយបុគ្គលិកនៅក្នុង CMS។',
    },
    body: blocks(['[PLACEHOLDER] Article body.'], ['[PLACEHOLDER] អត្ថបទ។']),
  } satisfies Activity;
});

export const activities: Activity[] = [...primaryActivities, ...fillerActivities];

export const stories: Story[] = [
  {
    _id: 'story-1',
    quote: {
      en: '[PLACEHOLDER] "The support meant my daughter could stay with me and go back to school. I did not think that was possible."',
      km: '[PLACEHOLDER] «ការគាំទ្រនេះធ្វើឱ្យកូនស្រីខ្ញុំអាចនៅជាមួយខ្ញុំ និងត្រឡប់ទៅសាលារៀនវិញ។ ខ្ញុំមិនគិតថាវាអាចទៅរួចទេ។»',
    },
    personName: '[Pseudonym]',
    personRole: { en: 'Parent, family care program', km: 'មាតាបិតា កម្មវិធីថែទាំគ្រួសារ' },
    useSilhouette: true,
    program: programRef('family-care'),
  },
  {
    _id: 'story-2',
    quote: {
      en: '[PLACEHOLDER] "The training changed how our village responds when a child is at risk."',
      km: '[PLACEHOLDER] «ការបណ្តុះបណ្តាលបានផ្លាស់ប្តូររបៀបដែលភូមិយើងឆ្លើយតប នៅពេលកុមារប្រឈមនឹងគ្រោះថ្នាក់។»',
    },
    personName: '[Pseudonym]',
    personRole: { en: 'Community focal point', km: 'ចំណុចប្រសព្វសហគមន៍' },
    useSilhouette: true,
    program: programRef('child-protection'),
  },
];

export const partners: Partner[] = [
  { _id: 'partner-1', name: '[PLACEHOLDER — Partner 1]', category: 'un-agency', order: 1 },
  { _id: 'partner-2', name: '[PLACEHOLDER — Partner 2]', category: 'un-agency', order: 2 },
  { _id: 'partner-3', name: '[PLACEHOLDER — Partner 3]', category: 'ingo', order: 3 },
  { _id: 'partner-4', name: '[PLACEHOLDER — Partner 4]', category: 'ingo', order: 4 },
  { _id: 'partner-5', name: '[PLACEHOLDER — Partner 5]', category: 'foundation', order: 5 },
  { _id: 'partner-6', name: '[PLACEHOLDER — Partner 6]', category: 'government', order: 6 },
];

export const reports: Report[] = [
  {
    _id: 'report-1',
    year: 2025,
    type: 'annual-report',
    title: { en: '[PLACEHOLDER] Annual Report 2025', km: '[PLACEHOLDER] របាយការណ៍ប្រចាំឆ្នាំ ២០២៥' },
    summary: {
      en: '[PLACEHOLDER] Programme results, financials and governance for the year.',
      km: '[PLACEHOLDER] លទ្ធផលកម្មវិធី ហិរញ្ញវត្ថុ និងអភិបាលកិច្ចប្រចាំឆ្នាំ។',
    },
  },
  {
    _id: 'report-2',
    year: 2025,
    type: 'financial',
    title: {
      en: '[PLACEHOLDER] Audited Financial Statements 2025',
      km: '[PLACEHOLDER] របាយការណ៍ហិរញ្ញវត្ថុដែលបានធ្វើសវនកម្ម ២០២៥',
    },
  },
  {
    _id: 'report-3',
    year: 2024,
    type: 'annual-report',
    title: { en: '[PLACEHOLDER] Annual Report 2024', km: '[PLACEHOLDER] របាយការណ៍ប្រចាំឆ្នាំ ២០២៤' },
  },
  {
    _id: 'report-4',
    year: 2025,
    type: 'policy',
    title: {
      en: '[PLACEHOLDER] Child Protection Policy',
      km: '[PLACEHOLDER] គោលការណ៍ការពារកុមារ',
    },
    summary: {
      en: '[PLACEHOLDER] How we keep children safe in everything we do.',
      km: '[PLACEHOLDER] របៀបដែលយើងធានាសុវត្ថិភាពកុមារក្នុងគ្រប់សកម្មភាព។',
    },
  },
];

export const team: TeamMember[] = [
  {
    _id: 'team-1',
    name: { en: '[PLACEHOLDER — Name]', km: '[PLACEHOLDER — ឈ្មោះ]' },
    role: { en: 'Executive Director', km: 'នាយកប្រតិបត្តិ' },
    group: 'leadership',
    order: 1,
  },
  {
    _id: 'team-2',
    name: { en: '[PLACEHOLDER — Name]', km: '[PLACEHOLDER — ឈ្មោះ]' },
    role: { en: 'Programs Manager', km: 'ប្រធានកម្មវិធី' },
    group: 'leadership',
    order: 2,
  },
  {
    _id: 'team-3',
    name: { en: '[PLACEHOLDER — Name]', km: '[PLACEHOLDER — ឈ្មោះ]' },
    role: { en: 'Finance & Administration', km: 'ហិរញ្ញវត្ថុ និងរដ្ឋបាល' },
    group: 'staff',
    order: 3,
  },
];

export const directorMessage: DirectorMessage = {
  name: { en: '[PLACEHOLDER — Director’s name]', km: '[PLACEHOLDER — ឈ្មោះនាយក]' },
  title: { en: 'Executive Director', km: 'នាយកប្រតិបត្តិ' },
  pullQuote: {
    en: '[PLACEHOLDER] Every child deserves a family that can protect them — and every family deserves the support to do it.',
    km: '[PLACEHOLDER] កុមារគ្រប់រូបសមនឹងមានគ្រួសារដែលអាចការពារពួកគេបាន ហើយគ្រួសារគ្រប់គ្រួសារសមនឹងទទួលការគាំទ្រ។',
  },
  message: blocks(
    [
      '[PLACEHOLDER] Since our registration with the Ministry of Interior in 2007, we have worked alongside families in Phnom Penh to keep children safe, supported and in school.',
      '[PLACEHOLDER] This second paragraph carries the director’s account of the year, the organisation’s direction, and an acknowledgement of partners and supporters.',
    ],
    [
      '[PLACEHOLDER] ចាប់តាំងពីការចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃក្នុងឆ្នាំ ២០០៧ យើងបានធ្វើការជាមួយគ្រួសារនៅរាជធានីភ្នំពេញ ដើម្បីរក្សាកុមារឱ្យមានសុវត្ថិភាព និងបានទៅសាលារៀន។',
      '[PLACEHOLDER] កថាខណ្ឌទីពីរ រៀបរាប់អំពីទិសដៅរបស់អង្គការ និងការថ្លែងអំណរគុណដល់ដៃគូ និងអ្នកគាំទ្រ។',
    ],
  ),
};

export const orgChart: OrgChart = {
  caption: {
    en: '[PLACEHOLDER] SKO organizational structure, 2026.',
    km: '[PLACEHOLDER] រចនាសម្ព័ន្ធអង្គការ ឆ្នាំ ២០២៦។',
  },
  textVersion: blocks(
    [
      '[PLACEHOLDER] Board of Directors oversees the Executive Director.',
      '[PLACEHOLDER] The Executive Director oversees the Programs Manager (Family Care, Child Protection, GBV Prevention), Finance & Administration, and Monitoring & Evaluation.',
    ],
    [
      '[PLACEHOLDER] ក្រុមប្រឹក្សាភិបាល ត្រួតពិនិត្យនាយកប្រតិបត្តិ។',
      '[PLACEHOLDER] នាយកប្រតិបត្តិ ត្រួតពិនិត្យប្រធានកម្មវិធី ហិរញ្ញវត្ថុ និងរដ្ឋបាល និងផ្នែកត្រួតពិនិត្យវាយតម្លៃ។',
    ],
  ),
};

export const jobs: JobPost[] = [
  {
    _id: 'job-1',
    slug: 'social-worker',
    title: { en: '[PLACEHOLDER] Social Worker', km: '[PLACEHOLDER] បុគ្គលិកសង្គមកិច្ច' },
    employmentType: 'full-time',
    location: { en: 'Phnom Penh', km: 'រាជធានីភ្នំពេញ' },
    deadline: '2027-12-31',
    publishedAt: '2026-07-01T09:00:00+07:00',
    description: blocks(
      ['[PLACEHOLDER] Role description, responsibilities and required experience.'],
      ['[PLACEHOLDER] ការពិពណ៌នាតួនាទី ភារកិច្ច និងបទពិសោធន៍ដែលត្រូវការ។'],
    ),
    howToApply: blocks(
      ['[PLACEHOLDER] Email your CV and a short cover letter to [email]. We do not accept uploads through this website.'],
      ['[PLACEHOLDER] សូមផ្ញើប្រវត្តិរូប និងលិខិតសម្គាល់ខ្លីមកកាន់ [អ៊ីមែល]។ យើងមិនទទួលឯកសារតាមគេហទំព័រនេះទេ។'],
    ),
  },
];

export const pages: Page[] = [
  {
    _id: 'page-about',
    slug: 'about',
    title: { en: 'About us', km: 'អំពីយើង' },
    intro: {
      en: '[PLACEHOLDER] Since our registration with the Ministry of Interior in 2007 we have worked alongside families in Phnom Penh.',
      km: '[PLACEHOLDER] ចាប់តាំងពីការចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃក្នុងឆ្នាំ ២០០៧ យើងបានធ្វើការជាមួយគ្រួសារនៅរាជធានីភ្នំពេញ។',
    },
    body: blocks(
      [
        '## [PLACEHOLDER] Our mission',
        '[PLACEHOLDER] A paragraph stating the mission in the organisation’s own words.',
        '## [PLACEHOLDER] Our history',
        '[PLACEHOLDER] A paragraph on the organisation’s history since 2007.',
        '## [PLACEHOLDER] Our values',
        '[PLACEHOLDER] A paragraph on values and how they shape the work.',
      ],
      [
        '## [PLACEHOLDER] បេសកកម្មរបស់យើង',
        '[PLACEHOLDER] កថាខណ្ឌបញ្ជាក់អំពីបេសកកម្មតាមពាក្យរបស់អង្គការ។',
        '## [PLACEHOLDER] ប្រវត្តិរបស់យើង',
        '[PLACEHOLDER] កថាខណ្ឌអំពីប្រវត្តិអង្គការចាប់តាំងពីឆ្នាំ ២០០៧។',
        '## [PLACEHOLDER] គុណតម្លៃរបស់យើង',
        '[PLACEHOLDER] កថាខណ្ឌអំពីគុណតម្លៃ និងរបៀបដែលវាកំណត់ការងារ។',
      ],
    ),
  },
  {
    _id: 'page-volunteer',
    slug: 'volunteer',
    title: { en: 'Volunteer', km: 'ស្ម័គ្រចិត្ត' },
    intro: {
      en: '[PLACEHOLDER] How to volunteer with us, and what we ask of volunteers.',
      km: '[PLACEHOLDER] របៀបចូលរួមជាអ្នកស្ម័គ្រចិត្ត និងអ្វីដែលយើងសុំពីអ្នកស្ម័គ្រចិត្ត។',
    },
    body: blocks(
      [
        '## [PLACEHOLDER] Roles',
        '[PLACEHOLDER] Descriptions of the volunteer roles available.',
        '## [PLACEHOLDER] Safeguarding screening',
        '[PLACEHOLDER] All volunteers who may come into contact with children complete a safeguarding screening and induction. This is not optional.',
      ],
      [
        '## [PLACEHOLDER] តួនាទី',
        '[PLACEHOLDER] ការពិពណ៌នាអំពីតួនាទីស្ម័គ្រចិត្តដែលមាន។',
        '## [PLACEHOLDER] ការត្រួតពិនិត្យការពារកុមារ',
        '[PLACEHOLDER] អ្នកស្ម័គ្រចិត្តទាំងអស់ដែលអាចប៉ះពាល់ជាមួយកុមារ ត្រូវឆ្លងកាត់ការត្រួតពិនិត្យ និងការណែនាំអំពីការពារកុមារ។',
      ],
    ),
  },
  {
    _id: 'page-partner-with-us',
    slug: 'partner-with-us',
    title: { en: 'Partner & grant inquiry', km: 'សំណួរអំពីភាពជាដៃគូ' },
    intro: {
      en: '[PLACEHOLDER] We work with institutional funders, international NGOs and government partners.',
      km: '[PLACEHOLDER] យើងធ្វើការជាមួយម្ចាស់ជំនួយស្ថាប័ន អង្គការក្រៅរដ្ឋាភិបាលអន្តរជាតិ និងដៃគូរដ្ឋាភិបាល។',
    },
    body: blocks(
      [
        '## [PLACEHOLDER] What we are looking for',
        '[PLACEHOLDER] A paragraph on the kinds of partnership the organisation seeks.',
        '## [PLACEHOLDER] What happens next',
        '[PLACEHOLDER] We aim to reply to partnership inquiries within [n] working days.',
      ],
      [
        '## [PLACEHOLDER] អ្វីដែលយើងកំពុងស្វែងរក',
        '[PLACEHOLDER] កថាខណ្ឌអំពីប្រភេទភាពជាដៃគូដែលអង្គការស្វែងរក។',
        '## [PLACEHOLDER] ជំហានបន្ទាប់',
        '[PLACEHOLDER] យើងខិតខំឆ្លើយតបសំណួរភាពជាដៃគូក្នុងរយៈពេល [n] ថ្ងៃធ្វើការ។',
      ],
    ),
  },
  {
    _id: 'page-safeguarding',
    slug: 'safeguarding',
    title: { en: 'Safeguarding & child protection', km: 'គោលការណ៍ការពារកុមារ' },
    intro: {
      en: '[PLACEHOLDER] Our safeguarding policy in plain language, and how to raise a concern.',
      km: '[PLACEHOLDER] គោលការណ៍ការពារកុមាររបស់យើងជាភាសាងាយយល់ និងរបៀបរាយការណ៍កង្វល់។',
    },
    body: blocks(
      [
        '## [PLACEHOLDER] Our commitments',
        '[PLACEHOLDER] A plain-language summary of the safeguarding commitments.',
        '## [PLACEHOLDER] Raising a concern',
        '[PLACEHOLDER] How anyone — staff, partner, community member or visitor — can raise a safeguarding concern, and what happens next.',
      ],
      [
        '## [PLACEHOLDER] ការប្តេជ្ញាចិត្តរបស់យើង',
        '[PLACEHOLDER] សេចក្តីសង្ខេបជាភាសាងាយយល់អំពីការប្តេជ្ញាចិត្តការពារកុមារ។',
        '## [PLACEHOLDER] ការរាយការណ៍កង្វល់',
        '[PLACEHOLDER] របៀបដែលនរណាម្នាក់អាចរាយការណ៍កង្វល់ការពារកុមារ និងជំហានបន្ទាប់។',
      ],
    ),
  },
  {
    _id: 'page-privacy',
    slug: 'privacy',
    title: { en: 'Privacy', km: 'ឯកជនភាព' },
    intro: {
      en: '[PLACEHOLDER] What this website collects, which is almost nothing.',
      km: '[PLACEHOLDER] អ្វីដែលគេហទំព័រនេះប្រមូល ដែលស្ទើរតែគ្មានអ្វីទាំងអស់។',
    },
    body: blocks(
      [
        'This website uses Cloudflare Web Analytics, which is cookieless and does not track individuals across sites. No advertising or tracking cookies are set.',
        'When you send a message through a form on this site, the details you type are emailed to us and are not stored on the website or in any database. A Cloudflare Turnstile check runs to block automated spam.',
        '[PLACEHOLDER] Add the organisation’s data retention practice for emailed inquiries here.',
      ],
      [
        'គេហទំព័រនេះប្រើ Cloudflare Web Analytics ដែលមិនប្រើខូគី និងមិនតាមដានបុគ្គលឆ្លងកាត់គេហទំព័រផ្សេងៗឡើយ។',
        'នៅពេលអ្នកផ្ញើសារតាមទម្រង់នៅលើគេហទំព័រនេះ ព័ត៌មានដែលអ្នកវាយបញ្ចូល ត្រូវបានផ្ញើមកយើងតាមអ៊ីមែល ហើយមិនត្រូវបានរក្សាទុកនៅលើគេហទំព័រទេ។',
        '[PLACEHOLDER] សូមបន្ថែមគោលការណ៍រក្សាទុកទិន្នន័យរបស់អង្គការនៅទីនេះ។',
      ],
    ),
  },
];
