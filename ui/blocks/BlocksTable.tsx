import { capitalize } from 'es-toolkit';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import BlocksTableItem from 'ui/blocks/BlocksTableItem';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

interface Props {
  data: Array<Block>;
  isLoading?: boolean;
  top: number;
  page: number;
  socketInfoNum?: number;
  showSocketErrorAlert?: boolean;
  showSocketInfo?: boolean;
}

interface TableColumnHeaders extends React.ComponentProps<typeof TableColumnHeader> {
  visible: boolean;
}

const VALIDATOR_COL_WEIGHT = 23;
const GAS_COL_WEIGHT = 33;
const REWARD_COL_WEIGHT = 22;
const FEES_COL_WEIGHT = 22;

const isRollup = config.features.rollup.isEnabled;

const BlocksTable = ({ data, isLoading, top, page, showSocketInfo, socketInfoNum, showSocketErrorAlert }: Props) => {
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (item) => item.height,
    enabled: !isLoading,
  });

  const widthBase =
    (!config.UI.views.block.hiddenFields?.miner ? VALIDATOR_COL_WEIGHT : 0) +
    GAS_COL_WEIGHT +
    (!isRollup && !config.UI.views.block.hiddenFields?.total_reward ? REWARD_COL_WEIGHT : 0) +
    (!isRollup && !config.UI.views.block.hiddenFields?.burnt_fees ? FEES_COL_WEIGHT : 0);

  const tableColumnHeaders: Array<TableColumnHeaders> = [
    {
      width: '180px',
      children: <>
        Block
        <TimeFormatToggle/>
      </>,
      visible: true,
    },
    {
      width: '120px',
      children: 'Size, bytes',
      visible: true,
    },
    {
      width: `${ VALIDATOR_COL_WEIGHT / widthBase * 100 }%`,
      children: capitalize(getNetworkValidatorTitle()),
      visible: !config.UI.views.block.hiddenFields?.miner,
      minW: '160px',
    },
    {
      width: '64px',
      children: 'Txn',
      visible: true,
    },
    {
      width: `${ GAS_COL_WEIGHT / widthBase * 100 }%`,
      children: 'Gas used',
      visible: true,
    },
    {
      width: `${ REWARD_COL_WEIGHT / widthBase * 100 }%`,
      children: `Reward ${ currencyUnits.ether }`,
      visible: !isRollup && !config.UI.views.block.hiddenFields?.total_reward,
    },
    {
      width: `${ FEES_COL_WEIGHT / widthBase * 100 }%`,
      children: `Burnt fees ${ currencyUnits.ether }`,
      visible: !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees,
    },
    {
      width: '150px',
      children: 'Base fee',
      visible: !isRollup && !config.UI.views.block.hiddenFields?.base_fee,
    },
  ].filter((header) => header.visible);

  return (
    <AddressHighlightProvider>
      <TableRoot minWidth="1070px" fontWeight={ 500 }>
        <TableHeaderSticky top={ top }>
          <TableRow>
            { tableColumnHeaders
              .map(({ visible, children, ...props }, index) => (
                <TableColumnHeader { ...props } key={ index } isNumeric={ index === tableColumnHeaders.length - 1 }>
                  { children }
                </TableColumnHeader>
              ),
              )
            }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              showErrorAlert={ showSocketErrorAlert }
              num={ socketInfoNum }
              type="block"
              isLoading={ isLoading }
            />
          ) }
          { data.map((item, index) => (
            <BlocksTableItem
              key={ item.height + (isLoading ? `${ index }_${ page }` : '') }
              data={ item }
              enableTimeIncrement={ page === 1 && !isLoading }
              isLoading={ isLoading }
              animation={ initialList.getAnimationProp(item) }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default BlocksTable;
