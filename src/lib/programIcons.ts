/** Program identity icon, reused everywhere a program appears (card, hero). */
export const programIcon: Record<string, string> = {
  'housing-and-living-conditions-hali': 'house',
  'childrens-education-and-health': 'book-heart',
  'childrens-active-citizenship': 'megaphone',
  'resilient-city-and-migration': 'route',
};

export function iconForProgram(slug: string): string {
  return programIcon[slug] ?? 'heart-handshake';
}
