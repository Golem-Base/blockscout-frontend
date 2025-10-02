import React from 'react';

import type { ChartResponse } from '@golembase/l3-indexer-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import dayjs from 'lib/date/dayjs';
import { STATS_INTERVALS } from 'ui/stats/constants';

export type GolemChartId = 'data-usage';

export default function useGolemChartQuery(id: GolemChartId, resolution: 'HOUR' | 'DAY', interval: StatsIntervalIds, enabled = true) {
  const { apiData } = useAppContext<'/stats/[id]'>();

  const selectedInterval = STATS_INTERVALS[interval];

  const dateFormatByResolution = resolution === 'HOUR' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
  const endDate = selectedInterval.start ? dayjs().format(dateFormatByResolution) : undefined;
  const startDate = selectedInterval.start ? dayjs(selectedInterval.start).format(dateFormatByResolution) : undefined;

  const [ info, setInfo ] = React.useState<ChartResponse['info']>(apiData || undefined);

  const lineQuery = useApiQuery('golemBaseIndexer:chart', {
    pathParams: { id },
    queryParams: {
      from: startDate,
      to: endDate,
      resolution,
    },
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
