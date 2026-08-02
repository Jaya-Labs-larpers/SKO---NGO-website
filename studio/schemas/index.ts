import { localeBlock, localeString, localeText } from './locale';
import {
  allocationItem,
  bankAccount,
  callout,
  donationQr,
  imageWithAlt,
  seo,
  socialLink,
} from './objects';
import {
  activity,
  directorMessage,
  impactStat,
  jobPost,
  orgChart,
  page,
  partner,
  program,
  report,
  siteSettings,
  story,
  teamMember,
} from './documents';

export const schemaTypes = [
  // Localisation primitives
  localeString,
  localeText,
  localeBlock,

  // Reusable objects
  imageWithAlt,
  callout,
  seo,
  socialLink,
  bankAccount,
  donationQr,
  allocationItem,

  // Documents
  siteSettings,
  page,
  program,
  activity,
  story,
  partner,
  report,
  teamMember,
  directorMessage,
  orgChart,
  jobPost,
  impactStat,
];
