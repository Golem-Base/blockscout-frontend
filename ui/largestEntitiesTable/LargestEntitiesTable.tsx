import React from 'react';

import type { LeaderboardLargestEntitiesItem } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import LargestEntitiesTableItem from './LargestEntitiesTableItem';

interface Props {
  items: Array<LeaderboardLargestEntitiesItem>;
  top: number;
  isLoading?: boolean;
}

const LargestEntitiesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot overflowX="auto" whiteSpace="nowrap">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width="60%">Key</TableColumnHeader>
          <TableColumnHeader width="40%" isNumeric>Data size</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <LargestEntitiesTableItem
            key={ item.rank + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default LargestEntitiesTable;
