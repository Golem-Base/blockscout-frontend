import { Box } from '@chakra-ui/react';
import React from 'react';

import type { EntityDataHistogram } from '@golembase/l3-indexer-types';

import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import HistogramChart from 'ui/shared/chart/HistogramChart';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const DataSizeHistogramWidget = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:entityDataHistogram', {
    queryOptions: {
      refetchOnMount: false,
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const chartItems: Array<HistogramItem> = data.items.map((item: EntityDataHistogram) => ({
    label: `${ formatDataSize(BigInt(item.bin_start), true, 0) }–${ formatDataSize(BigInt(item.bin_end), true, 0) }`,
    value: Number(item.count),
  }));

  return (
    <Box
      flex={ 1 }
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      padding={{ base: 3, lg: 4 }}
    >
      <Box mb={ 3 }>
        <Skeleton loading={ isPlaceholderData } fontWeight={ 600 } textStyle="md">
          <span>Entity data size distribution</span>
        </Skeleton>

        <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
          <span>Entity count by data size range</span>
        </Skeleton>
      </Box>

      { isPlaceholderData ? (
        <Box h="300px" w="100%"/>
      ) : (
        <HistogramChart items={ chartItems }/>
      ) }
    </Box>
  );
};

export default DataSizeHistogramWidget;
