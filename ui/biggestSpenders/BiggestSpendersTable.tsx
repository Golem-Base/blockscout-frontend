import React from 'react';

import type { BiggestSpender } from '@golembase/l3-indexer-types';

import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import BiggestSpendersTableItem from './BiggestSpendersTableItem';

interface Props {
  items: Array<BiggestSpender>;
  top: number;
  isLoading?: boolean;
}

const BiggestSpendersTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width="60%">Address</TableColumnHeader>
          <TableColumnHeader width="40%" isNumeric>{ `Total ${ currencyUnits.ether } Spent` }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <BiggestSpendersTableItem
            key={ item.rank + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default BiggestSpendersTable;
