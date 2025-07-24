import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { formatUnits } from 'viem';

import type { Entity } from 'types/api/entity';

import { useAppContext } from 'lib/contexts/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Badge } from 'toolkit/chakra/badge';
import { Textarea } from 'toolkit/chakra/textarea';
import { Container, ItemLabel, ItemValue, ItemDivider } from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const mockEntityData: Entity = {
  key: '0xc9e98b00f26835a3a6de7d268e5f64dba739e3730e52b84019f1bb4e73ed2296',
  data: '0x757064617465642064617461207769746820616e6e6f746174696f6e73',
  data_size: '29',
  status: 'ACTIVE',
  string_annotations: [
    {
      key: 'key',
      value: 'updated',
    },
  ],
  numeric_annotations: [
    {
      key: 'updated',
      value: '1',
    },
  ],
  created_at_tx_hash: '0x385ae37be55f8e28678afeaccb594ad0a25e013746c5250df31df5d1a1df5806',
  created_at_operation_index: '0',
  created_at_block_number: '4',
  created_at_timestamp: '2025-07-22T11:31:32+00:00',
  expires_at_block_number: '2006',
  expires_at_timestamp: '2025-07-22T15:24:17+00:00',
  owner: '0xD29Bb1a1a0F6D2783306a8618b3a5b58CB313152',
  gas_used: '0',
  fees_paid: '0',
};

const EntityPageContent = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const appProps = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chain } = useMultichainContext() || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const key = getQueryParamString(router.query.key);

  const entityData = mockEntityData;

  const formatDataSize = (sizeInBytes: string) => {
    const bytes = parseInt(sizeInBytes);
    if (bytes < 1024) return `${ bytes } bytes`;
    if (bytes < 1024 * 1024) return `${ (bytes / 1024).toFixed(2) } KB`;
    return `${ (bytes / (1024 * 1024)).toFixed(2) } MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'EXPIRED': return 'red';
      case 'DELETED': return 'gray';
      default: return 'gray';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return dayjs(timestamp).format('llll');
  };

  return (
    <>
      <PageTitle title="Entity Details"/>

      <Container>
        <ItemLabel>Entity Key</ItemLabel>
        <ItemValue>
          <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
            { entityData.key }
          </Text>
        </ItemValue>

        <ItemDivider/>

        <ItemLabel>Entity Data</ItemLabel>
        <ItemValue>
          <Textarea
            value={ entityData.data }
            readOnly
            fontFamily="mono"
            fontSize="sm"
            minH="100px"
            resize="none"
            width="100%"
          />
        </ItemValue>

        <ItemDivider/>

        <ItemLabel>Size</ItemLabel>
        <ItemValue>
          <Text>{ formatDataSize(entityData.data_size) }</Text>
        </ItemValue>

        <ItemLabel>Status</ItemLabel>
        <ItemValue>
          <Badge colorPalette={ getStatusColor(entityData.status) }>
            { entityData.status }
          </Badge>
        </ItemValue>

        <ItemLabel>Owner</ItemLabel>
        <ItemValue>
          <AddressEntity
            address={{
              hash: entityData.owner,
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
        </ItemValue>

        <ItemLabel>Gas Used</ItemLabel>
        <ItemValue>
          <Text>{ formatUnits(BigInt(entityData.gas_used), 0) }</Text>
        </ItemValue>

        <ItemDivider/>

        <ItemLabel>Created at Block</ItemLabel>
        <ItemValue>
          <BlockEntity number={ parseInt(entityData.created_at_block_number) }/>
        </ItemValue>

        <ItemLabel>Created at</ItemLabel>
        <ItemValue>
          <Text>{ formatTimestamp(entityData.created_at_timestamp) }</Text>
        </ItemValue>

        <ItemLabel>Transaction</ItemLabel>
        <ItemValue>
          <TxEntity hash={ entityData.created_at_tx_hash }/>
        </ItemValue>

        <ItemLabel>Operation Index</ItemLabel>
        <ItemValue>
          <Text>({ entityData.created_at_operation_index })</Text>
        </ItemValue>

        <ItemDivider/>

        <ItemLabel>Expires at Block</ItemLabel>
        <ItemValue>
          <BlockEntity number={ parseInt(entityData.expires_at_block_number) }/>
        </ItemValue>

        <ItemLabel>Expires at</ItemLabel>
        <ItemValue>
          <Text>{ formatTimestamp(entityData.expires_at_timestamp) }</Text>
        </ItemValue>

        <ItemDivider/>

        { entityData.string_annotations.length > 0 && (
          <>
            <ItemLabel>String Annotations</ItemLabel>
            <ItemValue>
              <Box>
                { entityData.string_annotations.map((annotation, index) => (
                  <Box key={ index } mb={ 2 }>
                    <Text fontWeight="bold">{ annotation.key }:</Text>
                    <Text>{ annotation.value }</Text>
                  </Box>
                )) }
              </Box>
            </ItemValue>
          </>
        ) }

        { entityData.numeric_annotations.length > 0 && (
          <>
            <ItemLabel>Numeric Annotations</ItemLabel>
            <ItemValue>
              <Box>
                { entityData.numeric_annotations.map((annotation, index) => (
                  <Box key={ index } mb={ 2 }>
                    <Text fontWeight="bold">{ annotation.key }:</Text>
                    <Text>{ annotation.value }</Text>
                  </Box>
                )) }
              </Box>
            </ItemValue>
          </>
        ) }
      </Container>
    </>
  );
};

export default EntityPageContent;
