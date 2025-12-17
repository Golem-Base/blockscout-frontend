import { Box, createListCollection, Flex } from '@chakra-ui/react';
import { sum, pick } from 'es-toolkit/compat';
import React, { useMemo, useRef } from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { BLOCK_OPERATIONS_HISTOGRAM } from 'stubs/stats';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { Item } from 'ui/shared/chart/BlockOperationsChart';
import BlockOperationsChart from 'ui/shared/chart/BlockOperationsChart';
import type { OperationTypeCount } from 'ui/shared/chart/BlockOperationsChartBar';
import ChartMenu from 'ui/shared/chart/ChartMenu';
import useZoom from 'ui/shared/chart/useZoom';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const BlockOperationsHistogramWidget = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { zoomRange, handleZoom, handleZoomReset } = useZoom();
  const [ selectedOperations, setSelectedOperations ] = React.useState([ 'create', 'update', 'extend', 'delete', 'changeowner' ]);

  const handleOperationChange = React.useCallback((e: { value: Array<string> }) => {
    setSelectedOperations(e.value);
  }, []);

  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:chartBlockOperations', {
    queryParams: {
      limit: 150,
    },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: BLOCK_OPERATIONS_HISTOGRAM,
    },
  });

  const chartItems: Array<Item> = useMemo(() => {
    if (!data?.chart) {
      return [];
    }
    return data.chart.map((item) => ({
      label: item.block_number,
      value: sum(Object.values(pick(item, [ 'create_count', 'update_count', 'extend_count', 'delete_count', 'changeowner_count' ])).map(Number)),
      ...item,
    }));
  }, [ data?.chart ]);

  const visibleOperations = selectedOperations.map(operation => `${ operation }_count` as OperationTypeCount);
  const hasItems = chartItems.length > 2;

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.chart || data.chart.length === 0) {
    return null;
  }
  const visibleOperationsOptions = createListCollection({
    items: [
      { label: 'Create', value: 'create' },
      { label: 'Update', value: 'update' },
      { label: 'Extend', value: 'extend' },
      { label: 'Delete', value: 'delete' },
      { label: 'Change Owner', value: 'changeowner' },
    ],
  });

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
            <span>Block operations</span>
          </Skeleton>

          <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
            <span>Block operations in the last 150 blocks</span>
          </Skeleton>
        </Box>

        <Flex gap={ 2 } alignItems="center">
          <Select
            collection={ visibleOperationsOptions }
            placeholder="Select operations"
            size="sm"
            w="200px"
            multiple
            value={ selectedOperations }
            onValueChange={ handleOperationChange }
          />

          { hasItems && (
            <ChartMenu
              blockOperationsItems={ chartItems }
              blockOperationsVisibleOperations={ visibleOperations }
              title="Block operations"
              description="Block operations in the last 150 blocks"
              isLoading={ isPlaceholderData }
              chartRef={ chartRef }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              zoomRange={ zoomRange }
            />
          ) }
        </Flex>
      </Flex>

      { isPlaceholderData ? (
        <Box h="300px" w="100%"/>
      ) : (
        <BlockOperationsChart
          items={ chartItems }
          visibleOperations={ visibleOperations }
        />
      ) }
    </Box>
  );
};

export default BlockOperationsHistogramWidget;
