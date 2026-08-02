/**
 * Local fixture content.
 *
 * Used whenever PUBLIC_SANITY_PROJECT_ID is unset, so the site builds, previews
 * and can be reviewed before SKO's Sanity project exists. Once the project id is
 * configured the content layer switches to GROQ and this file is never read.
 *
 * CONTENT STATUS
 * --------------
 * English copy is REAL, written from the material SKO supplied: registration
 * details, vision, mission, core values, the Family Development Program, its
 * four work areas, methodology, target areas and contact details.
 *
 * Anything still bracketed as [NEEDS SKO] is a fact I do not have and will not
 * invent — principally beneficiary numbers, staff names, the Director's message,
 * partner organisations and the annual reports.
 *
 * Khmer: titles, summaries, values, statistic labels and the FAQ answers are
 * translated and marked for review. Long-form body prose is English-only for
 * now and falls back with lang="en"; it needs a Khmer-speaking staff writer.
 */

import type {
  Activity,
  DirectorMessage,
  FaqItem,
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

/** English-only body copy, pending a Khmer writer. Falls back with lang="en". */
function enOnly(en: string[]): LocaleBlocks {
  return blocks(en, []);
}

/**
 * Donation FAQs — rendered on the Donate page and emitted as FAQPage
 * structured data. Written to be quoted whole: these are the questions an
 * answer engine or AI assistant actually gets asked about a small NGO.
 */
const donationFaqs: FaqItem[] = [
  {
    question: { en: 'How can I donate to SKO?', km: 'តើខ្ញុំអាចបរិច្ចាគទៅ SKO ដោយរបៀបណា?' },
    answer: {
      en: 'You can donate by scanning a KHQR code with any Cambodian banking app, or by international bank transfer using the account details on this page. SKO does not collect card details on this website.',
      km: 'អ្នកអាចបរិច្ចាគដោយស្កេនកូដ KHQR ជាមួយកម្មវិធីធនាគារកម្ពុជាណាមួយ ឬតាមការផ្ទេរប្រាក់ធនាគារអន្តរជាតិ។ SKO មិនប្រមូលព័ត៌មានកាតឥណទាននៅលើគេហទំព័រនេះទេ។',
    },
  },
  {
    question: {
      en: 'Can I get a receipt for my donation?',
      km: 'តើខ្ញុំអាចទទួលបង្កាន់ដៃសម្រាប់ការបរិច្ចាគបានទេ?',
    },
    answer: {
      en: 'Yes. Email info@samatapheapkhnom.org with your transfer reference and the date, and SKO will send an acknowledgement letter.',
      km: 'បាទ/ចាស។ សូមផ្ញើអ៊ីមែលទៅ info@samatapheapkhnom.org ជាមួយលេខយោងនៃការផ្ទេរប្រាក់ និងកាលបរិច្ឆេទ។',
    },
  },
  {
    question: {
      en: 'What does a donation to SKO pay for?',
      km: 'តើការបរិច្ចាគទៅ SKO ត្រូវប្រើសម្រាប់អ្វី?',
    },
    answer: {
      en: '[NEEDS SKO] Answer with the actual allocation from the most recent audited accounts — for example the share going to direct family support and case work, to staff and training, and to administration.',
      km: '[NEEDS SKO] សូមឆ្លើយតាមការបែងចែកជាក់ស្តែងពីរបាយការណ៍សវនកម្មចុងក្រោយ។',
    },
  },
];

export const siteSettings: SiteSettings = {
  donationFaqs,
  orgName: { en: 'Samatapheap Khnom Organization', km: 'អង្គការសមត្ថភាពខ្ញុំ' },
  orgShortName: 'SKO',
  tagline: {
    en: 'Families with the strength to change their own lives.',
    km: 'គ្រួសារដែលមានកម្លាំងផ្លាស់ប្តូរជីវិតរបស់ខ្លួនឯង។',
  },
  registration: {
    en: 'Registered with the Ministry of Interior · Permit No. 457 (សជណ) · 20 April 2007',
    km: 'ចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃ · លិខិតអនុញ្ញាតលេខ ៤៥៧ (សជណ) · ថ្ងៃទី ២០ ខែមេសា ឆ្នាំ ២០០៧',
  },
  address: {
    en: 'Office #8AE1, Street 138,\nSangkat Veal Vong, Khan 7 Makara,\nPhnom Penh, Cambodia',
    km: 'ការិយាល័យលេខ 8AE1 ផ្លូវ ១៣៨\nសង្កាត់វាលវង់ ខណ្ឌ៧មករា\nរាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា',
  },
  officeHours: {
    en: 'Monday–Friday, 8:00–17:00 (ICT)',
    km: 'ថ្ងៃចន្ទ–សុក្រ ម៉ោង ៨:០០–១៧:០០',
  },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Street+138+Sangkat+Veal+Vong+Khan+7+Makara+Phnom+Penh',
  phone: '+855 12 781 203',
  email: 'info@samatapheapkhnom.org',
  partnerEmail: 'info@samatapheapkhnom.org',
  safeguardingContact: {
    en: '[NEEDS SKO] To report a safeguarding concern, please contact [name and role] directly at [email or phone] rather than using the form below. Concerns are treated confidentially.',
    km: '[NEEDS SKO] ដើម្បីរាយការណ៍អំពីកង្វល់ការពារកុមារ សូមទាក់ទង [ឈ្មោះ និងតួនាទី] ដោយផ្ទាល់ ជាជាងប្រើទម្រង់ខាងក្រោម។',
  },
  socials: [{ platform: 'Facebook', url: '[NEEDS SKO] https://facebook.com/…' }],
  donation: {
    qrCodes: [
      {
        label: { en: '[NEEDS SKO] Bank name', km: '[NEEDS SKO] ឈ្មោះធនាគារ' },
        instructions: { en: 'Samatapheap Khnom Organization · KHR / USD', km: 'អង្គការសមត្ថភាពខ្ញុំ · KHR / USD' },
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
        bankName: '[NEEDS SKO] Bank name',
        accountName: 'Samatapheap Khnom Organization',
        accountNumber: '[NEEDS SKO]',
        swift: '[NEEDS SKO]',
        branchAddress: '[NEEDS SKO] Branch address, Phnom Penh',
        currency: 'USD / KHR',
      },
    ],
    allocation: [
      {
        label: { en: 'Programs', km: 'កម្មវិធី' },
        percent: 0,
        note: {
          en: '[NEEDS SKO] Percentage and description — take these from the most recent audited accounts.',
          km: '[NEEDS SKO] ភាគរយ និងការពិពណ៌នា — យកតាមរបាយការណ៍សវនកម្មចុងក្រោយ។',
        },
      },
    ],
    note: enOnly([
      'For a receipt or a donation acknowledgement letter, email info@samatapheapkhnom.org with your transfer reference and the date.',
    ]),
  },
};

/* -------------------------------------------------------------------------
   Impact statistics.

   Only figures SKO has actually stated. The programme reach numbers a funder
   will look for — families supported, children reached, cases closed — are
   marked and must come from SKO's own monitoring data (they use OSCaR).
   ------------------------------------------------------------------------- */
export const impactStats: ImpactStat[] = [
  {
    _id: 'stat-since',
    value: 2007,
    displayValue: '2007',
    label: { en: 'Working in Phnom Penh since', km: 'ធ្វើការនៅរាជធានីភ្នំពេញតាំងពីឆ្នាំ' },
    context: {
      en: 'Registered with the Ministry of Interior, permit No. 457',
      km: 'ចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃ លិខិតលេខ ៤៥៧',
    },
    order: 1,
  },
  {
    _id: 'stat-khans',
    value: 5,
    displayValue: '5',
    label: { en: 'Khans of Phnom Penh', km: 'ខណ្ឌនៃរាជធានីភ្នំពេញ' },
    context: {
      en: 'Chbar Ampov, Mean Chey, Dangkor, Prek Pnov and Russey Keo',
      km: 'ច្បារអំពៅ មានជ័យ ដង្កោ ព្រែកព្នៅ និងឫស្សីកែវ',
    },
    order: 2,
  },
  {
    _id: 'stat-sangkats',
    value: 15,
    displayValue: '15',
    label: { en: 'Sangkats reached', km: 'សង្កាត់ដែលបានទៅដល់' },
    context: {
      en: 'Urban poor communities across the capital',
      km: 'សហគមន៍ក្រីក្រតាមទីក្រុងទូទាំងរាជធានី',
    },
    order: 3,
  },
  {
    _id: 'stat-families',
    value: 0,
    displayValue: '[NEEDS SKO]',
    label: { en: 'Families supported', km: 'គ្រួសារដែលបានទទួលការគាំទ្រ' },
    context: {
      en: '[NEEDS SKO] Cumulative figure from OSCaR, with the period it covers',
      km: '[NEEDS SKO] តួលេខសរុបពី OSCaR ព្រមទាំងរយៈពេលដែលគ្របដណ្តប់',
    },
    order: 4,
  },
];

/* -------------------------------------------------------------------------
   Programmes.

   Structured around what SKO actually runs: the Family Development Program is
   the flagship and the methodology; the four work areas are its outcomes. That
   ordering matters for search and answer engines too — the FDP page is the one
   that should rank for "family development approach Cambodia", and the four
   below carry the specific, answerable questions.
   ------------------------------------------------------------------------- */
export const programs: Program[] = [
  {
    _id: 'program-fdp',
    slug: 'family-development-program',
    order: 1,
    title: { en: 'Family Development Program', km: 'កម្មវិធីអភិវឌ្ឍន៍គ្រួសារ' },
    summary: {
      en: 'SKO’s flagship programme: home-based counselling and case management that helps families in Phnom Penh’s urban poor communities identify their own needs and solve their own problems.',
      km: 'កម្មវិធីស្នូលរបស់ SKO៖ ការប្រឹក្សានៅតាមផ្ទះ និងការគ្រប់គ្រងករណី ដែលជួយគ្រួសារនៅសហគមន៍ក្រីក្រក្នុងរាជធានីភ្នំពេញ ឱ្យកំណត់តម្រូវការ និងដោះស្រាយបញ្ហារបស់ខ្លួនឯង។',
    },
    body: enOnly([
      'The Family Development Program is SKO’s own programme, built on the Family Development Approach (FDA). It works from a single premise: families living in poverty are not short of capability, they are short of support, information and access. Our role is to supply those three things and then step back.',
      'Social workers visit families at home rather than asking them to travel to an office. Together they assess the situation, agree objectives the family sets for itself, and work through them over a series of visits — with referrals into health, education, administrative and economic services as needed.',
      '## How the programme works',
      'An initial visit to build an overall understanding of the household. A full family assessment. Identification of the family’s own needs and objectives. Weekly or twice-monthly home visits. An assessment for phase-out when the home-based follow-up is complete. A re-assessment six months after phase-out, to confirm the progress has held.',
      'That final six-month re-assessment matters more than it looks. It is the difference between a case that was closed and a family whose situation actually changed.',
      '## Our methods',
      'Home visits with counselling. The structured Steps of Family Development. Case management strategy and case management tools. Sharing general knowledge as the family requires it. Information and referral. Collaboration with partner service providers.',
      'Cases are managed in OSCaR, the sector-standard monitoring and evaluation system, so outcomes can be measured rather than asserted.',
      '## What families tell us changes',
      'Confidence, awareness and problem-solving skills improve. Families become able to name their own needs and use the services available to meet them. Parents meet their young children’s developmental needs more consistently. And — the test that counts — families sustain the progress after SKO withdraws.',
    ]),
  },
  {
    _id: 'program-child-protection',
    slug: 'child-protection',
    order: 2,
    title: { en: 'Child protection', km: 'ការការពារកុមារ' },
    summary: {
      en: 'Training, case management and referral built with khan and sangkat authorities, so that protection for children at risk is a local system rather than a single organisation.',
      km: 'ការបណ្តុះបណ្តាល ការគ្រប់គ្រងករណី និងការបញ្ជូន ដែលកសាងរួមជាមួយអាជ្ញាធរខណ្ឌ និងសង្កាត់ ដើម្បីឱ្យការការពារកុមារក្លាយជាប្រព័ន្ធក្នុងតំបន់ មិនមែនរបស់អង្គការតែមួយឡើយ។',
    },
    body: enOnly([
      'Protection only holds when the people already living and working in a community can recognise risk and act on it. SKO therefore works through khan and sangkat authorities, Family Development Volunteers and partner organisations rather than around them.',
      'We deliver training on child rights, child protection, positive parenting, domestic violence, and parental roles and responsibilities — to local authorities, to volunteers, and to young people in the target communities.',
      '## Case management and referral',
      'Case management is opened for young people and vulnerable children, with counselling that helps them and their families understand what they need and find their own solutions. Where a case requires services SKO does not provide, we refer — into the child protection hotline, Child Safe agents, and partner NGOs and government services.',
      'We build networks with NGOs and private-sector partners to open vocational and life-skills routes for young people and juveniles, and provide practical support where transport or connectivity is the barrier: bicycles, and the cost of getting online to learn.',
      'Emergency support — food, school materials — is provided to children and families most at risk.',
      'Outcomes are tracked in OSCaR.',
    ]),
  },
  {
    _id: 'program-preventing-separation',
    slug: 'preventing-violence-and-family-separation',
    order: 3,
    title: {
      en: 'Preventing violence and family separation',
      km: 'ការទប់ស្កាត់អំពើហិង្សា និងការបែកបាក់គ្រួសារ',
    },
    summary: {
      en: 'Counselling and case management for children at risk of being separated from their families, and work with parents to prevent domestic violence and abuse before it starts.',
      km: 'ការប្រឹក្សា និងការគ្រប់គ្រងករណីសម្រាប់កុមារដែលប្រឈមនឹងការបែកបាក់ពីគ្រួសារ ព្រមទាំងការធ្វើការជាមួយឪពុកម្តាយ ដើម្បីទប់ស្កាត់អំពើហិង្សាក្នុងគ្រួសារមុនពេលវាកើតឡើង។',
    },
    body: enOnly([
      'A child leaving their family is almost never a single event. It is the end of a sequence — of pressure, of violence, of a household running out of options. The work that matters happens earlier in that sequence.',
      'SKO provides counselling and case management to children at risk of separation and to families living with unhealthy relationships, and works with parents to build closer relationships with their children.',
      '## Who this reaches',
      'Families with no shelter or living on the street. Households affected by drug use. Children without a birth certificate. Children who have been exploited, children with disabilities, children affected by HIV/AIDS, children whose parents have migrated for work, and children living with relatives.',
      'Where a family’s needs fall outside what SKO can provide, we coordinate with other organisations to meet them — including help obtaining the official documents that unlock everything else: birth certificates, family books, marriage certificates, poor ID cards.',
      '## Strengthening protection within the household',
      'Two things change outcomes more than anything else we do: increasing the protection available to women heading households, so they can keep their children safe and domestic violence falls; and increasing men’s responsibility within the household, which makes families measurably more peaceful.',
      'Champions — women and men selected from the community groups — take on a role-model role in their own communities.',
    ]),
  },
  {
    _id: 'program-education-health',
    slug: 'education-and-health',
    order: 4,
    title: { en: 'Children’s education and health', km: 'ការអប់រំ និងសុខភាពកុមារ' },
    summary: {
      en: 'Mobile libraries, school materials, hygiene training and health check-ups — the practical support that keeps children in school and well enough to learn.',
      km: 'បណ្ណាល័យចល័ត សម្ភារៈសិក្សា ការបណ្តុះបណ្តាលអនាម័យ និងការពិនិត្យសុខភាព — ជំនួយជាក់ស្តែងដែលរក្សាកុមារឱ្យនៅសាលា និងមានសុខភាពល្អគ្រប់គ្រាន់ដើម្បីរៀន។',
    },
    body: enOnly([
      'Children in the communities SKO works in rarely leave school because they stopped valuing it. They leave because of cost, illness, or a household that needs them elsewhere. This programme removes those specific obstacles.',
      '## Education',
      'A mobile library programme builds the habit of reading and gives children a reason to want school — many return to it. School uniforms and materials are distributed to children who would otherwise go without. We meet parents regularly to follow up on their children’s progress, and mark International Children’s Day in the urban poor communities to make the value of education visible.',
      'For young people who have already left school, we assess the family’s situation and arrange vocational training matched to what the household actually needs.',
      '## Health',
      'Training on hygiene and sanitation, at both community and household level, along with hygiene and disease-prevention kits. Health check-ups and prescriptions through partner NGOs and health centres. Home visits every three months to follow up on health and schooling.',
      'This work is delivered in close cooperation with the Ministry of Social Affairs, Veterans and Youth Rehabilitation, and with local authorities.',
    ]),
  },
  {
    _id: 'program-housing',
    slug: 'housing-and-living-conditions',
    order: 5,
    title: { en: 'Safe housing and living conditions', km: 'លំនៅឋាន និងលក្ខខណ្ឌរស់នៅប្រកបដោយសុវត្ថិភាព' },
    summary: {
      en: 'Repairing and building small safe homes for unsettled families, and helping households obtain the official documents that unlock every other service.',
      km: 'ការជួសជុល និងសាងសង់ផ្ទះតូចប្រកបដោយសុវត្ថិភាពសម្រាប់គ្រួសារគ្មានទីលំនៅ និងការជួយគ្រួសារទទួលបានឯកសារផ្លូវការ ដែលបើកផ្លូវទៅកាន់សេវាកម្មផ្សេងទៀត។',
    },
    body: enOnly([
      'A family without secure shelter cannot plan. Counselling, schooling and income all depend on somewhere safe to sleep, so for some households this is where the work has to start.',
      'SKO repairs and builds small safe houses for unsettled families where that is the barrier, and provides emergency support to children and families most at risk.',
      '## Documents',
      'Alongside shelter, we work with local authorities to obtain the paperwork that poverty tends to strip away — birth certificates, family books, marriage certificates and poor ID cards. Without these a family cannot enrol a child in school, access healthcare, or claim the support they are entitled to. Getting them is unglamorous work with a disproportionate effect.',
      '## Building capacity around the family',
      'We train community volunteers, local authorities and partner NGOs in counselling and the Family Development Approach, so support does not depend on SKO being present. Quarterly meetings with NGO and government partners work through challenges and share what is working.',
    ]),
  },
];

const programRef = (slug: string) => {
  const program = programs.find((entry) => entry.slug === slug);
  return program ? { slug: program.slug, title: program.title ?? null } : null;
};

/* -------------------------------------------------------------------------
   Activities. SKO publishes here — these are structural examples only.
   ------------------------------------------------------------------------- */
export const activities: Activity[] = [
  {
    _id: 'activity-1',
    slug: 'welcome-to-the-new-sko-website',
    publishedAt: '2026-08-02T09:00:00+07:00',
    category: 'announcement',
    author: 'SKO Communications',
    featured: true,
    title: {
      en: 'Our new website is live',
      km: 'គេហទំព័រថ្មីរបស់យើងបានដំណើរការហើយ',
    },
    excerpt: {
      en: 'A bilingual home for our work in family care, child protection and community development in Phnom Penh.',
      km: 'ផ្ទះពីរភាសាសម្រាប់ការងាររបស់យើងក្នុងវិស័យថែទាំគ្រួសារ ការពារកុមារ និងអភិវឌ្ឍន៍សហគមន៍នៅរាជធានីភ្នំពេញ។',
    },
    body: enOnly([
      '[NEEDS SKO] Replace this with your own first post. This one exists to show the layout.',
    ]),
  },
  {
    _id: 'activity-2',
    slug: 'example-community-training',
    publishedAt: '2026-07-18T09:00:00+07:00',
    category: 'event',
    author: 'SKO Communications',
    featured: true,
    program: programRef('child-protection'),
    title: {
      en: '[EXAMPLE] Child protection training with local authorities',
      km: '[EXAMPLE] ការបណ្តុះបណ្តាលការពារកុមារជាមួយអាជ្ញាធរមូលដ្ឋាន',
    },
    excerpt: {
      en: '[EXAMPLE] A short summary written by staff. Two sentences is right — this is what appears on the listing page and in search results.',
      km: '[EXAMPLE] សេចក្តីសង្ខេបខ្លីសរសេរដោយបុគ្គលិក។ ពីរប្រយោគគឺល្មម។',
    },
    body: enOnly(['[EXAMPLE] The full article goes here.']),
  },
  {
    _id: 'activity-3',
    slug: 'example-family-story',
    publishedAt: '2026-06-20T09:00:00+07:00',
    category: 'story',
    author: 'SKO Communications',
    featured: true,
    program: programRef('family-development-program'),
    title: {
      en: '[EXAMPLE] One year after a case closed',
      km: '[EXAMPLE] មួយឆ្នាំក្រោយពីករណីត្រូវបានបិទ',
    },
    excerpt: {
      en: '[EXAMPLE] Stories about families use a pseudonym and never identify a child.',
      km: '[EXAMPLE] រឿងរ៉ាវអំពីគ្រួសារប្រើឈ្មោះក្លែងក្លាយ ហើយមិនបង្ហាញអត្តសញ្ញាណកុមារឡើយ។',
    },
    body: enOnly(['[EXAMPLE] The full story goes here.']),
  },
];

export const stories: Story[] = [
  {
    _id: 'story-1',
    quote: {
      en: '[NEEDS SKO] A quote from a family, in their own words. Use a pseudonym and remove anything that could identify a child.',
      km: '[NEEDS SKO] សម្រង់ពាក្យពីគ្រួសារមួយ តាមពាក្យរបស់ពួកគេផ្ទាល់។',
    },
    personName: '[Pseudonym]',
    personRole: { en: 'Parent, Family Development Program', km: 'មាតាបិតា កម្មវិធីអភិវឌ្ឍន៍គ្រួសារ' },
    useSilhouette: true,
    program: programRef('family-development-program'),
  },
];

export const partners: Partner[] = [
  {
    _id: 'partner-moi',
    name: 'Ministry of Interior',
    category: 'government',
    order: 1,
  },
  {
    _id: 'partner-mosvy',
    name: 'Ministry of Social Affairs, Veterans and Youth Rehabilitation',
    category: 'government',
    order: 2,
  },
  { _id: 'partner-3', name: '[NEEDS SKO] Partner organisation', category: 'ingo', order: 3 },
];

export const reports: Report[] = [
  {
    _id: 'report-policy',
    year: 2026,
    type: 'policy',
    title: { en: '[NEEDS SKO] Child Protection Policy', km: '[NEEDS SKO] គោលការណ៍ការពារកុមារ' },
    summary: {
      en: '[NEEDS SKO] Upload SKO’s safeguarding policy here. Funders look for this before anything else.',
      km: '[NEEDS SKO] សូមផ្ទុកឡើងគោលការណ៍ការពារកុមាររបស់ SKO នៅទីនេះ។',
    },
  },
];

export const team: TeamMember[] = [
  {
    _id: 'team-1',
    name: { en: '[NEEDS SKO] Name', km: '[NEEDS SKO] ឈ្មោះ' },
    role: { en: 'Executive Director', km: 'នាយកប្រតិបត្តិ' },
    group: 'leadership',
    order: 1,
  },
];

export const directorMessage: DirectorMessage = {
  name: { en: '[NEEDS SKO] Director’s name', km: '[NEEDS SKO] ឈ្មោះនាយក' },
  title: { en: 'Executive Director', km: 'នាយកប្រតិបត្តិ' },
  pullQuote: {
    en: '[NEEDS SKO] One sentence from the Director, set large above the message.',
    km: '[NEEDS SKO] ប្រយោគមួយពីនាយក ដាក់ធំនៅពីលើសារ។',
  },
  message: enOnly([
    '[NEEDS SKO] The Director’s message. Two or three paragraphs: what the year held, where the organisation is going, and thanks to partners and supporters.',
  ]),
};

export const orgChart: OrgChart = {
  caption: {
    en: '[NEEDS SKO] Samatapheap Khnom Organization structure',
    km: '[NEEDS SKO] រចនាសម្ព័ន្ធអង្គការសមត្ថភាពខ្ញុំ',
  },
  textVersion: enOnly([
    '[NEEDS SKO] Describe the structure as a nested list — who reports to whom. This is what makes the chart usable on a phone and for screen readers.',
  ]),
};

export const jobs: JobPost[] = [];

/* -------------------------------------------------------------------------
   Pages.
   ------------------------------------------------------------------------- */
export const pages: Page[] = [
  {
    _id: 'page-about',
    slug: 'about',
    title: { en: 'About us', km: 'អំពីយើង' },
    intro: {
      en: 'Samatapheap Khnom Organization is a Cambodian NGO working with the most vulnerable families in Phnom Penh’s urban poor communities. We have been registered with the Ministry of Interior since 2007.',
      km: 'អង្គការសមត្ថភាពខ្ញុំ ជាអង្គការក្រៅរដ្ឋាភិបាលកម្ពុជា ដែលធ្វើការជាមួយគ្រួសារងាយរងគ្រោះបំផុត នៅសហគមន៍ក្រីក្រក្នុងរាជធានីភ្នំពេញ។ យើងបានចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃតាំងពីឆ្នាំ ២០០៧។',
    },
    body: enOnly([
      'Samatapheap Khnom Organization (SKO) is a local, neutral, non-sectarian, non-political, non-racial and non-profit organization, registered with the Ministry of Interior under permit number 457 (សជណ) on 20 April 2007.',
      'SKO is recognised as a Cambodian expert in family care and social work. Our purpose is to empower and enable families to improve their own lives — through psychosocial support, information, and referrals into a network of quality providers in health, education, administration and economic services.',
      '## Our vision',
      'The most vulnerable families, children and young people are living with a quality of life and prosperity.',
      '## Our mission',
      'We work in partnership with key stakeholders to empower and enable the most vulnerable children, young people and their families to improve their own lives — through the provision and promotion of safety, health, quality education, social service provision, psychosocial support and economic support.',
      '## Our values',
      'Commitment. We work together effectively, in line with our strategic intent.',
      'Creativity. We accept the power to create and share ideas that enhance the lives of families.',
      'Hope. We inspire hope in each other, our partners, our donors and the families we work with.',
      'Integrity. We are honest and transparent in all our actions and decisions.',
      'Respect. We value the dignity, choices, potential and contribution of staff, families, partners and donors.',
      'Responsibility. We accept personal and collective responsibility for our learning and our performance, to increase our impact.',
      '## Why this work exists',
      'SKO was created after finding that poor families and the children most at risk could not access daily basic needs. Families were living without safe or settled accommodation. Households were separating. Domestic violence, poor communication and strained relationships were common. Children were losing the chance of an education, going without enough food, and experiencing abuse or neglect.',
      'The response was not to substitute for those families, but to support them — so that they could improve their own conditions and their children could grow up as full participants in their community.',
      '## Where we work',
      'SKO works in the urban poor communities of Phnom Penh, across five khans and fifteen sangkats: Chbar Ampov (Chbar Ampov 1, Chbar Ampov 2, Prek Pra), Mean Chey (Chak Angre Leu, Stung Meanchey 2, Stung Meanchey 3, Boeung Tumpun 1, Boeung Tumpun 2), Dangkor (Dangkor, Prey Sar, Prey Veng, Choeung Ek), Prek Pnov (Kork Roka) and Russey Keo (Svay Pak, Toul Sangke).',
      'The target area can be extended to neighbouring communities at the request of the Department of Social Affairs, Veterans and Youth Rehabilitation.',
    ]),
    faqs: [
      {
        question: { en: 'Is SKO a registered organisation?', km: 'តើ SKO ជាអង្គការដែលបានចុះបញ្ជីដែរឬទេ?' },
        answer: {
          en: 'Yes. Samatapheap Khnom Organization is registered with the Cambodian Ministry of Interior under permit number 457 (សជណ), issued on 20 April 2007. SKO is a local, non-political, non-profit organization.',
          km: 'បាទ/ចាស។ អង្គការសមត្ថភាពខ្ញុំ បានចុះបញ្ជីជាមួយក្រសួងមហាផ្ទៃ តាមលិខិតអនុញ្ញាតលេខ ៤៥៧ (សជណ) ចេញនៅថ្ងៃទី ២០ ខែមេសា ឆ្នាំ ២០០៧។',
        },
      },
      {
        question: { en: 'Where does SKO work?', km: 'តើ SKO ធ្វើការនៅកន្លែងណា?' },
        answer: {
          en: 'SKO works in the urban poor communities of Phnom Penh, Cambodia — across five khans (Chbar Ampov, Mean Chey, Dangkor, Prek Pnov and Russey Keo) and fifteen sangkats.',
          km: 'SKO ធ្វើការនៅសហគមន៍ក្រីក្រតាមទីក្រុងក្នុងរាជធានីភ្នំពេញ គ្របដណ្តប់ ៥ ខណ្ឌ (ច្បារអំពៅ មានជ័យ ដង្កោ ព្រែកព្នៅ និងឫស្សីកែវ) និង ១៥ សង្កាត់។',
        },
      },
      {
        question: { en: 'What does Samatapheap Khnom mean?', km: 'តើ «សមត្ថភាពខ្ញុំ» មានន័យដូចម្តេច?' },
        answer: {
          en: 'Samatapheap Khnom (សមត្ថភាពខ្ញុំ) is Khmer for “my capacity” — the belief that families already hold the capability to change their own circumstances, and that our job is to support that capacity rather than replace it.',
          km: '«សមត្ថភាពខ្ញុំ» មានន័យថាសមត្ថភាពរបស់ខ្ញុំ — ជំនឿថាគ្រួសារមានលទ្ធភាពផ្លាស់ប្តូរស្ថានភាពរបស់ខ្លួនរួចទៅហើយ ហើយតួនាទីរបស់យើងគឺគាំទ្រសមត្ថភាពនោះ មិនមែនជំនួសវាទេ។',
        },
      },
    ],
  },
  {
    _id: 'page-volunteer',
    slug: 'volunteer',
    title: { en: 'Volunteer', km: 'ស្ម័គ្រចិត្ត' },
    intro: {
      en: 'SKO works through Family Development Volunteers drawn from the communities we serve.',
      km: 'SKO ធ្វើការតាមរយៈអ្នកស្ម័គ្រចិត្តអភិវឌ្ឍន៍គ្រួសារ ដែលមកពីសហគមន៍ដែលយើងបម្រើ។',
    },
    body: enOnly([
      'Family Development Volunteers are trained in counselling and in the Family Development Approach, and work alongside SKO staff and local authorities in their own communities.',
      '## Safeguarding screening',
      'Everyone who may come into contact with children completes safeguarding screening and induction before starting. This is not optional and there are no exceptions.',
      '[NEEDS SKO] Add the volunteer roles currently open, the time commitment expected, and who to contact.',
    ]),
  },
  {
    _id: 'page-partner-with-us',
    slug: 'partner-with-us',
    title: { en: 'Partner with us', km: 'ក្លាយជាដៃគូជាមួយយើង' },
    intro: {
      en: 'SKO works in partnership with government ministries, NGOs, private-sector partners and institutional funders.',
      km: 'SKO ធ្វើការជាដៃគូជាមួយក្រសួង អង្គការក្រៅរដ្ឋាភិបាល ដៃគូវិស័យឯកជន និងម្ចាស់ជំនួយស្ថាប័ន។',
    },
    body: enOnly([
      'Partnership is not incidental to how SKO works — it is the method. Cases are referred into networks of health, education, administrative and economic providers, and quarterly meetings with NGO and government partners work through shared challenges and practice.',
      '## What we are looking for',
      'Funders and partners interested in family strengthening, child protection, and the prevention of family separation in urban poor communities. We use OSCaR for monitoring and evaluation, so programme outcomes can be reported against.',
      '## What happens next',
      '[NEEDS SKO] State the response time for partnership enquiries, and add a downloadable capability statement if you have one.',
    ]),
  },
  {
    _id: 'page-safeguarding',
    slug: 'safeguarding',
    title: { en: 'Safeguarding and child protection', km: 'ការការពារកុមារ' },
    intro: {
      en: 'Every person working with SKO — staff, volunteers and partners — is responsible for keeping children safe.',
      km: 'មនុស្សគ្រប់រូបដែលធ្វើការជាមួយ SKO — បុគ្គលិក អ្នកស្ម័គ្រចិត្ត និងដៃគូ — មានទំនួលខុសត្រូវរក្សាសុវត្ថិភាពកុមារ។',
    },
    body: enOnly([
      '[NEEDS SKO] Summarise SKO’s safeguarding policy here in plain language, and upload the full policy as a PDF under Reports & policies.',
      '## Reporting a concern',
      '[NEEDS SKO] Explain how anyone — staff, partner, community member or visitor — raises a safeguarding concern, who receives it, and what happens next. Give a named contact and a direct email or phone number.',
      'This website deliberately publishes no information that could identify a child. Stories about families use pseudonyms, and photographs are only published where documented consent exists.',
    ]),
  },
  {
    _id: 'page-privacy',
    slug: 'privacy',
    title: { en: 'Privacy', km: 'ឯកជនភាព' },
    intro: {
      en: 'What this website collects, which is almost nothing.',
      km: 'អ្វីដែលគេហទំព័រនេះប្រមូល ដែលស្ទើរតែគ្មានអ្វីទាំងអស់។',
    },
    body: blocks(
      [
        'This website sets no cookies. Analytics is provided by Cloudflare Web Analytics, which is cookieless and does not track individuals across sites. There is no advertising or tracking of any kind.',
        'When you send a message through a form on this site, the details you type are emailed to SKO and are not stored on the website or in any database. A Cloudflare Turnstile check runs to block automated spam. Your IP address is not stored; a hashed value is used briefly to limit repeated submissions.',
        'This website publishes no personal information about the children, young people or families SKO works with.',
        '[NEEDS SKO] Add how long SKO keeps emailed enquiries, and who to contact about personal data.',
      ],
      [
        'គេហទំព័រនេះមិនប្រើខូគីទេ។ ការវិភាគស្ថិតិផ្តល់ដោយ Cloudflare Web Analytics ដែលមិនប្រើខូគី និងមិនតាមដានបុគ្គលឆ្លងកាត់គេហទំព័រផ្សេងៗ។ គ្មានការផ្សាយពាណិជ្ជកម្ម ឬការតាមដានណាមួយឡើយ។',
        'នៅពេលអ្នកផ្ញើសារតាមទម្រង់នៅលើគេហទំព័រនេះ ព័ត៌មានដែលអ្នកវាយបញ្ចូលត្រូវបានផ្ញើទៅ SKO តាមអ៊ីមែល ហើយមិនត្រូវបានរក្សាទុកនៅលើគេហទំព័រទេ។',
        'គេហទំព័រនេះមិនផ្សាយព័ត៌មានផ្ទាល់ខ្លួនអំពីកុមារ យុវជន ឬគ្រួសារដែល SKO ធ្វើការជាមួយឡើយ។',
      ],
    ),
  },
];

