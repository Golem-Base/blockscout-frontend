import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { LeaderboardDataOwnedItem } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  item: LeaderboardDataOwnedItem;
  isLoading?: boolean;
};

const AddressesWithTheMostDataTableItem = ({ item, isLoading }: Props) => {
  const address = { hash: item.address };

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
            address={ address }
            isLoading={ isLoading }
            fontWeight={ 700 }
            my="2px"
          />
        </Flex>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          { formatDataSize(item.data_size) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressesWithTheMostDataTableItem);
