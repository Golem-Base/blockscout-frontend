import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { formatUnits } from 'viem';

import type { EntityQuery } from './utils/types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Container, ItemDivider, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import EntityStatus from 'ui/shared/statusTag/EntityStatus';

import CopyToClipboard from '../shared/CopyToClipboard';
import HashStringShortenDynamic from '../shared/HashStringShortenDynamic';

interface Props {
  entityQuery: EntityQuery;
}

const EntityDetails = ({ entityQuery }: Props) => {
  const { data, isPlaceholderData: isLoading } = entityQuery;

  if (!data) {
    return null;
  }

  let expirationLabel;
  switch (data.status) {
    case 'EXPIRED':
      expirationLabel = 'Expired at';
      break;
    case 'DELETED':
      expirationLabel = 'Deleted at';
      break;
    default:
      expirationLabel = 'Expires at';
  }

  return (
    <Container data-testid="entity-details">
      <ItemLabel hint="Unique identifier for this entity" isLoading={ isLoading }>Entity Key</ItemLabel>
      <ItemValue>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          <Skeleton loading={ isLoading } overflow="hidden">
            <HashStringShortenDynamic hash={ data.key }/>
          </Skeleton>
          <CopyToClipboard text={ data.key } isLoading={ isLoading }/>
        </Flex>
      </ItemValue>

      <ItemLabel hint="Current status of this entity">Status</ItemLabel>
      <ItemValue>
        <EntityStatus status={ data.status } isLoading={ isLoading }/>
      </ItemValue>

      { data.owner && (
        <>
          <ItemLabel hint="Address that owns this entity">Owner</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <AddressEntity
                address={{ hash: data.owner }}
                truncation="dynamic"
              />
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { data.creator && (
        <>
          <ItemLabel hint="Address that created this entity">Creator</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <AddressEntity
                address={{ hash: data.creator }}
                truncation="dynamic"
              />
            </Skeleton>
          </ItemValue>
        </>
      ) }

      <ItemLabel hint="Total gas consumed by this entity">Gas Used</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ formatUnits(BigInt(data.gas_used || '0'), 0) }</Text>
        </Skeleton>
      </ItemValue>

      <ItemDivider/>

      { data.created_at_block_number && (
        <>
          <ItemLabel hint="Block number when this entity was created">Created at Block</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <BlockEntity number={ data.created_at_block_number }/>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      <ItemLabel hint="Timestamp when this entity was created">Created at</ItemLabel>
      <ItemValue>
        { data.created_at_timestamp && (
          <DetailedInfoTimestamp
            timestamp={ data.created_at_timestamp }
            isLoading={ isLoading }
          />
        ) }
      </ItemValue>

      { data.created_at_tx_hash && (
        <>
          <ItemLabel hint="Transaction that created this entity">Creation Transaction</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <TxEntity hash={ data.created_at_tx_hash } truncation="dynamic"/>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { data.created_at_operation_index && (
        <>
          <ItemLabel hint="Operation index within the creation transaction">Operation Index</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <Text>({ data.created_at_operation_index })</Text>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      <ItemDivider/>

      { data.expires_at_block_number && (
        <>
          <ItemLabel hint="Block number when this entity expires">{ expirationLabel } Block</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <BlockEntity number={ data.expires_at_block_number }/>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { data.expires_at_timestamp && (
        <>
          <ItemLabel hint="Timestamp when this entity expires">{ expirationLabel }</ItemLabel>
          <ItemValue>
            <DetailedInfoTimestamp
              timestamp={ data.expires_at_timestamp }
              isLoading={ isLoading }
            />
          </ItemValue>
        </>
      ) }
    </Container>
  );
};

export default EntityDetails;
