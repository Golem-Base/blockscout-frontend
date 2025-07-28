import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { formatUnits } from 'viem';

import type { EntityQuery } from './types';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Container, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import CopyToClipboard from '../shared/CopyToClipboard';
import HashStringShortenDynamic from '../shared/HashStringShortenDynamic';

interface Props {
  entityQuery: EntityQuery;
}

const EntityDetails = ({ entityQuery }: Props) => {
  const { data, isPlaceholderData: isLoading } = entityQuery;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Expired': return 'red';
      case 'Deleted': return 'gray';
      default: return 'gray';
    }
  };

  if (!data) {
    return null;
  }

  return (
    <Container>
      <ItemLabel hint="Unique Entity Key" isLoading={ isLoading }>Entity Key</ItemLabel>
      <ItemValue>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          <Skeleton loading={ isLoading } overflow="hidden">
            <HashStringShortenDynamic hash={ data.key }/>
          </Skeleton>
          <CopyToClipboard text={ data.key } isLoading={ isLoading }/>
        </Flex>
      </ItemValue>

      <ItemLabel>Status</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <Badge colorPalette={ getStatusColor(entityQuery.data.status) }>
            { entityQuery.data.status }
          </Badge>
        </Skeleton>
      </ItemValue>

      <ItemLabel>Owner</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <AddressEntity
            address={{
              hash: entityQuery.data.owner,
              name: null,
              is_contract: false,
              is_verified: null,
              ens_domain_name: null,
              implementations: null,
              private_tags: null,
              watchlist_names: null,
              public_tags: null,
            }}
            truncation="constant"
          />
        </Skeleton>
      </ItemValue>

      <ItemLabel>Gas Used</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <Text>{ formatUnits(BigInt(entityQuery.data.gas_used || '0'), 0) }</Text>
        </Skeleton>
      </ItemValue>
    </Container>
  );
};

export default EntityDetails;
