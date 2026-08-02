export const locales = ['en', 'km'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Label shown on the language toggle. Khmer is always written in Khmer script. */
export const localeShort: Record<Locale, string> = { en: 'EN', km: 'ខ្មែរ' };
export const localeName: Record<Locale, string> = { en: 'English', km: 'ភាសាខ្មែរ' };

/** BCP-47 tags for <html lang>, hreflang and Open Graph. */
export const htmlLang: Record<Locale, string> = { en: 'en', km: 'km' };
export const ogLocale: Record<Locale, string> = { en: 'en_US', km: 'km_KH' };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
