import { sumBy } from 'es-toolkit/compat';

import type { TChainIndicator } from '../types';
import type * as stats from '@blockscout/stats-types';
import type { HomeStats } from 'types/api/stats';
import type { TimeChartData } from 'ui/shared/chart/types';

import formatDataSize from 'lib/formatDataSize';

export default function getIndicatorValues(
  indicator: TChainIndicator,
  statsData?: stats.MainPageStats,
  statsApiData?: HomeStats,
  dataUsageData?: TimeChartData,
  operationTrendsData?: TimeChartData,
) {
  const dataUsageItems = dataUsageData?.[0].items;
  const operationTrendsItems = operationTrendsData?.[0].items;

  const extendedStatsData = {
    monthly_data_usage: dataUsageItems ? sumBy(dataUsageItems, ({ value }) => Number(value)) : null,
    monthly_operation_trends: operationTrendsItems ? sumBy(operationTrendsItems, ({ value }) => Number(value)) : null,
  };

  const value = (() => {
    // Use extendedStatsData for data_usage and operation_trends indicators when available
    if (indicator.id === 'data_usage' && typeof extendedStatsData.monthly_data_usage === 'number') {
      return formatDataSize(extendedStatsData.monthly_data_usage);
    }
    if (indicator.id === 'operation_trends' && typeof extendedStatsData.monthly_operation_trends === 'number') {
      return Number(extendedStatsData.monthly_operation_trends).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' });
    }
    return indicator.value || 'N/A';
  })();

  // we have diffs only for coin and second coin price charts that get data from stats api
  // so we don't check microservice data here, but may require to add it in the future
  const valueDiff = indicator.valueDiff;

  return {
    value,
    valueDiff,
  };
}
