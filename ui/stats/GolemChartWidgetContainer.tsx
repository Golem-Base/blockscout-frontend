import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect } from 'react';

import { ChartResolution } from '@golembase/l3-indexer-types';
import type { StatsIntervalIds } from 'types/client/stats';

import type { Route } from 'nextjs-routes';

import formatDataSize from 'lib/formatDataSize';
import type { GolemChartId } from 'ui/shared/chart/useGolemChartQuery';
import useGolemChartQuery from 'ui/shared/chart/useGolemChartQuery';

import ChartWidget from '../shared/chart/ChartWidget';
import AllTimeIntervalNoDataMessage from './AllTimeIntervalNoDataMessage';

type Props = {
  id: GolemChartId;
  title: string;
  description: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
  className?: string;
  href?: Route;
};

const GolemChartWidgetContainer = ({
  id,
  title,
  description,
  interval,
  onLoadingError,
  isPlaceholderData,
  className,
  href,
}: Props) => {
  const resolution: ChartResolution = interval === 'oneDay' ? ChartResolution.HOUR : ChartResolution.DAY;

  const { items, lineQuery } = useGolemChartQuery(id, resolution, interval, !isPlaceholderData);

  const isStorageForecastAllInterval = React.useMemo(() => {
    return interval === 'all' && id === 'storage-forecast';
  }, [ interval, id ]);

  useEffect(() => {
    if (!isStorageForecastAllInterval && lineQuery.isError) {
      onLoadingError();
    }
  }, [ lineQuery.isError, onLoadingError, isStorageForecastAllInterval ]);

  const valueFormatter = useCallback((value: string | number) => {
    const valueFormatterMap: Record<GolemChartId, string> = {
      'data-usage': formatDataSize(value),
      'storage-forecast': formatDataSize(value),
      'operation-count': BigNumber(value).toFormat(),
      'entity-count': BigNumber(value).toFormat(),
    };

    return valueFormatterMap[id];
  }, [ id ]);

  const customStorageForecastAllIntervalNoDataMessage = React.useMemo(() => {
    if (!isStorageForecastAllInterval) return;

    return <AllTimeIntervalNoDataMessage/>;
  }, [ isStorageForecastAllInterval ]);

  return (
    <ChartWidget
      isError={ lineQuery.isError }
      items={ items }
      title={ title }
      description={ description }
      isLoading={ lineQuery.isPlaceholderData }
      minH="230px"
      className={ className }
      href={ href }
      resolution={ resolution }
      valueFormatter={ valueFormatter }
      customNoDataMessage={ customStorageForecastAllIntervalNoDataMessage }
    />
  );
};

export default chakra(GolemChartWidgetContainer);
