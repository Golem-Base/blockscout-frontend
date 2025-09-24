import { chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import type { Route } from 'nextjs-routes';

import useGolemChartQuery from 'ui/shared/chart/useGolemChartQuery';

import ChartWidget from '../shared/chart/ChartWidget';

type Props = {
  id: string;
  title: string;
  description: string;
  units?: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
  className?: string;
  href?: Route;
};

const testDates = [
  '2025-08-24T03:00:00.000Z',
  '2025-08-24T04:00:00.000Z',
  '2025-08-24T05:00:00.000Z',
  '2025-08-24T06:00:00.000Z',
  '2025-08-24T07:00:00.000Z',
  '2025-08-24T08:00:00.000Z',
  '2025-08-24T09:00:00.000Z',
  '2025-08-24T10:00:00.000Z',
];

const items: Array<{
  date: Date;
  date_to: Date;
  value: number;
}> = testDates.map((jsonDate) => {
  const date = new Date(jsonDate);

  return {
    date,
    date_to: date,
    value: Math.floor(Math.random() * 100),
  };
}).sort((a, b) => a.date.getTime() - b.date.getTime());

const ChartWidgetContainer = ({
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
  // const { items, lineQuery } = useGolemChartQuery(id, Resolution.DAY, interval, !isPlaceholderData);

  // useEffect(() => {
  //   if (lineQuery.isError) {
  //     onLoadingError();
  //   }
  // }, [ lineQuery.isError, onLoadingError ]);

 console.log('GolemChartWidgetContainer', interval)

  return (
    <ChartWidget
      // isError={ lineQuery.isError }
      isError={ false }
      items={ items }
      title={ title }
      units={ units }
      description={ description }
      // isLoading={ lineQuery.isPlaceholderData }
      isLoading={ false }
      minH="230px"
      className={ className }
      href={ href }
      resolution={ interval === 'oneDay' ? Resolution.HOUR : Resolution.DAY }
    />
  );
};

export default chakra(ChartWidgetContainer);
