import React from 'react';

import type { EntityDataSize } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

type Props = {
  item: EntityDataSize;
  isLoading?: boolean;
  rank: number;
};

const EffectivelyLargestEntitiesTableItem = ({
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
          entityKey={ item.entity_key }
          isLoading={ isLoading }
          truncation="dynamic"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          { formatDataSize(item.data_size) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(EffectivelyLargestEntitiesTableItem);
