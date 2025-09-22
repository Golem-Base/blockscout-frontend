import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Operation } from '@golembase/l3-indexer-types';

import { formatBigNum } from 'lib/web3/formatBigNum';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';
import EntityOp from 'ui/shared/entities/entityOp/EntityOp';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ExpandButton from 'ui/shared/ExpandButton';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import OpExpandableDetails from './OpExpandableDetails';

type Props = {
  item: Operation;
  isLoading?: boolean;
};

const EntityOpsListItem = ({ item, isLoading }: Props) => {
  const section = useDisclosure();

  return (
    <ListItemMobile display="block" width="100%">
      <Flex justifyContent="space-between" alignItems="center" mt={ 4 } gap={ 6 } width="100%">
        <Flex alignItems="flex-start">
          <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Entity </Skeleton>
          <StorageEntity
            entityKey={ item.entity_key }
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
        </Flex>
        <ExpandButton
          isOpen={ section.open }
          onToggle={ section.onToggle }
          isLoading={ isLoading }
        />
      </Flex>
      <Flex mt={ 2 }>
        <HStack flexWrap="wrap">
          <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Block </Skeleton>
          <BlockEntity
            number={ item.block_number }
            hash={ item.block_hash }
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
        </HStack>
      </Flex>
      <Flex mt={ 2 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Transaction </Skeleton>
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          truncation="dynamic"
          noIcon
        />
      </Flex>
      <Flex mt={ 2 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Operation Index </Skeleton>
        <Skeleton loading={ isLoading } fontWeight="700">
          <EntityOp txHash={ item.transaction_hash } opIndex={ item.index } noTxHash noCopy noIcon/>
        </Skeleton>
      </Flex>
      <Flex mt={ 2 }>
        <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">BTL </Skeleton>
        <Skeleton loading={ isLoading } fontWeight="700">
          { formatBigNum(item.btl) }
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
