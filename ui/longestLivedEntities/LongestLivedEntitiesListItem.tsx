import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Entity } from '@golembase/l3-indexer-types';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: Entity;
  isLoading?: boolean;
};

const LongestLivedEntitiesListItem = ({
  item,
  isLoading,
}: Props) => {

  return (
    <ListItemMobile>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <span>{ item.key }</span>
        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">
          asd
        </Skeleton>
      </Flex>
      <HStack gap={ 3 } maxW="100%" alignItems="flex-start">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Total ${ currencyUnits.ether } Spent` }</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" minW="0" whiteSpace="pre-wrap">
          asd
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(LongestLivedEntitiesListItem);
