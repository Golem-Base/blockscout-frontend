import { sumBy } from 'es-toolkit/compat';

import type { TChainIndicator } from '../types';
import type * as stats from '@blockscout/stats-types';
import type { HomeStats } from 'types/api/stats';
import type { TimeChartData } from 'ui/shared/chart/types';

import config from 'configs/app';

export default function getIndicatorValues(
  indicator: TChainIndicator,
  statsData?: stats.MainPageStats,
  statsApiData?: HomeStats,
  dataUsageData?: TimeChartData,
) {
  const dataUsageItems = dataUsageData?.[0].items;

  const extendedStatsData = {
    data_usage_today: dataUsageItems ? sumBy(dataUsageItems, ({ value }) => Number(value)) : null,
  };

  const value = (() => {
    if (config.features.stats.isEnabled && indicator?.valueMicroservice && statsData) {
      return indicator.valueMicroservice({ ...statsData, ...extendedStatsData });
    }

    if (statsApiData) {
      return indicator?.value({ ...statsApiData, ...extendedStatsData });
    }

    return 'N/A';
  })();

  // we have diffs only for coin and second coin price charts that get data from stats api
  // so we don't check microservice data here, but may require to add it in the future
  const valueDiff = indicator?.valueDiff ? indicator.valueDiff(statsApiData) : undefined;

  return {
    value,
    valueDiff,
  };
}
