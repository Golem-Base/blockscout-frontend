import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { EntityDataSize } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: EntityDataSize;
  isLoading?: boolean;
  rank: number;
};

const EffectivelyLargestEntitiesListItem = ({
  item,
  isLoading,
  rank,
}: Props) => {

  return (
    <ListItemMobile>
      <Flex justifyContent="space-between" w="100%" gap={ 6 }>
        <StorageEntity entityKey={ item.entity_key } isLoading={ isLoading } truncate="dynamic"/>

        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">{ rank }</Skeleton>
      </Flex>

      <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
        { formatDataSize(item.data_size) }
      </Skeleton>
    </ListItemMobile>
  );
};

export default React.memo(EffectivelyLargestEntitiesListItem);
