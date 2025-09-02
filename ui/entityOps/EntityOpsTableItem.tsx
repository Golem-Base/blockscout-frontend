import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { formatBigNum } from 'lib/web3/formatBigNum';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
import EntityOp from 'ui/shared/entities/entityOp/EntityOp';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ExpandButton from 'ui/shared/ExpandButton';

import OpExpandableDetails from './OpExpandableDetails';

type Props = {
  item: Operation;
  isLoading?: boolean;
};

const EntityOpsTableItem = ({ item, isLoading }: Props) => {
  const section = useDisclosure();

  const mainRowBorderColor = section.open ? 'transparent' : 'border.divider';

  return (
    <>
      <TableRow
        onClick={ isLoading ? undefined : section.onToggle }
        cursor={ isLoading ? undefined : 'pointer' }
      >
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <ExpandButton
            isOpen={ section.open }
            onToggle={ section.onToggle }
            isLoading={ isLoading }
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <BlockEntity
            number={ item.block_number }
            hash={ item.block_hash }
            isLoading={ isLoading }
            truncation="constant"
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <TxEntity
            hash={ item.transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <Skeleton loading={ isLoading }>
            <Skeleton loading={ isLoading } fontWeight="700">
              <EntityOp txHash={ item.transaction_hash } opIndex={ item.index } noTxHash noCopy/>
            </Skeleton>
          </Skeleton>
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <StorageEntity
            entityKey={ item.entity_key }
            isLoading={ isLoading }
            truncation="constant"
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <Skeleton loading={ isLoading } fontWeight="700" textAlign="right">
            { formatBigNum(item.btl) }
          </Skeleton>
        </TableCell>
      </TableRow>
      { section.open && (
        <TableRow>
          <TableCell/>
          <TableCell colSpan={ 4 } pr={ 0 } pt={ 0 }>
            <OpExpandableDetails
              txHash={ item.transaction_hash }
              opIndex={ item.index }
            />
          </TableCell>
        </TableRow>
      ) }
    </>
  );
};

export default EntityOpsTableItem;
