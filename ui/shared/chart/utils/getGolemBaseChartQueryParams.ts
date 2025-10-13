import { OperationTypeFilter_OperationTypeFilter as OperationTypeFilter } from '@golembase/l3-indexer-types';
import type { StatsIntervalIds } from 'types/client/stats';

import dayjs from 'lib/date/dayjs';
import { STATS_INTERVALS } from 'ui/stats/constants';

import type { GolemChartId, GolemChartQueryResolution } from '../useGolemChartQuery';

interface GetGolemBaseChartQueryParamsAttributes {
  id: GolemChartId;
  resolution: GolemChartQueryResolution;
  interval: StatsIntervalIds;
}

const futureDataChartIds: Array<GolemChartId> = [ 'storage-forecast' ];

const futureDataQueryDateTo: Record<StatsIntervalIds, dayjs.Dayjs | undefined> = {
  all: undefined,
  oneDay: dayjs().add(1, 'days'),
  oneMonth: dayjs().add(1, 'months'),
  threeMonths: dayjs().add(3, 'months'),
  sixMonths: dayjs().add(6, 'months'),
  oneYear: dayjs().add(1, 'years'),
};

const restQueryParamsById: Record<GolemChartId, Record<string, string>> = {
  'data-usage': {},
  'storage-forecast': {},
  'operation-count': {
    operation: OperationTypeFilter.ALL,
  },
};

export function getGolemBaseChartQueryParams({ id, interval, resolution }: GetGolemBaseChartQueryParamsAttributes) {
  const selectedInterval = STATS_INTERVALS[interval];

  const dateFormatByResolution = resolution === 'HOUR' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';

  const endDate = selectedInterval.start ? dayjs().format(dateFormatByResolution) : undefined;
  const startDate = selectedInterval.start ? dayjs(selectedInterval.start).format(dateFormatByResolution) : undefined;

  const chartQueryType = futureDataChartIds.includes(id) ? 'future-data' : 'default-data';

  const queryParamsByChartQueryType = {
    'future-data': {
      to: futureDataQueryDateTo[interval]?.format(dateFormatByResolution),
      resolution,
    },
    'default-data': {
      from: startDate,
      to: endDate,
      resolution,
    },
  };

  return { ...queryParamsByChartQueryType[chartQueryType], ...restQueryParamsById[id] };
}
