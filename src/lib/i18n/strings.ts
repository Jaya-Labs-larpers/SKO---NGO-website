import type { Locale } from './config';

/**
 * UI chrome strings. Page and article content comes from Sanity — this file is
 * only for text baked into components (nav labels, button words, form errors).
 *
 * [KHMER REVIEW REQUIRED] The Khmer below is a working translation of interface
 * chrome. An SKO staff member must review it before launch. Content copy is
 * never translated here — staff write it in the CMS in both languages.
 */
const en = {
  // --- Navigation -----------------------------------------------------------
  navHome: 'Home',
  navAbout: 'About',
  navWork: 'Our work',
  navPrograms: 'Programs',
  navImpact: 'Impact',
  navActivities: 'Activities',
  navGetInvolved: 'Get involved',
  navReports: 'Reports',
  navSafeguarding: 'Safeguarding',
  navPartners: 'Partners',
  navDonate: 'Donate',
  navPartnerWithUs: 'Partner with us',
  navVolunteer: 'Volunteer',
  navCareers: 'Careers',
  navContact: 'Contact',
  navPrivacy: 'Privacy',

  // --- Chrome ---------------------------------------------------------------
  skipToContent: 'Skip to content',
  menu: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  language: 'Language',
  switchToKhmer: 'Switch to Khmer',
  switchToEnglish: 'Switch to English',
  breadcrumbLabel: 'Breadcrumb',
  mainNavLabel: 'Main navigation',
  footerNavLabel: 'Footer navigation',

  // --- Generic actions ------------------------------------------------------
  readMore: 'Read more',
  learnMore: 'Learn more',
  viewAll: 'View all',
  previous: 'Previous',
  next: 'Next',
  download: 'Download',
  backTo: 'Back to',
  donateNow: 'Donate now',
  partnerWithUs: 'Partner with us',
  contactUs: 'Contact us',
  seeReports: 'See our reports',
  ourPrograms: 'Our programs',
  readAsText: 'Read the structure as text',
  enlargeImage: 'Enlarge image',
  tapToEnlarge: 'Tap to enlarge',

  // --- Section headings -----------------------------------------------------
  faqHeading: 'Common questions',
  latestActivities: 'Latest activities',
  whatWeDo: 'What we do',
  trustedBy: 'Trusted by',
  directorMessage: "Message from the Director",
  orgStructure: 'Organizational structure',
  ourTeam: 'Our team',
  relatedProgram: 'Related program',
  moreStories: 'Read more stories',
  allActivities: 'All activities',

  // --- Page titles (section indexes; page bodies come from the CMS) ---------
  pageActivities: 'Activities & news',
  pagePrograms: 'Our work',
  pageImpact: 'Impact & results',
  pageReports: 'Annual reports & financials',
  pageSafeguarding: 'Safeguarding & child protection',
  pagePartners: 'Partners & supporters',
  pageDonate: 'Donate',
  pagePartnerInquiry: 'Partner & grant inquiry',
  pageVolunteer: 'Volunteer',
  pageCareers: 'Careers',
  pageContact: 'Contact us',
  pageAbout: 'About us',
  pagePrivacy: 'Privacy',
  pageFaq: 'Common questions',
  navFaq: 'FAQ',

  // --- Footer ---------------------------------------------------------------
  footerOrganisation: 'Organisation',
  footerTransparency: 'Transparency',
  footerGetInvolved: 'Get involved',
  footerContactHeading: 'Contact',
  allRightsReserved: 'All rights reserved.',

  // --- Donate ---------------------------------------------------------------
  scanToGive: 'Scan to give',
  bankTransfer: 'International bank transfer',
  whereMoneyGoes: 'Where your money goes',
  accountName: 'Account name',
  accountNumber: 'Account number',
  bankName: 'Bank',
  swift: 'SWIFT / BIC',
  bankAddress: 'Bank address',
  currency: 'Currency',
  copy: 'Copy',
  copied: 'Copied',
  noCardNotice: 'We do not collect card details on this website.',

  // --- Forms ----------------------------------------------------------------
  formName: 'Your name',
  formEmail: 'Email',
  formOrganization: 'Organization',
  formCountry: 'Country',
  formPhone: 'Phone',
  formSubject: 'Subject',
  formMessage: 'Message',
  formRequired: 'required',
  formOptional: 'optional',
  formSend: 'Send message',
  formSendInquiry: 'Send inquiry',
  formSending: 'Sending…',
  formHoneypotLabel: 'Leave this field blank',
  errRequired: 'This field is required.',
  errEmail: 'Enter a complete email address, for example name@example.org',
  errTooShort: 'Please write a little more so we can help.',
  errTooLong: 'That message is too long. Please shorten it.',
  formSuccessTitle: 'Thank you. Your message has been sent.',
  formSuccessBody: 'Nothing you typed is stored on this website.',
  formErrorTitle: "We couldn't send that.",
  formErrorBody: 'Please try again, or email us directly at',
  formVerifyLabel: 'Security check',

  // --- Empty & error states -------------------------------------------------
  emptyActivities: 'No activities have been published yet.',
  emptyJobs: 'There are no open positions right now.',
  emptyReports: 'No reports have been published yet.',
  emptyGeneric: 'Nothing here yet.',
  notFoundTitle: 'Page not found',
  notFoundBody: 'The page you were looking for has moved or never existed.',
  notFoundCta: 'Go to the homepage',

  // --- Placeholder marketing copy -------------------------------------------
  // These sit here rather than in a component so nothing English can leak onto
  // a Khmer page. In Phase 4 they move into Sanity `page` documents so staff
  // can edit them; the keys stay as the fallback.
  homeHeroIntro:
    'Samatapheap Khnom Organization (SKO) is a Cambodian local NGO working to support vulnerable children, families, and communities, particularly in urban poor and migrant communities.',
  introPrograms: 'Four projects, one approach: a child growing up safe, in a family, in their own community.',
  introActivities: 'What our teams are doing, month by month.',
  introImpact:
    'What we have done, how we count it, and what the families we work with say.',
  introReports:
    'Our annual reports, audited financial statements and governance documents.',
  introPartners: 'The institutions and organisations we work alongside.',
  introCareers:
    'Open positions. Applications are by email. We do not accept uploads through this website.',
  introContact:
    'Our office address, phone and email, and a form for general enquiries.',
  donateHeroTitle: 'Give directly. No middleman.',
  donateHeroIntro:
    'Scan a QR code from your banking app, or transfer internationally using the details below.',
  methodologyTitle: 'How we count.',
  methodologyBody:
    'Figures come from SKO’s project monitoring and partner reports for each project’s period; cases are managed in OSCaR.',
  ctaHomeTitle: 'Your support keeps a child with their family.',
  ctaHomeBody:
    'Give once or monthly by QR or bank transfer. It is accounted for in our published annual and audit reports.',
  ctaAboutTitle: 'Support the families we work with.',
  ctaAboutBody: 'Every donation is accounted for in our published annual and audit reports.',
  ctaProgramsTitle: 'Fund a program.',
  ctaProgramTitle: 'Support this program.',
  ctaImpactTitle: 'Help us reach more families.',
  ctaPartnersTitle: 'Work with us.',
  mapPlaceholder: '[STATIC MAP IMAGE → LINKS TO GOOGLE MAPS]',

  // --- Meta -----------------------------------------------------------------
  fileSizeLabel: 'file size',
  languageEnglish: 'English',
  languageKhmer: 'Khmer',
  closesOn: 'Closes on',
  publishedOn: 'Published',
} as const;

export type UIKey = keyof typeof en;

/** [KHMER REVIEW REQUIRED] — see note at the top of this file. */
const km: Record<UIKey, string> = {
  navHome: 'ទំព័រដើម',
  navAbout: 'អំពីយើង',
  navWork: 'ការងាររបស់យើង',
  navPrograms: 'កម្មវិធី',
  navImpact: 'លទ្ធផល',
  navActivities: 'សកម្មភាព',
  navGetInvolved: 'ចូលរួមជាមួយយើង',
  navReports: 'របាយការណ៍',
  navSafeguarding: 'គោលការណ៍ការពារកុមារ',
  navPartners: 'ដៃគូ',
  navDonate: 'បរិច្ចាគ',
  navPartnerWithUs: 'ក្លាយជាដៃគូ',
  navVolunteer: 'ស្ម័គ្រចិត្ត',
  navCareers: 'ការងារ',
  navContact: 'ទំនាក់ទំនង',
  navPrivacy: 'ឯកជនភាព',

  skipToContent: 'រំលងទៅមាតិកា',
  menu: 'ម៉ឺនុយ',
  openMenu: 'បើកម៉ឺនុយ',
  closeMenu: 'បិទម៉ឺនុយ',
  language: 'ភាសា',
  switchToKhmer: 'ប្តូរទៅភាសាខ្មែរ',
  switchToEnglish: 'ប្តូរទៅភាសាអង់គ្លេស',
  breadcrumbLabel: 'ផ្លូវរុករក',
  mainNavLabel: 'ម៉ឺនុយមេ',
  footerNavLabel: 'ម៉ឺនុយបាតទំព័រ',

  readMore: 'អានបន្ថែម',
  learnMore: 'ស្វែងយល់បន្ថែម',
  viewAll: 'មើលទាំងអស់',
  previous: 'មុន',
  next: 'បន្ទាប់',
  download: 'ទាញយក',
  backTo: 'ត្រឡប់ទៅ',
  donateNow: 'បរិច្ចាគឥឡូវនេះ',
  partnerWithUs: 'ក្លាយជាដៃគូ',
  contactUs: 'ទាក់ទងមកយើង',
  seeReports: 'មើលរបាយការណ៍',
  ourPrograms: 'កម្មវិធីរបស់យើង',
  readAsText: 'អានរចនាសម្ព័ន្ធជាអត្ថបទ',
  enlargeImage: 'ពង្រីករូបភាព',
  tapToEnlarge: 'ចុចដើម្បីពង្រីក',

  faqHeading: 'សំណួរដែលសួរញឹកញាប់',
  latestActivities: 'សកម្មភាពថ្មីៗ',
  whatWeDo: 'អ្វីដែលយើងធ្វើ',
  trustedBy: 'ដៃគូរបស់យើង',
  directorMessage: 'សាររបស់នាយកប្រតិបត្តិ',
  orgStructure: 'រចនាសម្ព័ន្ធអង្គការ',
  ourTeam: 'ក្រុមការងាររបស់យើង',
  relatedProgram: 'កម្មវិធីពាក់ព័ន្ធ',
  moreStories: 'អានរឿងរ៉ាវបន្ថែម',
  allActivities: 'សកម្មភាពទាំងអស់',

  pageActivities: 'សកម្មភាព និងព័ត៌មាន',
  pagePrograms: 'ការងាររបស់យើង',
  pageImpact: 'លទ្ធផល និងផលប្រយោជន៍',
  pageReports: 'របាយការណ៍ប្រចាំឆ្នាំ និងហិរញ្ញវត្ថុ',
  pageSafeguarding: 'គោលការណ៍ការពារកុមារ',
  pagePartners: 'ដៃគូ និងអ្នកគាំទ្រ',
  pageDonate: 'បរិច្ចាគ',
  pagePartnerInquiry: 'សំណួរអំពីភាពជាដៃគូ',
  pageVolunteer: 'ស្ម័គ្រចិត្ត',
  pageCareers: 'ការងារ',
  pageContact: 'ទាក់ទងមកយើង',
  pageAbout: 'អំពីយើង',
  pagePrivacy: 'ឯកជនភាព',
  pageFaq: 'សំណួរដែលសួរញឹកញាប់',
  navFaq: 'សំណួរ​ចម្លើយ',

  footerOrganisation: 'អង្គការ',
  footerTransparency: 'តម្លាភាព',
  footerGetInvolved: 'ចូលរួម',
  footerContactHeading: 'ទំនាក់ទំនង',
  allRightsReserved: 'រក្សាសិទ្ធិគ្រប់យ៉ាង។',

  scanToGive: 'ស្កេនដើម្បីបរិច្ចាគ',
  bankTransfer: 'ការផ្ទេរប្រាក់តាមធនាគារ',
  whereMoneyGoes: 'ប្រាក់បរិច្ចាគរបស់អ្នកទៅណា',
  accountName: 'ឈ្មោះគណនី',
  accountNumber: 'លេខគណនី',
  bankName: 'ធនាគារ',
  swift: 'SWIFT / BIC',
  bankAddress: 'អាសយដ្ឋានធនាគារ',
  currency: 'រូបិយប័ណ្ណ',
  copy: 'ចម្លង',
  copied: 'បានចម្លង',
  noCardNotice: 'យើងមិនប្រមូលព័ត៌មានកាតឥណទាននៅលើគេហទំព័រនេះទេ។',

  formName: 'ឈ្មោះរបស់អ្នក',
  formEmail: 'អ៊ីមែល',
  formOrganization: 'អង្គការ',
  formCountry: 'ប្រទេស',
  formPhone: 'លេខទូរស័ព្ទ',
  formSubject: 'ប្រធានបទ',
  formMessage: 'សារ',
  formRequired: 'ចាំបាច់',
  formOptional: 'ស្រេចចិត្ត',
  formSend: 'ផ្ញើសារ',
  formSendInquiry: 'ផ្ញើសំណួរ',
  formSending: 'កំពុងផ្ញើ…',
  formHoneypotLabel: 'សូមទុកប្រអប់នេះឱ្យទទេ',
  errRequired: 'សូមបំពេញប្រអប់នេះ។',
  errEmail: 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលពេញលេញ ឧទាហរណ៍ name@example.org',
  errTooShort: 'សូមសរសេរបន្ថែមទៀត ដើម្បីឱ្យយើងអាចជួយបាន។',
  errTooLong: 'សារវែងពេក។ សូមកាត់បន្ថយ។',
  formSuccessTitle: 'សូមអរគុណ។ សាររបស់អ្នកត្រូវបានផ្ញើ។',
  formSuccessBody: 'អ្វីដែលអ្នកបានវាយបញ្ចូល មិនត្រូវបានរក្សាទុកនៅលើគេហទំព័រនេះទេ។',
  formErrorTitle: 'យើងមិនអាចផ្ញើសារបានទេ។',
  formErrorBody: 'សូមព្យាយាមម្តងទៀត ឬផ្ញើអ៊ីមែលមកយើងដោយផ្ទាល់តាម',
  formVerifyLabel: 'ការត្រួតពិនិត្យសុវត្ថិភាព',

  emptyActivities: 'មិនទាន់មានសកម្មភាពត្រូវបានផ្សព្វផ្សាយនៅឡើយទេ។',
  emptyJobs: 'បច្ចុប្បន្នមិនមានមុខតំណែងទំនេរទេ។',
  emptyReports: 'មិនទាន់មានរបាយការណ៍នៅឡើយទេ។',
  emptyGeneric: 'មិនទាន់មានអ្វីនៅទីនេះទេ។',
  notFoundTitle: 'រកមិនឃើញទំព័រ',
  notFoundBody: 'ទំព័រដែលអ្នកកំពុងស្វែងរក ត្រូវបានផ្លាស់ប្តូរ ឬមិនធ្លាប់មាន។',
  notFoundCta: 'ត្រឡប់ទៅទំព័រដើម',

  homeHeroIntro:
    'អង្គការសមត្ថភាពខ្ញុំ (SKO) ជាអង្គការក្រៅរដ្ឋាភិបាលក្នុងស្រុករបស់កម្ពុជា ដែលធ្វើការគាំទ្រកុមារ គ្រួសារ និងសហគមន៍ងាយរងគ្រោះ ជាពិសេសនៅសហគមន៍ក្រីក្រទីក្រុង និងសហគមន៍ចំណាកស្រុក។',
  introPrograms:
    'គម្រោងបួន វិធីសាស្ត្រតែមួយ៖ កុមារធំធាត់ដោយសុវត្ថិភាព ក្នុងគ្រួសារ និងក្នុងសហគមន៍ខ្លួនឯង។',
  introActivities: 'អ្វីដែលក្រុមការងាររបស់យើងកំពុងធ្វើ ពីខែមួយទៅខែមួយ។',
  introImpact:
    'អ្វីដែលយើងបានធ្វើ របៀបដែលយើងរាប់ និងអ្វីដែលគ្រួសារដែលយើងធ្វើការជាមួយបាននិយាយ។',
  introReports:
    'របាយការណ៍ប្រចាំឆ្នាំ របាយការណ៍ហិរញ្ញវត្ថុដែលបានធ្វើសវនកម្ម និងឯកសារអភិបាលកិច្ចរបស់យើង។',
  introPartners: 'ស្ថាប័ន និងអង្គការដែលយើងធ្វើការជាមួយ។',
  introCareers:
    'មុខតំណែងទំនេរ។ ការដាក់ពាក្យធ្វើតាមអ៊ីមែល។ យើងមិនទទួលឯកសារតាមគេហទំព័រនេះទេ។',
  introContact: 'អាសយដ្ឋានការិយាល័យ លេខទូរស័ព្ទ អ៊ីមែល និងទម្រង់សម្រាប់សំណួរទូទៅ។',
  donateHeroTitle: 'បរិច្ចាគដោយផ្ទាល់ ដោយគ្មានអន្តរការី។',
  donateHeroIntro:
    'ស្កេន QR កូដពីកម្មវិធីធនាគាររបស់អ្នក ឬផ្ទេរប្រាក់ពីបរទេសដោយប្រើព័ត៌មានខាងក្រោម។',
  methodologyTitle: 'របៀបដែលយើងរាប់។',
  methodologyBody:
    'តួលេខទាំងនេះមកពីការត្រួតពិនិត្យគម្រោង និងរបាយការណ៍ដៃគូរបស់ SKO សម្រាប់រយៈពេលនីមួយៗនៃគម្រោង៖ ករណីត្រូវបានគ្រប់គ្រងក្នុងប្រព័ន្ធ OSCaR។',
  ctaHomeTitle: 'ការគាំទ្ររបស់អ្នក រក្សាកុមារឱ្យនៅជាមួយគ្រួសារ។',
  ctaHomeBody:
    'បរិច្ចាគម្តង ឬរៀងរាល់ខែ តាម QR ឬការផ្ទេរតាមធនាគារ។ វាត្រូវបានរាយការណ៍ក្នុងរបាយការណ៍ប្រចាំឆ្នាំ និងសវនកម្មដែលបានផ្សព្វផ្សាយរបស់យើង។',
  ctaAboutTitle: 'គាំទ្រគ្រួសារដែលយើងធ្វើការជាមួយ។',
  ctaAboutBody: 'រាល់ការបរិច្ចាគត្រូវបានរាយការណ៍ក្នុងរបាយការណ៍ប្រចាំឆ្នាំ និងសវនកម្មដែលបានផ្សព្វផ្សាយរបស់យើង។',
  ctaProgramsTitle: 'ឧបត្ថម្ភគម្រោងមួយ។',
  ctaProgramTitle: 'គាំទ្រគម្រោងនេះ។',
  ctaImpactTitle: 'ជួយយើងឱ្យទៅដល់គ្រួសារកាន់តែច្រើន។',
  ctaPartnersTitle: 'ធ្វើការជាមួយយើង។',
  mapPlaceholder: '[STATIC MAP IMAGE → LINKS TO GOOGLE MAPS]',

  fileSizeLabel: 'ទំហំឯកសារ',
  languageEnglish: 'ភាសាអង់គ្លេស',
  languageKhmer: 'ភាសាខ្មែរ',
  closesOn: 'ផុតកំណត់ថ្ងៃទី',
  publishedOn: 'ចុះផ្សាយ',
};

export const ui: Record<Locale, Record<UIKey, string>> = { en, km };
