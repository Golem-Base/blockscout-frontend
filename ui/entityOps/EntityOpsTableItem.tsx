import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
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
    </TableRow>
  );
};

export default EntityOpsTableItem;
