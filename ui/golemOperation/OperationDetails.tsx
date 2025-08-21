import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { formatUnits } from 'viem';

import type { OperationQuery } from './types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import EntityOpType from 'ui/entityOps/EntityOpType';
import { Container, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

interface Props {
  operationQuery: OperationQuery;
}

const OperationDetails = ({ operationQuery }: Props) => {
  const { data, isPlaceholderData: isLoading } = operationQuery;

  if (!data) {
    return null;
  }

  return (
    <Container data-testid="entity-details">
      <ItemLabel hint="Unique identifier for entity changed by this operation" isLoading={ isLoading }>Entity Key</ItemLabel>
      <ItemValue>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          <StorageEntity
            entityKey={ data.entity_key }
            isLoading={ isLoading }
            truncation="none"
            fontWeight={ 600 }
          />
        </Flex>
      </ItemValue>

      <ItemLabel hint="Block number of this operation" isLoading={ isLoading }>Block Number</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <BlockEntity number={ data.block_number } hash={ data.block_hash }/>
        </Skeleton>
      </ItemValue>

      <ItemLabel hint="Address that made this operation">Initiator</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <AddressEntity
            address={{ hash: data.sender }}
            truncation="none"
          />
        </Skeleton>
      </ItemValue>

      <ItemLabel hint="Timestamp when this operation happened">Timestamp</ItemLabel>
      <ItemValue>
        <DetailedInfoTimestamp
          timestamp={ data.block_timestamp }
          isLoading={ isLoading }
        />
      </ItemValue>

      <ItemLabel hint="Operation index within the transaction">Operation Index</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ data.op_index }</Text>
        </Skeleton>
      </ItemValue>

      <ItemLabel hint="Operation type">Type</ItemLabel>
      <ItemValue>
        <EntityOpType operation={ data.operation } isLoading={ isLoading }/>
      </ItemValue>

      <ItemLabel hint="Blocks to Live set by the operation">BTL</ItemLabel>
      <ItemValue>
        <Text>{ data.btl }</Text>
      </ItemValue>

      { data.expires_at_block_number && (
        <>
          <ItemLabel hint="Block number the entity is expected to expire at after the operation">Expiration block</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <BlockEntity number={ data.expires_at_block_number }/>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { data.prev_expires_at_block_number && (
        <>
          <ItemLabel hint="Block number the entity was supposed to expire at before the operation">Previous expiration block</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <BlockEntity number={ data.prev_expires_at_block_number }/>
            </Skeleton>
          </ItemValue>
        </>
      ) }
      { /* FIXME prev_expires_at_timestmp/expires_at_timestamp */ }

      { /* FIXME prev_data/data diff */ }
      { /* FIXME prev_status/status diff */ }
      { /* FIXME fees_paid */ }

      <ItemLabel hint="Gas consumed by this operation">Gas Used</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ formatUnits(BigInt(data.gas_used || '0'), 0) }</Text>
        </Skeleton>
      </ItemValue>
    </Container>
  );
};

export default OperationDetails;
