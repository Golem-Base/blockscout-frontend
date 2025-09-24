import React from 'react';

import type { Transaction as GolemBaseTransaction } from '@golembase/l3-indexer-types';

import { formatBigNum } from 'lib/web3/formatBigNum';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  item: GolemBaseTransaction;
  isLoading?: boolean;
};

const CustomContractTxsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Block No</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.block_number && (
          <BlockEntity
            number={ parseInt(item.block_number) }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
          />
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn Hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          hash={ item.hash }
          isLoading={ isLoading }
          truncation="constant_long"
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.block_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>From Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.from_address_hash }}
          isLoading={ isLoading }
          truncation="constant_long"
          noIcon
        />
      </ListItemMobileGrid.Value>

      { item.to_address_hash && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>To Address</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={{ hash: item.to_address_hash }}
              isLoading={ isLoading }
              truncation="constant_long"
              noIcon
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Gas Used</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ formatBigNum(item.cumulative_gas_used) }</Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default CustomContractTxsListItem;
