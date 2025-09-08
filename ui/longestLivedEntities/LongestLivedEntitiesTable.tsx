import React from 'react';

import type { Entity } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import LongestLivedEntitiesTableItem from './LongestLivedEntitiesTableItem';

interface Props {
  items: Array<Entity>;
  top: number;
  isLoading?: boolean;
}

const LongestLivedEntitiesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot overflowX="auto" whiteSpace="nowrap">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="60%">Key</TableColumnHeader>
          <TableColumnHeader width="20%">Created at tx hash</TableColumnHeader>
          <TableColumnHeader width="20%" textAlign="end">Expires at block number</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <LongestLivedEntitiesTableItem
            key={ item.key + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default LongestLivedEntitiesTable;
