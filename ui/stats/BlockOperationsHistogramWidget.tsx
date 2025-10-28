import { Box, createListCollection, Flex } from '@chakra-ui/react';
import { sum } from 'es-toolkit/compat';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import HistogramBlockOperationsChart from 'ui/shared/chart/HistogramBlockOperationsChart';
import type { OperationTypeCount } from 'ui/shared/chart/HistogramBlockOperationsChartBar';
import type { HistogramItem } from 'ui/shared/chart/HistogramChart';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const DataSizeHistogramWidget = () => {
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
      placeholderData: {
        chart: [ { block_number: '0', create_count: '0', update_count: '0', extend_count: '0', delete_count: '0' } ],
        info: {
          id: 'block_operations',
          title: 'Block operations',
          description: 'Block operations',
        },
      },
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.chart || data.chart.length === 0) {
    return null;
  }

  const chartItems: Array<HistogramItem> = [
    ...data.chart,
    { block_number: '1204198', create_count: '14', update_count: '12', extend_count: '12', delete_count: '10' },
    { block_number: '1204198', create_count: '6', update_count: '42', extend_count: '18', delete_count: '7' },
  ].map((item) => ({
    label: item.block_number,
    value: sum([ Number(item.create_count), Number(item.update_count), Number(item.extend_count), Number(item.delete_count) ]),
    ...item,
  }));

  const visibleOperations = selectedOperations.map(operation => `${ operation }_count` as OperationTypeCount);
  const visibleOperationsOptions = createListCollection({
    items: [ { label: 'Create', value: 'create' },
      { label: 'Update', value: 'update' },
      { label: 'Extend', value: 'extend' },
      { label: 'Delete', value: 'delete' },
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

export default DataSizeHistogramWidget;
