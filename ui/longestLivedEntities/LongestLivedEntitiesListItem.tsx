import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { EntityWithExpTimestamp } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableExpirationTime from 'ui/shared/TableExpirationTime';

type Props = {
  item: EntityWithExpTimestamp;
  isLoading?: boolean;
  rank: number;
};

const LongestLivedEntitiesListItem = ({
  item,
  isLoading,
  rank,
}: Props) => {
  return (
    <ListItemMobile>
      <Flex justifyContent="space-between" w="100%" gap={ 6 }>
        <StorageEntity entityKey={ item.key } isLoading={ isLoading } truncate="dynamic"/>

        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">{ rank }</Skeleton>
      </Flex>

      <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
        { item?.expires_at_timestamp_sec && (
          <TableExpirationTime
            expiresAtTimestampSec={ item.expires_at_timestamp_sec }
            expiresAtTimestamp={ item.expires_at_timestamp }
            isLoading={ isLoading }
          />
        ) }
      </Skeleton>
    </ListItemMobile>
  );
};

export default React.memo(LongestLivedEntitiesListItem);
