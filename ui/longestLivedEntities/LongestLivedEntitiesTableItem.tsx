import React from 'react';

import type { EntityWithExpTimestamp } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

import LongestLivedEntitiesExpirationTime from './LongestLivedEntitiesExpirationTime';

type Props = {
  item: EntityWithExpTimestamp;
  isLoading?: boolean;
  rank: number;
};

const LongestLivedEntitiesTableItem = ({
  item,
  isLoading,
  rank,
}: Props) => {

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { rank }
        </Skeleton>
      </TableCell>
      <TableCell
        fontSize="sm"
        textTransform="capitalize"
        verticalAlign="middle"
        maxWidth="0"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        <StorageEntity
          entityKey={ item.key }
          isLoading={ isLoading }
          truncation="dynamic"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          { item.expires_at_timestamp_sec && (
            <LongestLivedEntitiesExpirationTime
              expiresAtTimestampSec={ item.expires_at_timestamp_sec }
              isLoading={ isLoading }
            />
          ) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(LongestLivedEntitiesTableItem);
