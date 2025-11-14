import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { BLOCK_TRANSACTIONS_HISTOGRAM } from 'stubs/stats';
import { Skeleton } from 'toolkit/chakra/skeleton';
import HistogramBlockTransactionsChart from 'ui/shared/chart/HistogramBlockTransactionsChart';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

type Props = {
  title: string;
  description: string;
};

const BlockTransactionsHistogramWidget = ({ title, description }: Props) => {
  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:chartBlockTransactions', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: BLOCK_TRANSACTIONS_HISTOGRAM,
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.chart || data.chart.length === 0) {
    return null;
  }

  const chartItems: Array<HistogramItem> = data.chart.map((item) => ({
    label: item.block_number,
    value: Number(item.tx_count),
  }));

  return (
    <Box
      flex={ 1 }
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      padding={{ base: 3, lg: 4 }}
    >
      <Box>
        <Skeleton loading={ isPlaceholderData } fontWeight={ 600 } textStyle="md">
          <span>{ title }</span>
        </Skeleton>

        <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
          <span>{ description }</span>
        </Skeleton>
      </Box>

      { isPlaceholderData ? (
        <Box h="300px" w="100%"/>
      ) : (
        <HistogramBlockTransactionsChart
          items={ chartItems }
        />
      ) }
    </Box>
  );
};

export default BlockTransactionsHistogramWidget;
