import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'toolkit/components/charts/types';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ChainIndicatorChartContent from './ChainIndicatorChartContent';
import SimpleChartContent from './SimpleChartContent';

type Props = {
  data: TimeChartData;
  isError: boolean;
  isPending: boolean;
};

const ChainIndicatorChartContainer = ({ data, isError, isPending }: Props) => {

  if (isPending) {
    return <ContentLoader mt="auto" fontSize="xs"/>;
  }

  if (isError) {
    return <DataFetchAlert fontSize="xs"/>;
  }

  if (data[0].items.length === 0) {
    return <chakra.span fontSize="xs">no data</chakra.span>;
  }

  const firstItem = data[0].items[0];
  const isSimpleChart = ('x' in firstItem && 'y' in firstItem);

  if (isSimpleChart) {
    return <SimpleChartContent data={ data as unknown as [{ items: Array<{ x: number; y: number }> }] }/>;
  }

  return <ChainIndicatorChartContent data={ data }/>;
};

export default React.memo(ChainIndicatorChartContainer);
