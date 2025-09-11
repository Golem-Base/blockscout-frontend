import React from 'react';

import type { EntityDataSize } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import EffectivelyLargestEntitiesTableItem from './EffectivelyLargestEntitiesTableItem';

interface Props {
  items: Array<EntityDataSize>;
  top: number;
  isLoading?: boolean;
  pageStartIndex: number;
}

const EffectivelyLargestEntitiesTable = ({ items, top, isLoading, pageStartIndex }: Props) => {
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
          <EffectivelyLargestEntitiesTableItem
            key={ item.entity_key + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
            rank={ pageStartIndex + index }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default EffectivelyLargestEntitiesTable;
