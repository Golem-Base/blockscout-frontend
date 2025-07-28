import { Text } from '@chakra-ui/react';
import React from 'react';

import type { EntityQuery } from './types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Container, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

interface Props {
  entityQuery: EntityQuery;
}

const EntityLifecycle = ({ entityQuery }: Props) => {
  if (!entityQuery.data) {
    return null;
  }

  return (
    <Container>
      { entityQuery.data.created_at_block_number && (
        <>
          <ItemLabel>Created at Block</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <BlockEntity number={ entityQuery.data.created_at_block_number }/>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      <ItemLabel>Created at</ItemLabel>
      <ItemValue>
        { entityQuery.data.created_at_timestamp && (
          <DetailedInfoTimestamp
            timestamp={ entityQuery.data.created_at_timestamp }
            isLoading={ entityQuery.isPlaceholderData }
          />
        ) }
      </ItemValue>

      { entityQuery.data.created_at_tx_hash && (
        <>
          <ItemLabel>Creation Transaction</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <TxEntity hash={ entityQuery.data.created_at_tx_hash }/>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      { entityQuery.data.created_at_operation_index && (
        <>
          <ItemLabel>Operation Index</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Text>({ entityQuery.data.created_at_operation_index })</Text>
            </Skeleton>
          </ItemValue>
        </>
      ) }

      <ItemLabel>Expires at Block</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <BlockEntity number={ entityQuery.data.expires_at_block_number }/>
        </Skeleton>
      </ItemValue>

      <ItemLabel>Expires at</ItemLabel>
      <ItemValue>
        { entityQuery.data.expires_at_timestamp && (
          <DetailedInfoTimestamp
            timestamp={ entityQuery.data.expires_at_timestamp }
            isLoading={ entityQuery.isPlaceholderData }
          />
        ) }
      </ItemValue>
    </Container>
  );
};

export default EntityLifecycle;
