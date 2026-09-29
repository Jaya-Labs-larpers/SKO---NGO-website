import { siteUrl } from '../config';

const context = 'https://schema.org';
const organization = { '@id': `${siteUrl}/#organization` };

interface ServiceProfile {
  serviceType: string[];
  areaServed?: string;
  audience?: string;
  funder?: string;
}

const serviceProfiles: Record<string, ServiceProfile> = {
  'housing-and-living-conditions-hali': {
    serviceType: [
      'Family counselling',
      'Gender-based violence prevention training',
      'Referral to social services',
    ],
    audience: 'Vulnerable families in urban poor communities',
  },
  'childrens-active-citizenship': {
    serviceType: [
      'Child protection training',
      'Mobile library',
      'School materials distribution',
      'Medical check-ups',
    ],
    audience: 'Vulnerable children and their families',
  },
  'childrens-education-and-health': {
    serviceType: [
      'Family development (FDP)',
      "Children's Clubs",
      'Mobile library',
      'School Support Committee',
      'Medical check-ups',
    ],
    areaServed: 'Khan Dangkor, Phnom Penh',
  },
  'resilient-city-and-migration': {
    serviceType: [
      'Safe migration and public services',
      'Legal documentation support',
      'Counselling and referral',
      'Financial literacy',
      'GBV training',
    ],
    funder: 'Swiss Agency for Development and Cooperation',
  },
};

export const canonicalUrl = (pathname: string) => new URL(pathname, siteUrl).href;

export function serviceJsonLd(input: {
  slug: string;
  pathname: string;
  name: string;
  description?: string;
}): Record<string, unknown> | null {
  const profile = serviceProfiles[input.slug];
  if (!profile) return null;
  return {
    '@context': context,
    '@type': 'Service',
    '@id': `${canonicalUrl(input.pathname)}#service`,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    provider: organization,
    areaServed: profile.areaServed
      ? { '@type': 'AdministrativeArea', name: profile.areaServed }
      : { '@type': 'City', name: 'Phnom Penh' },
    serviceType: profile.serviceType,
    ...(profile.audience
      ? { audience: { '@type': 'Audience', audienceType: profile.audience } }
      : {}),
    ...(profile.funder
      ? { funder: { '@type': 'GovernmentOrganization', name: profile.funder } }
      : {}),
  };
}

export function aboutPageJsonLd(input: {
  pathname: string;
  name: string;
  description?: string;
}): Record<string, unknown> {
  return {
    '@context': context,
    '@type': 'AboutPage',
    '@id': `${canonicalUrl(input.pathname)}#webpage`,
    url: canonicalUrl(input.pathname),
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    mainEntity: organization,
  };
}

export function contactPageJsonLd(input: {
  pathname: string;
  name: string;
  description?: string;
}): Record<string, unknown> {
  return {
    '@context': context,
    '@type': 'ContactPage',
    '@id': `${canonicalUrl(input.pathname)}#webpage`,
    url: canonicalUrl(input.pathname),
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    mainEntity: organization,
  };
}

export const officeOpeningHours = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '08:00',
  closes: '17:00',
};

export function collectionPageJsonLd(input: {
  pathname: string;
  name: string;
  description?: string;
  items?: { name: string; url: string }[];
  parts?: { name: string; url: string }[];
}): Record<string, unknown> {
  return {
    '@context': context,
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl(input.pathname)}#webpage`,
    url: canonicalUrl(input.pathname),
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.items && input.items.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: input.items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }
      : {}),
    ...(input.parts && input.parts.length > 0
      ? {
          hasPart: input.parts.map((part) => ({
            '@type': 'Article',
            headline: part.name,
            url: part.url,
          })),
        }
      : {}),
  };
}

export function partnersJsonLd(input: {
  name: string;
  partners: { name: string; url?: string | null }[];
}): Record<string, unknown> {
  return {
    '@context': context,
    '@type': 'ItemList',
    name: input.name,
    itemListElement: input.partners.map((partner, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: partner.name,
        ...(partner.url ? { url: partner.url } : {}),
      },
    })),
  };
}
