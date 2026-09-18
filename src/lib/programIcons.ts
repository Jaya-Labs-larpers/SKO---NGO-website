/** Program identity icon, reused everywhere a program appears (card, hero). */
export const programIcon: Record<string, string> = {
  'housing-and-living-conditions-hali': 'home',
  'childrens-education-and-health': 'book-open',
  'childrens-active-citizenship': 'megaphone',
  'resilient-city-and-migration': 'map',
};

export function iconForProgram(slug: string): string {
  return programIcon[slug] ?? 'sko-fdp-cycle';
}
