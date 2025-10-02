import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { LeaderboardEffectivelyLargestEntitiesItem } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: LeaderboardEffectivelyLargestEntitiesItem;
  isLoading?: boolean;
};

const LargestEntitiesListItem = ({
  item,
  isLoading,
}: Props) => {

  return (
    <ListItemMobile>
      <Flex justifyContent="space-between" w="100%" gap={ 6 }>
        <StorageEntity entityKey={ item.entity_key } isLoading={ isLoading } truncate="dynamic"/>

        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">{ item.rank }</Skeleton>
      </Flex>

      <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
        <chakra.span fontWeight={ 700 }>Data size:</chakra.span> { formatDataSize(item.data_size) }
      </Skeleton>

      <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
        <chakra.span fontWeight={ 700 }>Lifespan:</chakra.span> { item.lifespan }
      </Skeleton>
    </ListItemMobile>
  );
};

export default React.memo(LargestEntitiesListItem);
