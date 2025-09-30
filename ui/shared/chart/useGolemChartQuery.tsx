import React, { useMemo } from 'react';

import type { ChartDataUsageResponse } from '@golembase/l3-indexer-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';

import { getGolemBaseChartQueryParams } from './utils/getGolemBaseChartQueryParams';

export type GolemChartId = 'data-usage' | 'storage-forecast';
export type GolemChartQueryResolution = 'HOUR' | 'DAY';

export const golemChartIds: Array<GolemChartId> = [ 'data-usage', 'storage-forecast' ];

export default function useGolemChartQuery(id: GolemChartId, resolution: GolemChartQueryResolution, interval: StatsIntervalIds, enabled = true) {
  const { apiData } = useAppContext<'/stats/[id]'>();

  const [ info, setInfo ] = React.useState<ChartDataUsageResponse['info']>(apiData || undefined);

  const queryParams = useMemo(() => getGolemBaseChartQueryParams({ id, interval, resolution }), [ id, interval, resolution ]);

  const lineQuery = useApiQuery('golemBaseIndexer:chart', {
    pathParams: { id },
    queryParams,
    queryOptions: {
      enabled: enabled,
      refetchOnMount: false,
      placeholderData: {
        info: {
          id: 'placeholder',
          title: 'Chart title placeholder',
          description: 'Chart placeholder description chart placeholder description',
        },
        chart: [],
      },
    },
  });

  React.useEffect(() => {
    if (!info && lineQuery.data?.info && !lineQuery.isPlaceholderData) {
      // save info to keep title and description when change query params
      setInfo(lineQuery.data?.info);
    }
  }, [ info, lineQuery.data?.info, lineQuery.isPlaceholderData ]);

  const items = React.useMemo(() => lineQuery.data?.chart?.map((item) => {
    return { date: new Date(item.date), date_to: new Date(item.date_to), value: Number(item.value) };
  }), [ lineQuery ]);

  return {
    items,
    info,
    lineQuery,
  };
}
