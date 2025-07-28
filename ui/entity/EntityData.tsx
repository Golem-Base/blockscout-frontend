import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { EntityQuery } from './types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Container, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import RawInputData from 'ui/shared/RawInputData';

interface Props {
  entityQuery: EntityQuery;
}

const EntityData = ({ entityQuery }: Props) => {
  const formatDataSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return 'Unknown';
    const bytes = sizeInBytes;
    if (bytes < 1024) return `${ bytes } bytes`;
    if (bytes < 1024 * 1024) return `${ (bytes / 1024).toFixed(2) } KB`;
    return `${ (bytes / (1024 * 1024)).toFixed(2) } MB`;
  };

  if (!entityQuery.data) {
    return null;
  }

  return (
    <Container>
      <ItemLabel>Entity Data</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <RawInputData
            hex={ entityQuery.data.data || '' }
            isLoading={ entityQuery.isPlaceholderData }
            defaultDataType="UTF-8"
          />
        </Skeleton>
      </ItemValue>

      <ItemLabel>Size</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <Text>{ formatDataSize(entityQuery.data.data_size) }</Text>
        </Skeleton>
      </ItemValue>

      { entityQuery.data.string_annotations && entityQuery.data.string_annotations.length > 0 && (
        <>
          <ItemLabel>String Annotations</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Box>
                { entityQuery.data.string_annotations.map((annotation, index) => (
                  <Box key={ index } mb={ 2 }>
                    <Text fontWeight="bold">{ annotation.key }:</Text>
                    <Text>{ annotation.value }</Text>
                  </Box>
                )) }
              </Box>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { entityQuery.data.numeric_annotations && entityQuery.data.numeric_annotations.length > 0 && (
        <>
          <ItemLabel>Numeric Annotations</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Box>
                { entityQuery.data.numeric_annotations.map((annotation, index) => (
                  <Box key={ index } mb={ 2 }>
                    <Text fontWeight="bold">{ annotation.key }:</Text>
                    <Text>{ annotation.value }</Text>
                  </Box>
                )) }
              </Box>
            </Skeleton>
          </ItemValue>
        </>
      ) }
    </Container>
  );
};

export default EntityData;
