import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { formatUnits } from 'viem';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Textarea } from 'toolkit/chakra/textarea';
import { Container, ItemLabel, ItemValue, ItemDivider } from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const EntityPageContent = () => {
  const router = useRouter();
  const key = getQueryParamString(router.query.key);

  const entityQuery = useApiQuery('golemBaseIndexer:entity', {
    pathParams: { key },
    queryOptions: {
      enabled: Boolean(key),
    },
  });

  throwOnAbsentParamError(key);
  throwOnResourceLoadError(entityQuery);

  const formatDataSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return 'Unknown';
    const bytes = sizeInBytes;
    if (bytes < 1024) return `${ bytes } bytes`;
    if (bytes < 1024 * 1024) return `${ (bytes / 1024).toFixed(2) } KB`;
    return `${ (bytes / (1024 * 1024)).toFixed(2) } MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Expired': return 'red';
      case 'Deleted': return 'gray';
      default: return 'gray';
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    return dayjs(timestamp).format('llll');
  };

  return (
    <>
      <PageTitle title="Entity Details"/>
      { entityQuery.data && (
        <Container>
          <ItemLabel>Entity Key</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
                { entityQuery.data.key }
              </Text>
            </Skeleton>
          </ItemValue>

          <ItemDivider/>

          <ItemLabel>Entity Data</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Textarea
                value={ entityQuery.data.data || 'No data' }
                readOnly
                fontFamily="mono"
                fontSize="sm"
                minH="100px"
                resize="none"
                width="100%"
              />
            </Skeleton>
          </ItemValue>

          <ItemDivider/>

          <ItemLabel>Size</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Text>{ formatDataSize(entityQuery.data.data_size) }</Text>
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

          <ItemDivider/>

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
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Text>{ formatTimestamp(entityQuery.data.created_at_timestamp) }</Text>
            </Skeleton>
          </ItemValue>

          { entityQuery.data.created_at_tx_hash && (
            <>
              <ItemLabel>Transaction</ItemLabel>
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

          <ItemDivider/>

          <ItemLabel>Expires at Block</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <BlockEntity number={ entityQuery.data.expires_at_block_number }/>
            </Skeleton>
          </ItemValue>

          <ItemLabel>Expires at</ItemLabel>
          <ItemValue>
            <Skeleton loading={ entityQuery.isPlaceholderData }>
              <Text>{ formatTimestamp(entityQuery.data.expires_at_timestamp) }</Text>
            </Skeleton>
          </ItemValue>

          <ItemDivider/>

          { entityQuery.data.string_annotations && entityQuery.data.string_annotations.length > 0 && (
            <>
              <ItemLabel>String Annotations</ItemLabel>
              <ItemValue>
                <Skeleton loading={ entityQuery.isPlaceholderData }>
                  <Box>
                    { entityQuery.data.string_annotations.map((annotation, index) => (
                      <Box key={ index } mb={ 2 }>
                        <Text fontWeight="bold">{ annotation.key }:</Text>
                        <Text>{ annotation.value }</Text>
                      </Box>
                    )) }
                  </Box>
                </Skeleton>
              </ItemValue>
            </>
          ) }

          { entityQuery.data.numeric_annotations && entityQuery.data.numeric_annotations.length > 0 && (
            <>
              <ItemLabel>Numeric Annotations</ItemLabel>
              <ItemValue>
                <Skeleton loading={ entityQuery.isPlaceholderData }>
                  <Box>
                    { entityQuery.data.numeric_annotations.map((annotation, index) => (
                      <Box key={ index } mb={ 2 }>
                        <Text fontWeight="bold">{ annotation.key }:</Text>
                        <Text>{ annotation.value }</Text>
                      </Box>
                    )) }
                  </Box>
                </Skeleton>
              </ItemValue>
            </>
          ) }
        </Container>
      ) }
    </>
  );
};

export default EntityPageContent;
