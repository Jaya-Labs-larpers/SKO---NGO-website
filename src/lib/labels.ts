import type { Locale } from './i18n/config';

/**
 * Labels for CMS enumerations. They live here rather than in the components
 * that render them so a list row and its detail page can never disagree.
 * [KHMER REVIEW REQUIRED] — same status as src/lib/i18n/strings.ts.
 */
type Labels = Record<string, Record<Locale, string>>;

export const activityCategoryLabels: Labels = {
  news: { en: 'News', km: 'ព័ត៌មាន' },
  event: { en: 'Event', km: 'ព្រឹត្តិការណ៍' },
  story: { en: 'Story', km: 'រឿងរ៉ាវ' },
  announcement: { en: 'Announcement', km: 'សេចក្តីជូនដំណឹង' },
};

export const reportTypeLabels: Labels = {
  'annual-report': { en: 'Annual report', km: 'របាយការណ៍ប្រចាំឆ្នាំ' },
  financial: { en: 'Financial', km: 'ហិរញ្ញវត្ថុ' },
  policy: { en: 'Policy', km: 'គោលការណ៍' },
  other: { en: 'Document', km: 'ឯកសារ' },
};

export const partnerCategoryLabels: Labels = {
  'un-agency': { en: 'UN agencies', km: 'ទីភ្នាក់ងារអង្គការសហប្រជាជាតិ' },
  ingo: { en: 'International NGOs', km: 'អង្គការក្រៅរដ្ឋាភិបាលអន្តរជាតិ' },
  government: { en: 'Government', km: 'រដ្ឋាភិបាល' },
  foundation: { en: 'Foundations', km: 'មូលនិធិ' },
  corporate: { en: 'Corporate', km: 'ក្រុមហ៊ុន' },
};

export const employmentTypeLabels: Labels = {
  'full-time': { en: 'Full time', km: 'ពេញម៉ោង' },
  'part-time': { en: 'Part time', km: 'ក្រៅម៉ោង' },
  consultant: { en: 'Consultant', km: 'ទីប្រឹក្សា' },
  internship: { en: 'Internship', km: 'កម្មសិក្សា' },
};

export function label(table: Labels, key: string | null | undefined, lang: Locale): string | null {
  if (!key) return null;
  return table[key]?.[lang] ?? null;
}
