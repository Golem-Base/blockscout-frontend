import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Entity } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = {
  item: Entity;
  isLoading?: boolean;
};

const LongestLivedEntitiesTableItem = ({
  item,
  isLoading,
}: Props) => {

  return (
    <TableRow>
      <TableCell width="60%">
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          <Skeleton loading={ isLoading } overflow="hidden">
            <HashStringShortenDynamic hash={ item.key }/>
          </Skeleton>
          <CopyToClipboard text={ item.key } isLoading={ isLoading }/>
        </Flex>
      </TableCell>
      <TableCell width="20%">
        <BlockEntity number={ item.expires_at_block_number }/>
      </TableCell>
      <TableCell width="20%" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          { item?.created_at_tx_hash ? <TxEntity hash={ item.created_at_tx_hash } truncation="constant"/> : <span>N/A</span> }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(LongestLivedEntitiesTableItem);
