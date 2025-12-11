import { Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { currencyUnits } from 'lib/units';
import { ENTITY_HISTORY_ENTRY } from 'stubs/entityOps';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { WEI } from 'toolkit/utils/consts';
import OperationSpecificData from 'ui/entityOp/OperationSpecificData';
import { Container, ItemDivider, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

import EntityOpType from './EntityOpType';

interface Props {
  txHash: string;
  opIndex: string;
  withEntity?: boolean;
  withOperationType?: boolean;
}

const OpExpandableDetails = ({ txHash, opIndex, withEntity, withOperationType }: Props) => {
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
      { withEntity && (
        <>
          <ItemLabel hint="Entity operation type">Entity</ItemLabel>
          <ItemValue>
            <StorageEntity
              entityKey={ data.entity_key }
              isLoading={ isLoading }
              truncation="dynamic"
            />
          </ItemValue>
        </>
      ) }

      { withOperationType && (
        <>
          <ItemLabel hint="Entity operation type">Type</ItemLabel><ItemValue>
            <EntityOpType operation={ data.operation } isLoading={ isLoading }/>
          </ItemValue>
        </>
      ) }

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

      <ItemLabel hint="Cost of this operation">Cost</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ BigNumber(data.cost).div(WEI).toFormat() } { currencyUnits.ether }</Text>
        </Skeleton>
      </ItemValue>

      <ItemDivider/>

      <OperationSpecificData data={ data } isLoading={ isLoading }/>
    </Container>
  );
};

export default OpExpandableDetails;
