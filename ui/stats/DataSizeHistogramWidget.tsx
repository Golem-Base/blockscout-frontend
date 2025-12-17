import { Box, Flex } from '@chakra-ui/react';
import React, { useMemo, useRef } from 'react';

import type { EntityDataHistogram } from '@golembase/l3-indexer-types';

import useApiQuery from 'lib/api/useApiQuery';
import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ChartMenu from 'ui/shared/chart/ChartMenu';
import HistogramChart from 'ui/shared/chart/HistogramChart';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import useZoom from 'ui/shared/chart/useZoom';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const DataSizeHistogramWidget = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { zoomRange, handleZoom, handleZoomReset } = useZoom();

  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:entityDataHistogram', {
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const hasItems = data?.items && data.items.length > 0;

  const chartItems: Array<HistogramItem> = useMemo(() => {
    if (!data?.items) {
      return [];
    }
    return data.items.map((item: EntityDataHistogram) => ({
      label: `${ formatDataSize(BigInt(item.bin_start), true, 0) }–${ formatDataSize(BigInt(item.bin_end), true, 0) }`,
      value: Number(item.count),
    }));
  }, [ data?.items ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.items || data.items.length === 0) {
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
      <Flex mb={ 3 } justifyContent="space-between" alignItems="center">
        <Box>
          <Skeleton loading={ isPlaceholderData } fontWeight={ 600 } textStyle="md">
            <span>Entity data size distribution</span>
          </Skeleton>

          <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
            <span>Entity count by data size range</span>
          </Skeleton>
        </Box>

        { hasItems && (
          <ChartMenu
            dataSizeHistogramItems={ chartItems }
            title="Entity data size distribution"
            description="Entity count by data size range"
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
        <HistogramChart items={ chartItems }/>
      ) }
    </Box>
  );
};

export default DataSizeHistogramWidget;
