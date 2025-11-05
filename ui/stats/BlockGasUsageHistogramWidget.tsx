import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { BLOCK_GAS_USAGE_HISTOGRAM } from 'stubs/stats';
import { Skeleton } from 'toolkit/chakra/skeleton';
import HistogramBlockGasUsedChart from 'ui/shared/chart/HistogramBlockGasUsedChart';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const BlockGasUsageHistogramWidget = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:chartBlockGasUsage', {
    queryParams: {
      limit: 30,
    },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: BLOCK_GAS_USAGE_HISTOGRAM,
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
    value: Number(item.gas_used),
    ...item,
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
          <span>Gas usage per block</span>
        </Skeleton>

        <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
          <span>Recent blocks gas consumption per block</span>
        </Skeleton>
      </Box>

      { isPlaceholderData ? (
        <Box h="300px" w="100%"/>
      ) : (
        <HistogramBlockGasUsedChart items={ chartItems }/>
      ) }
    </Box>
  );
};

export default BlockGasUsageHistogramWidget;
