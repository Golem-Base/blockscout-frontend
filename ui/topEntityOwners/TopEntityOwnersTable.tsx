import React from 'react';

import type { LeaderboardEntitiesOwnedItem } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TopEntityOwnersTableItem from './TopEntityOwnersTableItem';

interface Props {
  items: Array<LeaderboardEntitiesOwnedItem>;
  top: number;
  isLoading?: boolean;
}

const TopEntityOwnersTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width="60%">Address</TableColumnHeader>
          <TableColumnHeader width="40%" isNumeric>Entities Owned</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TopEntityOwnersTableItem
            key={ item.rank + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TopEntityOwnersTable;
