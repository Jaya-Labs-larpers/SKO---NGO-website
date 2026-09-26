import type { ImpactStat } from './types';

const YEAR = /^(19|20)\d\d$/;

/**
 * Whether a figure rolls up from zero. Staff can switch it off per figure in
 * the Studio; a figure nobody has decided about rolls unless it reads as a
 * year, since a year winding up from zero looks like a clock, not a result.
 */
export function countsUp(stat: ImpactStat): stat is ImpactStat & { value: number } {
  if (typeof stat.value !== 'number' || !Number.isFinite(stat.value)) return false;
  if (typeof stat.countUp === 'boolean') return stat.countUp;
  return !YEAR.test((stat.displayValue ?? String(stat.value)).trim());
}
