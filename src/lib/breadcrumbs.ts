/**
 * Lives in a .ts module rather than in Breadcrumbs.astro because Astro
 * components cannot export types for other modules to import.
 */
export interface Crumb {
  label: string;
  /** Locale-free path, e.g. "/activities". Omit for the current page. */
  path?: string;
}
