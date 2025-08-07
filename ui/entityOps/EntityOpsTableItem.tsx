import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
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
        <EntityOpType
          operation={ item.operation }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <StorageEntity
          entityKey={ item.entity_key }
          isLoading={ isLoading }
          truncation="constant"
          fontWeight={ 600 }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressStringOrParam
          address={ item.sender }
          isLoading={ isLoading }
          truncation="constant"
        />
      </TableCell>
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
        <Skeleton loading={ isLoading }>
          { item.btl ? <BlockEntity number={ item.btl } isLoading={ isLoading }/> : <Box fontWeight={ 600 }>N/A</Box> }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default EntityOpsTableItem;
