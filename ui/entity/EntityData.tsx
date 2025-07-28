import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { EntityQuery } from './types';

import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import { Container, ItemDivider, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import RawInputData from 'ui/shared/RawInputData';

interface Props {
  entityQuery: EntityQuery;
}

const EntityData = ({ entityQuery }: Props) => {
  const { data, isPlaceholderData: isLoading } = entityQuery;

  if (!data) {
    return null;
  }

  const annotations = [ ...data.string_annotations, ...data.numeric_annotations ];

  return (
    <Container>
      <ItemLabel hint="Raw data content of this entity">Entity Data</ItemLabel>
      <ItemValue>
        <RawInputData
          hex={ data.data || '' }
          isLoading={ isLoading }
          defaultDataType="UTF-8"
        />
      </ItemValue>

      <ItemLabel hint="Size of the stored data">Size</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ formatDataSize(data.data_size) }</Text>
        </Skeleton>
      </ItemValue>

      { annotations.length > 0 && (
        <>
          <ItemDivider/>
          <ItemLabel hint="Key-Value annotations attached to this entity">Annotations</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <Flex flexWrap="wrap" gap={ 2 }>
                { annotations.map((annotation, index) => (
                  <Tag key={ index } size="lg">
                    <Flex alignItems="center" gap={ 1 }>
                      <Text fontWeight="normal" fontSize="xs">{ annotation.key }:</Text>
                      <Text fontWeight="bold" fontSize="xs">{ annotation.value }</Text>
                    </Flex>
                  </Tag>
                )) }
              </Flex>
            </Skeleton>
          </ItemValue>
        </>
      ) }
    </Container>
  );
};

export default EntityData;
