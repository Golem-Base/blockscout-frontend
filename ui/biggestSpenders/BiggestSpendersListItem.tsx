import { Flex, HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { BiggestSpender } from '@golembase/l3-indexer-types';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: BiggestSpender;
};

const BiggestSpendersListItem = ({
  item,
  isLoading,
}: Props) => {
  const totalFees = BigNumber(item.total_fees || 0).div(BigNumber(10 ** config.chain.currency.decimals));
  const addressProp = { hash: item.address };

  return (
    <ListItemMobile>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <AddressEntity
          address={ addressProp }
          isLoading={ isLoading }
          fontWeight={ 700 }
          truncation="constant"
          mr={ 2 }
        />
        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">
          <span>{ item.rank }</span>
        </Skeleton>
      </Flex>
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Total ${ currencyUnits.ether } Spent` }</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" minW="0" whiteSpace="pre-wrap">
          <span>{ totalFees.dp(12).toFormat() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(BiggestSpendersListItem);
