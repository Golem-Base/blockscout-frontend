import React from 'react';

import type { AddressByEntitiesOwned } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TopEntityOwnersTableItem from './TopEntityOwnersTableItem';

interface Props {
  items: Array<AddressByEntitiesOwned>;
  top: number;
  isLoading?: boolean;
}

const TopEntityOwnersTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="60%">Address</TableColumnHeader>
          <TableColumnHeader width="40%" isNumeric>Entities Owned</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TopEntityOwnersTableItem
            key={ item.address + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TopEntityOwnersTable;
