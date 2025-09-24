import React from 'react';

import type { Transaction as GolemBaseTransaction } from '@golembase/l3-indexer-types';

import { formatBigNum } from 'lib/web3/formatBigNum';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  tx: GolemBaseTransaction;
  isLoading?: boolean;
};

const CustomContractTxsTableItem = ({ tx, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        { tx.block_number && (
          <BlockEntity
            number={ parseInt(tx.block_number) }
            hash={ tx.block_hash }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
          />
        ) }
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          hash={ tx.hash }
          isLoading={ isLoading }
          truncation="constant_long"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TimeWithTooltip
          timestamp={ tx.block_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={{ hash: tx.from_address_hash }}
          isLoading={ isLoading }
          truncation="constant_long"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { tx.to_address_hash && (
          <AddressEntity
            address={{ hash: tx.to_address_hash }}
            isLoading={ isLoading }
            truncation="constant_long"
            noIcon
          />
        ) }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } color="text.secondary" display="inline-block">
          <span>{ formatBigNum(tx.cumulative_gas_used) }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default CustomContractTxsTableItem;
