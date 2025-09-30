import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { LeaderboardDataOwnedItem } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: LeaderboardDataOwnedItem;
  isLoading?: boolean;
};

const AddressesWithTheMostDataListItem = ({
  item,
  isLoading,
}: Props) => {
  const address = { hash: item.address };

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <AddressEntity
          address={ address }
          isLoading={ isLoading }
          fontWeight={ 700 }
          mr={ 2 }
          truncation="dynamic"
        />
        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">
          <span>{ item.rank }</span>
        </Skeleton>
      </Flex>
      <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" minW="0" whiteSpace="pre-wrap">
        <chakra.span fontWeight={ 700 }>Data size:</chakra.span> { formatDataSize(item.data_size) }
      </Skeleton>
    </ListItemMobile>
  );
};

export default React.memo(AddressesWithTheMostDataListItem);
