import React, { useMemo } from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import type { ApiData } from 'lib/metadata';
import type { TimeChartData } from 'toolkit/components/charts';
import { getGolemBaseChartQueryParams } from 'toolkit/components/charts/utils/getGolemBaseChartQueryParams';
import { useChartsConfig } from 'ui/shared/chart/config';

export type GolemChartId = 'data-usage' | 'storage-forecast' | 'operation-count' | 'entity-count';
export type GolemChartQueryResolution = 'HOUR' | 'DAY';

export const golemChartIds: Array<GolemChartId> = [ 'data-usage', 'storage-forecast', 'operation-count', 'entity-count' ];

export const getChartResourceName = (id: GolemChartId) => {
  const resourceMap = {
    'data-usage': 'golemBaseIndexer:chartDataUsage' as const,
    'storage-forecast': 'golemBaseIndexer:chartStorageForecast' as const,
    'operation-count': 'golemBaseIndexer:chartOperationCount' as const,
    'entity-count': 'golemBaseIndexer:chartEntityCount' as const,
  };
  return resourceMap[id];
};

export default function useGolemChartQuery(
  id: GolemChartId,
  resolution: GolemChartQueryResolution,
  interval: StatsIntervalIds,
  enabled = true,
  extendedQueryParams?: Record<string, string>,
) {
  const { apiData } = useAppContext<'/stats/[id]'>();

  const [ info, setInfo ] = React.useState<ApiData<'/stats/[id]'>>(apiData || undefined);

  const queryParams = useMemo(() => getGolemBaseChartQueryParams({ id, interval, resolution }), [ id, interval, resolution ]);

  const resourceName = getChartResourceName(id);

  const lineQuery = useApiQuery(resourceName, {
    queryParams: { ...queryParams, ...extendedQueryParams },
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
      setInfo(lineQuery.data?.info as ApiData<'/stats/[id]'>);
    }
  }, [ info, lineQuery.data?.info, lineQuery.isPlaceholderData ]);

  const chartsConfig = useChartsConfig();

  const items: TimeChartData | undefined = React.useMemo(() => {
    if (!lineQuery.data?.chart || lineQuery.data.chart.length === 0) {
      return undefined;
    }
    return [ {
      id,
      name: id,
      charts: chartsConfig,
      items: lineQuery.data.chart.map((item) => ({
        date: new Date(item.date),
        date_to: new Date(item.date_to),
        value: Number(item.value),
      })),
    } ];
  }, [ chartsConfig, id, lineQuery.data?.chart ]);

  return {
    items,
    info,
    lineQuery,
  };
}
