import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import EntityOpType from './EntityOpType';

type Props = {
  item: Operation;
  isLoading?: boolean;
};

const EntityOpsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <Box fontWeight={ 600 }>
            { item.index }
          </Box>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <EntityOpType
          operation={ item.operation }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <Box fontWeight={ 600 }>
            { item.gas_used }
          </Box>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default EntityOpsTableItem;
