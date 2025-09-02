import { Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { BiggestSpender } from '@golembase/l3-indexer-types';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  item: BiggestSpender;
  isLoading?: boolean;
};

const BiggestSpendersTableItem = ({
  item,
  isLoading,
}: Props) => {

  const totalFees = BigNumber(item.total_fees || 0).div(BigNumber(10 ** config.chain.currency.decimals));
  const totalFeesChunks = totalFees.dp(12).toFormat().split('.');
  const addressProp = { hash: item.address };

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { item.rank }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Flex alignItems="center" columnGap={ 2 }>
          <AddressEntity
            address={ addressProp }
            isLoading={ isLoading }
            fontWeight={ 700 }
            my="2px"
          />
        </Flex>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          <Text lineHeight="24px" as="span">{ totalFeesChunks[0] + (totalFeesChunks[1] ? '.' : '') }</Text>
          <Text lineHeight="24px" color="text.secondary" as="span">{ totalFeesChunks[1] }</Text>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(BiggestSpendersTableItem);
