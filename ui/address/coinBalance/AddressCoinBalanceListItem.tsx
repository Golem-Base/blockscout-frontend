import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { ClusterChainConfig } from 'types/multichain';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import { WEI } from 'ui/shared/value/utils';

import AddressCoinBalanceDelta from './AddressCoinBalanceDelta';
import AddressCoinBalanceValue from './AddressCoinBalanceValue';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 600 } display="inline-flex" gap={ 1 }>
          <AddressCoinBalanceValue isLoading={ props.isLoading } value={ props.value }/> <span>{ currencyUnits.ether }</span>
        </Skeleton>
        <AddressCoinBalanceDelta
          isLoading={ props.isLoading }
          deltaBn={ deltaBn }
        />
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Block</Skeleton>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon={ !props.chainData }
          fontWeight={ 700 }
          chain={ props.chainData }
        />
      </Flex>
      { props.transaction_hash && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txs</Skeleton>
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="150px"
          />
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Age</Skeleton>
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
        />
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
