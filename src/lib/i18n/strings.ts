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
  navPartnerWithUs: 'Partner with us',
  navVolunteer: 'Volunteer',
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
  pagePartnerInquiry: 'Partner & grant inquiry',
  pageVolunteer: 'Volunteer',
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
  errPhone: 'Enter a valid phone number, for example +855 12 345 678',
  errTooShort: 'Please write a little more so we can help.',
  errTooLong: 'That message is too long. Please shorten it.',
  errRateLimited: 'Too many messages from this connection. Please wait a few minutes and try again.',
  errVerification: 'The security check did not pass. Please try again.',
  errUnavailable: 'The contact form is not available on this preview. Please email us directly at',
  formSuccessTitle: 'Thank you. Your message has been sent.',
  formSuccessBody: 'Nothing you typed is stored on this website.',
  formErrorTitle: "We couldn't send that.",
  formErrorBody: 'Please try again, or email us directly at',
  formVerifyLabel: 'Security check',
  formPanelTitleGeneral: 'Send us a message',
  formToastSent: 'Sent',
  formPanelTitlePartner: 'Start a partnership conversation',
  formPanelTitleVolunteer: 'Offer your time',
  formPanelNoteGeneral: 'We reply to every message. Fields marked * are required.',
  formPanelNotePartner: 'Tell us about your organisation. Fields marked * are required.',
  formPanelNoteVolunteer: 'Tell us what you would like to help with. Fields marked * are required.',
  formPhoneHint: 'Include the country code, for example +855.',
  formPrivacyNote:
    'Nothing you type here is stored on this website. Your message is emailed to SKO and nowhere else.',

  // --- Empty & error states -------------------------------------------------
  emptyActivities: 'No activities have been published yet.',
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
  introContact:
    'Our office address, phone and email, and a form for general enquiries.',
  methodologyTitle: 'How we count.',
  methodologyBody:
    'Figures come from SKO’s project monitoring and partner reports for each project’s period; cases are managed in OSCaR.',
  ctaHomeTitle: 'Talk to us about keeping a child with their family.',
  ctaHomeBody:
    'Tell us what you need and we will answer. Our annual and audit reports are published in full.',
  ctaAboutTitle: 'Questions about how we work?',
  ctaAboutBody: 'Our annual and audit reports are published in full. Ask us anything they do not cover.',
  ctaProgramsTitle: 'Ask about a program.',
  ctaProgramTitle: 'Ask about this program.',
  ctaImpactTitle: 'Ask how we reach more families.',
  ctaPartnersTitle: 'Work with us.',
  viewOnGoogleMaps: 'Open in Google Maps',

  // --- Meta -----------------------------------------------------------------
  fileSizeLabel: 'file size',
  languageEnglish: 'English',
  languageKhmer: 'Khmer',
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
  navPartnerWithUs: 'ក្លាយជាដៃគូ',
  navVolunteer: 'ស្ម័គ្រចិត្ត',
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
  pagePartnerInquiry: 'សំណួរអំពីភាពជាដៃគូ',
  pageVolunteer: 'ស្ម័គ្រចិត្ត',
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
  errPhone: 'សូមបញ្ចូលលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ ឧទាហរណ៍ +855 12 345 678',
  errTooShort: 'សូមសរសេរបន្ថែមទៀត ដើម្បីឱ្យយើងអាចជួយបាន។',
  errTooLong: 'សារវែងពេក។ សូមកាត់បន្ថយ។',
  errRateLimited: 'មានសារច្រើនពេកពីការតភ្ជាប់នេះ។ សូមរង់ចាំពីរបីនាទី រួចព្យាយាមម្តងទៀត។',
  errVerification: 'ការត្រួតពិនិយសុវត្ថិភាពមិនបានជោគជ័យទេ។ សូមព្យាយាមម្តងទៀត។',
  errUnavailable: 'ទម្រង់ទំនាក់ទំនងមិនអាចប្រើបាននៅលើការមើលជាមុននេះទេ។ សូមផ្ញើអ៊ីមែលមកយើងដោយផ្ទាល់តាម',
  formSuccessTitle: 'សូមអរគុណ។ សាររបស់អ្នកត្រូវបានផ្ញើ។',
  formSuccessBody: 'អ្វីដែលអ្នកបានវាយបញ្ចូល មិនត្រូវបានរក្សាទុកនៅលើគេហទំព័រនេះទេ។',
  formErrorTitle: 'យើងមិនអាចផ្ញើសារបានទេ។',
  formErrorBody: 'សូមព្យាយាមម្តងទៀត ឬផ្ញើអ៊ីមែលមកយើងដោយផ្ទាល់តាម',
  formVerifyLabel: 'ការត្រួតពិនិត្យសុវត្ថិភាព',
  formPanelTitleGeneral: 'ផ្ញើសារមកយើង',
  formToastSent: 'បានផ្ញើ',
  formPanelTitlePartner: 'ចាប់ផ្តើមកិច្ចសន្ទនាភាពជាដៃគូ',
  formPanelTitleVolunteer: 'ផ្តល់ពេលវេលារបស់អ្នក',
  formPanelNoteGeneral: 'យើងឆ្លើយតបគ្រប់សារទាំងអស់។ ប្រអប់ដែលមានសញ្ញា * ត្រូវតែបំពេញ។',
  formPanelNotePartner: 'សូមប្រាប់យើងអំពីអង្គការរបស់អ្នក។ ប្រអប់ដែលមានសញ្ញា * ត្រូវតែបំពេញ។',
  formPanelNoteVolunteer:
    'សូមប្រាប់យើងពីអ្វីដែលអ្នកចង់ជួយ។ ប្រអប់ដែលមានសញ្ញា * ត្រូវតែបំពេញ។',
  formPhoneHint: 'សូមបញ្ចូលលេខកូដប្រទេស ឧទាហរណ៍ +855។',
  formPrivacyNote:
    'អ្វីដែលអ្នកវាយបញ្ចូលនៅទីនេះ មិនត្រូវបានរក្សាទុកនៅលើគេហទំព័រនេះទេ។ សាររបស់អ្នកត្រូវបានផ្ញើតាមអ៊ីមែលទៅ SKO តែប៉ុណ្ណោះ។',

  emptyActivities: 'មិនទាន់មានសកម្មភាពត្រូវបានផ្សព្វផ្សាយនៅឡើយទេ។',
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
  introContact: 'អាសយដ្ឋានការិយាល័យ លេខទូរស័ព្ទ អ៊ីមែល និងទម្រង់សម្រាប់សំណួរទូទៅ។',
  methodologyTitle: 'របៀបដែលយើងរាប់។',
  methodologyBody:
    'តួលេខទាំងនេះមកពីការត្រួតពិនិត្យគម្រោង និងរបាយការណ៍ដៃគូរបស់ SKO សម្រាប់រយៈពេលនីមួយៗនៃគម្រោង៖ ករណីត្រូវបានគ្រប់គ្រងក្នុងប្រព័ន្ធ OSCaR។',
  ctaHomeTitle: 'ទាក់ទងមកយើង អំពីការរក្សាកុមារឱ្យនៅជាមួយគ្រួសារ។',
  ctaHomeBody:
    'ប្រាប់យើងពីអ្វីដែលអ្នកត្រូវការ យើងនឹងឆ្លើយតប។ របាយការណ៍ប្រចាំឆ្នាំ និងសវនកម្មរបស់យើងត្រូវបានផ្សព្វផ្សាយពេញលេញ។',
  ctaAboutTitle: 'មានសំណួរអំពីរបៀបដែលយើងធ្វើការមែនទេ?',
  ctaAboutBody: 'របាយការណ៍ប្រចាំឆ្នាំ និងសវនកម្មរបស់យើងត្រូវបានផ្សព្វផ្សាយពេញលេញ។ សូមសួរយើងអំពីអ្វីដែលមិនមានក្នុងនោះ។',
  ctaProgramsTitle: 'សួរអំពីគម្រោងមួយ។',
  ctaProgramTitle: 'សួរអំពីគម្រោងនេះ។',
  ctaImpactTitle: 'សួរពីរបៀបដែលយើងទៅដល់គ្រួសារកាន់តែច្រើន។',
  ctaPartnersTitle: 'ធ្វើការជាមួយយើង។',
  viewOnGoogleMaps: 'បើកក្នុង Google Maps',

  fileSizeLabel: 'ទំហំឯកសារ',
  languageEnglish: 'ភាសាអង់គ្លេស',
  languageKhmer: 'ភាសាខ្មែរ',
  publishedOn: 'ចុះផ្សាយ',
};

export const ui: Record<Locale, Record<UIKey, string>> = { en, km };
