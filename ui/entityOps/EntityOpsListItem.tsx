import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import EntityOpType from './EntityOpType';

type Props = {
  item: Operation;
  isLoading?: boolean;
};

const EntityOpsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobile display="block" width="100%">
      <Flex justifyContent="space-between" alignItems="flex-start" mt={ 4 }>
        <HStack flexWrap="wrap">
          <EntityOpType
            operation={ item.operation }
            isLoading={ isLoading }
          />
        </HStack>
      </Flex>
      <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 } alignItems="center">
        <StorageEntity
          entityKey={ item.entity_key }
          isLoading={ isLoading }
          truncation="constant_long"
          fontWeight="700"
        />
      </Flex>
      <Flex mt={ 3 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Sender </Skeleton>
        <AddressStringOrParam
          address={ item.sender }
          isLoading={ isLoading }
          truncation="constant"
        />
      </Flex>
      <Flex mt={ 2 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Transaction </Skeleton>
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
      </Flex>
    </ListItemMobile>
  );
};

export default EntityOpsListItem;
