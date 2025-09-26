import React from 'react';

import type { Transaction as GolemBaseTransaction } from '@golembase/l3-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import CustomContractTxsTableItem from './CustomContractTxsTableItem';

type Props = {
  items: Array<GolemBaseTransaction>;
  top: number;
  isLoading?: boolean;
};

const CustomContractTxsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Block</TableColumnHeader>
          <TableColumnHeader>
            Transaction
          </TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>From</TableColumnHeader>
          <TableColumnHeader>To</TableColumnHeader>
          <TableColumnHeader isNumeric>Gas Used</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <CustomContractTxsTableItem
            key={ item.hash + (isLoading ? index : '') }
            tx={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default CustomContractTxsTable;
