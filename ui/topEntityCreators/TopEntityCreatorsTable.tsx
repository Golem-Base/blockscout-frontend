import React from 'react';

import type { LeaderboardEntitiesCreatedItem } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TopEntityCreatorsTableItem from './TopEntityCreatorsTableItem';

interface Props {
  items: Array<LeaderboardEntitiesCreatedItem>;
  top: number;
  isLoading?: boolean;
}

const TopEntityCreatorsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width="60%">Address</TableColumnHeader>
          <TableColumnHeader width="40%" isNumeric>Entities Created</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TopEntityCreatorsTableItem
            key={ item.rank + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TopEntityCreatorsTable;
