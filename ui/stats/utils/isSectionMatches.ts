import type * as stats from '@blockscout/stats-types';

export function isSectionMatches(section: stats.LineChartSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}
