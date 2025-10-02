import React from 'react';

import type { LeaderboardEffectivelyLargestEntitiesItem } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import LargestEntitiesTableItem from './EffectivelyLargestEntitiesTableItem';

interface Props {
  items: Array<LeaderboardEffectivelyLargestEntitiesItem>;
  top: number;
  isLoading?: boolean;
}

const EffectivelyLargestEntitiesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot overflowX="auto" whiteSpace="nowrap">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width="80%">Key</TableColumnHeader>
          <TableColumnHeader width="15%">Data size</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Lifespan</TableColumnHeader>
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

export default EffectivelyLargestEntitiesTable;
