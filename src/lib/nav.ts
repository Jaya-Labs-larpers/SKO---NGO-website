import type { UIKey } from './i18n/strings';

export interface NavItem {
  key: UIKey;
  path: string;
  children?: NavItem[];
}

/** Header navigation. Order is deliberate: identity, then evidence, then action. */
export const mainNav: NavItem[] = [
  { key: 'navAbout', path: '/about' },
  { key: 'navWork', path: '/programs' },
  { key: 'navImpact', path: '/impact' },
  { key: 'navActivities', path: '/activities' },
  {
    key: 'navGetInvolved',
    path: '/contact',
    children: [
      { key: 'navContact', path: '/contact' },
      { key: 'navPartnerWithUs', path: '/partner-with-us' },
      { key: 'navVolunteer', path: '/volunteer' },
    ],
  },
];

export const footerNav: { heading: UIKey; items: NavItem[] }[] = [
  {
    heading: 'footerOrganisation',
    items: [
      { key: 'navAbout', path: '/about' },
      { key: 'navWork', path: '/programs' },
      { key: 'navImpact', path: '/impact' },
      { key: 'navFaq', path: '/faq' },
      { key: 'navContact', path: '/contact' },
    ],
  },
  {
    heading: 'footerTransparency',
    items: [
      { key: 'navReports', path: '/reports' },
      { key: 'navSafeguarding', path: '/safeguarding' },
      { key: 'navPartners', path: '/partners' },
      { key: 'navPrivacy', path: '/privacy' },
    ],
  },
  {
    heading: 'footerGetInvolved',
    items: [
      { key: 'navPartnerWithUs', path: '/partner-with-us' },
      { key: 'navVolunteer', path: '/volunteer' },
    ],
  },
];

/** Flattened list used by the mobile panel, where nesting adds nothing. */
export const mobileNav: NavItem[] = [
  { key: 'navAbout', path: '/about' },
  { key: 'navWork', path: '/programs' },
  { key: 'navImpact', path: '/impact' },
  { key: 'navActivities', path: '/activities' },
  { key: 'navReports', path: '/reports' },
  { key: 'navSafeguarding', path: '/safeguarding' },
  { key: 'navPartners', path: '/partners' },
  { key: 'navFaq', path: '/faq' },
  { key: 'navContact', path: '/contact' },
];
