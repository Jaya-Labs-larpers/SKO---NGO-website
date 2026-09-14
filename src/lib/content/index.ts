/**
 * The content layer — the single seam between the site and its content source.
 *
 * Pages and components import only from here. They never touch the Sanity
 * client, never write GROQ, and never know whether the content came from the
 * CMS or from local fixtures.
 */

import { sanityClient } from '../sanity/client';
import * as q from '../sanity/queries';
import * as fixtures from './fixtures';
import { isProductionDeployment } from '../config';
import { siteSettingsFailures } from '../../../scripts/readiness.mjs';
import type {
  Activity,
  DirectorMessage,
  ImpactStat,
  JobPost,
  OrgChart,
  Page,
  Partner,
  Program,
  Report,
  SiteSettings,
  Story,
  TeamMember,
} from './types';

async function fetchOr<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!sanityClient) {
    if (isProductionDeployment) throw new Error('[readiness] Sanity is required in production');
    return fallback;
  }
  try {
    const result = await sanityClient.fetch<T>(query, params);
    if (isProductionDeployment && result == null) {
      throw new Error('[readiness] Required published CMS document is missing');
    }
    return (result ?? fallback) as T;
  } catch (error) {
    // Fail the build loudly. A silently empty section discovered in production
    // is far worse than a build that stops here.
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[sko] GROQ query failed — ${message}\nQuery: ${query.slice(0, 120)}…`);
  }
}

/* --- Singletons ------------------------------------------------------------ */

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await fetchOr(q.siteSettingsQuery, {}, fixtures.siteSettings);
  if (isProductionDeployment) {
    const failures = siteSettingsFailures(settings);
    if (failures.length) throw new Error(`[readiness] ${failures.join('; ')}`);
  }
  return settings;
}

export function getDirectorMessage(): Promise<DirectorMessage> {
  return fetchOr(q.directorMessageQuery, {}, fixtures.directorMessage);
}

export function getOrgChart(): Promise<OrgChart> {
  return fetchOr(q.orgChartQuery, {}, fixtures.orgChart);
}

/* --- Pages ----------------------------------------------------------------- */

export async function getPage(slug: string): Promise<Page | null> {
  const fallback = fixtures.pages.find((page) => page.slug === slug) ?? null;
  return fetchOr(q.pageBySlugQuery, { slug }, fallback);
}

/* --- Programs -------------------------------------------------------------- */

export function getPrograms(): Promise<Program[]> {
  return fetchOr(q.programsQuery, {}, fixtures.programs);
}

export async function getProgram(slug: string): Promise<Program | null> {
  const fallback = fixtures.programs.find((program) => program.slug === slug) ?? null;
  return fetchOr(q.programBySlugQuery, { slug }, fallback);
}

/* --- Activities ------------------------------------------------------------ */

export function getActivities(): Promise<Activity[]> {
  return fetchOr(q.activitiesQuery, {}, fixtures.activities);
}

export async function getActivity(slug: string): Promise<Activity | null> {
  const fallback = fixtures.activities.find((activity) => activity.slug === slug) ?? null;
  return fetchOr(q.activityBySlugQuery, { slug }, fallback);
}

export async function getFeaturedActivities(limit = 3): Promise<Activity[]> {
  const all = await getActivities();
  const featured = all.filter((activity) => activity.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

/* --- Everything else ------------------------------------------------------- */

export function getStories(): Promise<Story[]> {
  return fetchOr(q.storiesQuery, {}, fixtures.stories);
}

export function getPartners(): Promise<Partner[]> {
  return fetchOr(q.partnersQuery, {}, fixtures.partners);
}

export function getReports(): Promise<Report[]> {
  return fetchOr(q.reportsQuery, {}, fixtures.reports);
}

export function getTeam(): Promise<TeamMember[]> {
  return fetchOr(q.teamQuery, {}, fixtures.team);
}

export function getImpactStats(): Promise<ImpactStat[]> {
  return fetchOr(q.impactStatsQuery, {}, fixtures.impactStats);
}

/**
 * Open positions only. Expired posts drop out at build time, which is why the
 * nightly rebuild cron exists (docs/04-tech-decisions.md ADR-007).
 */
export function getJobs(): Promise<JobPost[]> {
  const today = new Date().toISOString().slice(0, 10);
  const open = fixtures.jobs.filter((job) => !job.deadline || job.deadline >= today);
  return fetchOr(q.jobsQuery, { today }, open);
}

export async function getJob(slug: string): Promise<JobPost | null> {
  const fallback = fixtures.jobs.find((job) => job.slug === slug) ?? null;
  return fetchOr(q.jobBySlugQuery, { slug }, fallback);
}

export type * from './types';
