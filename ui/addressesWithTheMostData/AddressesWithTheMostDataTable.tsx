import React from 'react';

import type { LeaderboardDataOwnedItem } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import AddressesWithTheMostDataTableItem from './AddressesWithTheMostDataTableItem';

interface Props {
  items: Array<LeaderboardDataOwnedItem>;
  top: number;
  isLoading?: boolean;
}

const AddressesWithTheMostDataTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width="60%">Address</TableColumnHeader>
          <TableColumnHeader width="35%" isNumeric>Data size</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <AddressesWithTheMostDataTableItem
            key={ item.address + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default AddressesWithTheMostDataTable;
