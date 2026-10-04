const LISTINGS = {
  programs: "program",
  activities: "activity",
  partners: "partner",
  reports: "report",
};

const DETAILS = { programs: "program", activities: "activity" };

/**
 * @typedef {{ _type: string, slug?: string | null, _updatedAt: string }} EditedDocument
 */

/**
 * The date a page's own content last changed. A detail page or a CMS page
 * takes its document's edit; a listing takes the newest document it lists;
 * anything else (home, contact) takes the newest edit in the dataset.
 *
 * @param {string} pathname
 * @param {EditedDocument[]} documents
 * @returns {string | undefined}
 */
export function lastmodFor(pathname, documents) {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment, index) => !(index === 0 && segment === "km"));
  const newest = (/** @type {EditedDocument[]} */ list) =>
    list.map((document) => document._updatedAt).sort().at(-1);
  const [section, slug] = segments;

  if (slug && DETAILS[section]) {
    const own = documents.find(
      (document) => document._type === DETAILS[section] && document.slug === slug,
    );
    if (own) return own._updatedAt;
  }
  if (segments.length === 1 && LISTINGS[section]) {
    const listed = newest(documents.filter((document) => document._type === LISTINGS[section]));
    if (listed) return listed;
  }
  if (segments.length === 1) {
    const page = documents.find(
      (document) => document._type === "page" && document.slug === section,
    );
    if (page) return page._updatedAt;
  }
  return newest(documents);
}

/**
 * Published documents with their last edit, or null when the build reads
 * fixtures (a fixture has no edit date, so its URLs carry no lastmod).
 *
 * @param {Record<string, string | undefined>} env
 * @returns {Promise<EditedDocument[] | null>}
 */
export async function editedDocuments(env) {
  const projectId = env.PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
  const source = env.PUBLIC_CONTENT_SOURCE?.trim() || (projectId ? "sanity" : "fixtures");
  if (source !== "sanity" || !projectId) return null;

  const dataset = env.PUBLIC_SANITY_DATASET?.trim() || "production";
  const apiVersion = env.PUBLIC_SANITY_API_VERSION?.trim() || "2026-01-01";
  const query = `*[!(_type match "sanity.*") && !(_type match "system.*")]{_type, "slug": slug.current, _updatedAt}`;
  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
      `?query=${encodeURIComponent(query)}&perspective=published`,
  );
  if (!response.ok) throw new Error(`[sitemap] Sanity answered ${response.status}`);
  const { result } = await response.json();
  return result;
}
