import type * as stats from '@blockscout/stats-types';

export function isChartNameMatches(q: string, chart: stats.LineChartInfo) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}
