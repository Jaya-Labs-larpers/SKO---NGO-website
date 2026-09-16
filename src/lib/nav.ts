import type { UIKey } from './i18n/strings';

export interface NavItem {
  key: UIKey;
  path: string;
  children?: NavItem[];
}

/**
 * Header navigation, grouped: work, then evidence, then the organisation,
 * then news. Support is the header's action, not a group. Every route keeps
 * its existing URL; only the grouping changed.
 */
export const mainNav: NavItem[] = [
  {
    key: 'navWork',
    path: '/programs',
    children: [
      { key: 'navPrograms', path: '/programs' },
      { key: 'navImpact', path: '/impact' },
    ],
  },
  {
    key: 'navEvidence',
    path: '/reports',
    children: [
      { key: 'navReports', path: '/reports' },
      { key: 'navSafeguarding', path: '/safeguarding' },
      { key: 'navPartners', path: '/partners' },
    ],
  },
  {
    key: 'navAbout',
    path: '/about',
    children: [
      { key: 'navAbout', path: '/about' },
      { key: 'navCareers', path: '/careers' },
    ],
  },
  { key: 'navNews', path: '/activities' },
];

export const supportNav: NavItem = {
  key: 'navSupport',
  path: '/donate',
  children: [
    { key: 'navDonate', path: '/donate' },
    { key: 'navPartnerWithUs', path: '/partner-with-us' },
    { key: 'navVolunteer', path: '/volunteer' },
  ],
};

export const footerNav: { heading: UIKey; items: NavItem[] }[] = [
  {
    heading: 'navWork',
    items: [
      { key: 'navPrograms', path: '/programs' },
      { key: 'navImpact', path: '/impact' },
      { key: 'navActivities', path: '/activities' },
    ],
  },
  {
    heading: 'navEvidence',
    items: [
      { key: 'navReports', path: '/reports' },
      { key: 'navSafeguarding', path: '/safeguarding' },
      { key: 'navPartners', path: '/partners' },
      { key: 'navPrivacy', path: '/privacy' },
    ],
  },
  {
    heading: 'footerOrganisation',
    items: [
      { key: 'navAbout', path: '/about' },
      { key: 'navCareers', path: '/careers' },
      { key: 'navFaq', path: '/faq' },
      { key: 'navContact', path: '/contact' },
    ],
  },
  {
    heading: 'navSupport',
    items: [
      { key: 'navDonate', path: '/donate' },
      { key: 'navPartnerWithUs', path: '/partner-with-us' },
      { key: 'navVolunteer', path: '/volunteer' },
    ],
  },
];

/** The mobile panel shows the same groups, flattened into headed lists. */
export const mobileNav: NavItem[] = [...mainNav, supportNav];
