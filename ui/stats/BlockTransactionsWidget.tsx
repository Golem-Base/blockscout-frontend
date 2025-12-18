import { Box, Flex } from '@chakra-ui/react';
import React, { useMemo, useRef } from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

import useApiQuery from 'lib/api/useApiQuery';
import { BLOCK_TRANSACTIONS_HISTOGRAM } from 'stubs/stats';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockTransactionsChart from 'ui/shared/chart/BlockTransactionsChart';
import ChartMenu from 'ui/shared/chart/ChartMenu';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import useZoom from 'ui/shared/chart/useZoom';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

type Props = {
  title: string;
  description: string;
};

const baseDate = new Date(0);

const BlockTransactionsWidget = ({ title, description }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { zoomRange, handleZoom, handleZoomReset } = useZoom();

  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:chartBlockTransactions', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: BLOCK_TRANSACTIONS_HISTOGRAM,
    },
  });
  const hasItems = data?.chart && data?.chart.length > 2;

  const chartItems: Array<HistogramItem> = useMemo(() => {
    if (!data?.chart) {
      return [];
    }
    return data.chart.map((item) => ({
      label: item.block_number,
      value: Number(item.tx_count),
    }));
  }, [ data?.chart ]);

  const menuItems: Array<TimeChartItem> = useMemo(() => {
    if (!data?.chart) {
      return [];
    }
    return data.chart.map((item, index) => ({
      date: new Date(baseDate.getTime() + index),
      value: Number(item.tx_count) || 0,
      dateLabel: item.block_number,
    }));
  }, [ data?.chart ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.chart || data.chart.length === 0) {
    return null;
  }

  return (
    <Box
      ref={ chartRef }
      flex={ 1 }
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      padding={{ base: 3, lg: 4 }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Skeleton loading={ isPlaceholderData } fontWeight={ 600 } textStyle="md">
            <span>{ title }</span>
          </Skeleton>

          <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
            <span>{ description }</span>
          </Skeleton>
        </Box>

        { hasItems && (
          <ChartMenu
            blockTransactionsItems={ chartItems }
            items={ menuItems }
            title={ title }
            description={ description }
            isLoading={ isPlaceholderData }
            chartRef={ chartRef }
            handleZoom={ handleZoom }
            handleZoomReset={ handleZoomReset }
            zoomRange={ zoomRange }
          />
        ) }
      </Flex>

      { isPlaceholderData ? (
        <Box h="300px" w="100%"/>
      ) : (
        <BlockTransactionsChart
          items={ chartItems }
        />
      ) }
    </Box>
  );
};

export default BlockTransactionsWidget;
