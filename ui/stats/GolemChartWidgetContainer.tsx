import { chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import type { Route } from 'nextjs-routes';

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
  const resolution = interval === 'oneDay' ? 'HOUR' : 'DAY';
  console.log({resolution})

  const { items, lineQuery } = useGolemChartQuery(id, resolution, interval, !isPlaceholderData);

  useEffect(() => {
    if (lineQuery.isError) {
      onLoadingError();
    }
  }, [ lineQuery.isError, onLoadingError ]);

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
    />
  );
};

export default chakra(GolemChartWidgetContainer);
