import { Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNum } from 'lib/web3/formatBigNum';
import { ENTITY_HISTORY_ENTRY } from 'stubs/entityOps';
import { Skeleton } from 'toolkit/chakra/skeleton';
import OperationSpecificData from 'ui/entityOp/OperationSpecificData';
import { Container, ItemDivider, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import EntityOpType from './EntityOpType';

interface Props {
  txHash: string;
  opIndex: string;
}

const OpExpandableDetails = ({ txHash, opIndex }: Props) => {
  const { data, isPlaceholderData: isLoading } = useApiQuery('golemBaseIndexer:operation', {
    pathParams: { tx_hash: txHash, op_index: opIndex },
    queryOptions: {
      enabled: Boolean(txHash) && Boolean(opIndex),
      placeholderData: ENTITY_HISTORY_ENTRY,
    },
  });

  if (!data) {
    return null;
  }

  return (
    <Container data-testid="operation-details">
      <ItemLabel hint="Entity operation type">Type</ItemLabel>
      <ItemValue>
        <EntityOpType operation={ data.operation } isLoading={ isLoading }/>
      </ItemValue>

      <ItemLabel hint="Timestamp when this operation occurred">Timestamp</ItemLabel>
      <ItemValue>
        <DetailedInfoTimestamp
          timestamp={ data.block_timestamp }
          isLoading={ isLoading }
        />
      </ItemValue>

      <ItemLabel hint="Address that performed this operation">Sender</ItemLabel>
      <ItemValue>
        <AddressEntity
          address={{ hash: data.sender }}
          isLoading={ isLoading }
        />
      </ItemValue>

      <ItemLabel hint="Gas consumed by this operation">Gas Used</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ formatBigNum(data.gas_used) }</Text>
        </Skeleton>
      </ItemValue>

      <ItemDivider/>

      <OperationSpecificData data={ data } isLoading={ isLoading }/>
    </Container>
  );
};

export default OpExpandableDetails;
