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

type Props = {
  id: GolemChartId;
  title: string;
  description: string;
  units?: string;
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
  units,
  isPlaceholderData,
  className,
  href,
}: Props) => {
  const resolution: ChartResolution = interval === 'oneDay' ? ChartResolution.HOUR : ChartResolution.DAY;

  const { items, lineQuery } = useGolemChartQuery(id, resolution, interval, !isPlaceholderData);

  useEffect(() => {
    if (lineQuery.isError) {
      onLoadingError();
    }
  }, [ lineQuery.isError, onLoadingError ]);

  const valueFormatter = useCallback((value: string | number) => {
    const valueFormatterMap: Record<GolemChartId, string> = {
      'data-usage': formatDataSize(value),
      'storage-forecast': formatDataSize(value),
      'operation-count': BigNumber(value).toFormat(),
      'entity-count': BigNumber(value).toFormat(),
    };

    return valueFormatterMap[id];
  }, [ id ]);

  return (
    <ChartWidget
      isError={ lineQuery.isError }
      items={ items }
      title={ title }
      units={ units }
      description={ description }
      isLoading={ lineQuery.isPlaceholderData }
      minH="230px"
      className={ className }
      href={ href }
      resolution={ resolution }
      valueFormatter={ valueFormatter }
    />
  );
};

export default chakra(GolemChartWidgetContainer);
