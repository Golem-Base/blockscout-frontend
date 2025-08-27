import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { EntityOpQuery } from './types';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { formatBigNum } from 'lib/web3/formatBigNum';
import { Skeleton } from 'toolkit/chakra/skeleton';
import EntityOpType from 'ui/entityOps/EntityOpType';
import CurrencyValue from 'ui/shared/CurrencyValue';
import { Container, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import StorageEntity from 'ui/shared/entities/entity/StorageEntity';

import OperationSpecificData from './OperationSpecificData';

interface Props {
  entityOpQuery: EntityOpQuery;
}

const EntityOpDetails = ({ entityOpQuery }: Props) => {
  const { data, isPlaceholderData: isLoading } = entityOpQuery;

  if (!data) {
    return null;
  }

  return (
    <Container data-testid="entity-details">
      <ItemLabel hint="Unique identifier for entity changed by this operation">Entity Key</ItemLabel>
      <ItemValue>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          <StorageEntity
            entityKey={ data.entity_key }
            isLoading={ isLoading }
            fontWeight={ 600 }
          />
        </Flex>
      </ItemValue>

      <ItemLabel hint="Block number of this operation">Block Number</ItemLabel>
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
        <Text>{ formatBigNum(data.btl) }</Text>
      </ItemValue>

      <OperationSpecificData data={ data } isLoading={ isLoading } withTimestamps/>

      <ItemLabel hint="Gas consumed by this operation">Gas Used</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <Text>{ formatBigNum(data.gas_used || '0') }</Text>
        </Skeleton>
      </ItemValue>

      <ItemLabel hint="Fee paid for this operation">Fee paid</ItemLabel>
      <ItemValue>
        <Skeleton loading={ isLoading }>
          <CurrencyValue
            value={ data.fees_paid }
            decimals={ String(config.chain.currency.decimals) }
            currency={ currencyUnits.ether }
            flexWrap="wrap"
          />
        </Skeleton>
      </ItemValue>
    </Container>
  );
};

export default EntityOpDetails;
