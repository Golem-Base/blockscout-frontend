import { Text } from '@chakra-ui/react';
import React from 'react';
import { formatUnits } from 'viem';

import type { EntityQuery } from './types';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Container, ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  entityQuery: EntityQuery;
}

const EntityDetails = ({ entityQuery }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Expired': return 'red';
      case 'Deleted': return 'gray';
      default: return 'gray';
    }
  };

  if (!entityQuery.data) {
    return null;
  }

  return (
    <Container>
      <ItemLabel>Entity Key</ItemLabel>
      <ItemValue>
        <Skeleton loading={ entityQuery.isPlaceholderData }>
          <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
            { entityQuery.data.key }
          </Text>
        </Skeleton>
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
