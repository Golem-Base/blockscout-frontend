import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import EntityOpsTableItem from './EntityOpsTableItem';

type Props = {
  operations: Array<Operation>;
  isLoading?: boolean;
  top?: number;
};

const EntityOpsTable = ({ operations, isLoading, top }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w="40px"/>
            <TableColumnHeader >Entity</TableColumnHeader>
            <TableColumnHeader w="120px">Block</TableColumnHeader>
            <TableColumnHeader >Transaction</TableColumnHeader>
            <TableColumnHeader w="100px">Operation Index</TableColumnHeader>
            <TableColumnHeader w="120px" textAlign="right" >BTL</TableColumnHeader>
            <TableColumnHeader w="120px" textAlign="right">Operation</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { operations.map((item, index) => (
            <EntityOpsTableItem
              key={ item.entity_key + item.index + (isLoading ? index : '') }
              item={ item }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default EntityOpsTable;
