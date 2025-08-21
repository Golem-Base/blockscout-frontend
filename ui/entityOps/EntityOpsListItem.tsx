import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ExpandableButton from 'ui/shared/ExpandableButton';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import EntityOpType from './EntityOpType';
import OpExpandableDetails from './OpExpandableDetails';

type Props = {
  item: Operation;
  isLoading?: boolean;
};

const EntityOpsListItem = ({ item, isLoading }: Props) => {
  const section = useDisclosure();

  return (
    <ListItemMobile display="block" width="100%">
      <Flex justifyContent="space-between" alignItems="flex-start" mt={ 4 }>
        <HStack flexWrap="wrap">
          <EntityOpType
            operation={ item.operation }
            isLoading={ isLoading }
          />
        </HStack>
        <ExpandableButton
          isOpen={ section.open }
          onToggle={ section.onToggle }
          isLoading={ isLoading }
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
      <Flex mt={ 2 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Operation Index </Skeleton>
        <Skeleton loading={ isLoading } fontWeight="700">
          { item.index }
        </Skeleton>
      </Flex>
      <Flex mt={ 2 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Gas Used </Skeleton>
        <Skeleton loading={ isLoading } fontWeight="700">
          { item.gas_used }
        </Skeleton>
      </Flex>
      { section.open && (
        <Flex mt={ 4 }>
          <OpExpandableDetails
            txHash={ item.transaction_hash }
            opIndex={ item.index }
          />
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default EntityOpsListItem;
