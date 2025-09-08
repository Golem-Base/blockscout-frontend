import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressByEntitiesOwned } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: AddressByEntitiesOwned;
  isLoading?: boolean;
};

const TopEntityOwnersListItem = ({
  item,
  isLoading,
}: Props) => {
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
      </Flex>
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>Entities Owned</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" minW="0" whiteSpace="pre-wrap">
          <span>{ item.entities_count }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(TopEntityOwnersListItem);
