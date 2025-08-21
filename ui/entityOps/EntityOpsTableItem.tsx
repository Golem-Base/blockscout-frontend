import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ExpandableButton from 'ui/shared/ExpandableButton';

import EntityOpType from './EntityOpType';
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
          <ExpandableButton
            isOpen={ section.open }
            onToggle={ section.onToggle }
            isLoading={ isLoading }
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <TxEntity
            hash={ item.transaction_hash }
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <Skeleton loading={ isLoading }>
            <Skeleton loading={ isLoading } fontWeight="700">
              { item.index }
            </Skeleton>
          </Skeleton>
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <EntityOpType
            operation={ item.operation }
            isLoading={ isLoading }
          />
        </TableCell>
        <TableCell borderColor={ mainRowBorderColor } verticalAlign="middle">
          <Skeleton loading={ isLoading } fontWeight="700">
            { item.gas_used }
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
