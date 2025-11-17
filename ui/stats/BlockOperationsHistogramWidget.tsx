import { Box, createListCollection, Flex } from '@chakra-ui/react';
import { sum, pick } from 'es-toolkit/compat';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { BLOCK_OPERATIONS_HISTOGRAM } from 'stubs/stats';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import HistogramBlockOperationsChart from 'ui/shared/chart/HistogramBlockOperationsChart';
import type { OperationTypeCount } from 'ui/shared/chart/HistogramBlockOperationsChartBar';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const BlockOperationsHistogramWidget = () => {
  const [ selectedOperations, setSelectedOperations ] = React.useState([ 'create', 'update', 'extend', 'delete' ]);

  const handleOperationChange = React.useCallback((e: { value: Array<string> }) => {
    setSelectedOperations(e.value);
  }, []);

  const { data, isPlaceholderData, isError } = useApiQuery('golemBaseIndexer:chartBlockOperations', {
    queryParams: {
      limit: 30,
    },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: BLOCK_OPERATIONS_HISTOGRAM,
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
    value: sum(Object.values(pick(item, [ 'create_count', 'update_count', 'extend_count', 'delete_count', 'changeowner_count' ])).map(Number)),
    ...item,
  }));

  const visibleOperations = selectedOperations.map(operation => `${ operation }_count` as OperationTypeCount);
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
      flex={ 1 }
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      padding={{ base: 3, lg: 4 }}
    >
      <Flex mb={ 3 } justifyContent="space-between">
        <Box>
          <Skeleton loading={ isPlaceholderData } fontWeight={ 600 } textStyle="md">
            <span>Block operations</span>
          </Skeleton>

          <Skeleton loading={ isPlaceholderData } color="text.secondary" fontSize="xs" mt={ 1 }>
            <span>Operations count by block</span>
          </Skeleton>
        </Box>

        <Select
          collection={ visibleOperationsOptions }
          placeholder="Select operations"
          size="sm"
          w="200px"
          multiple
          value={ selectedOperations }
          onValueChange={ handleOperationChange }
        />
      </Flex>

      { isPlaceholderData ? (
        <Box h="300px" w="100%"/>
      ) : (
        <HistogramBlockOperationsChart
          items={ chartItems }
          visibleOperations={ visibleOperations }
        />
      ) }
    </Box>
  );
};

export default BlockOperationsHistogramWidget;
