import { Text, Box, Grid } from '@chakra-ui/react';
import { isUndefined } from 'es-toolkit';
import React from 'react';

import type { EntityHistoryEntry } from '@golembase/l3-indexer-types';
import { OperationType } from '@golembase/l3-indexer-types';

import formatDataSize from 'lib/formatDataSize';
import hexToSize from 'lib/hexToSize';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ItemLabel, ItemValue } from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import RawInputData from 'ui/shared/RawInputData';

interface Props {
  data: EntityHistoryEntry;
  isLoading?: boolean;
  withTimestamps?: boolean;
}

const OperationSpecificData = ({ data, isLoading, withTimestamps }: Props) => {
  const renderValueTransition = (beforeValue: React.ReactNode, afterValue: React.ReactNode) => {
    return (
      <Skeleton loading={ isLoading } display="flex" alignItems="center" gap={ 2 }>
        { beforeValue }
        <IconSvg name="arrows/east" boxSize={ 4 } color="text.secondary"/>
        { afterValue }
      </Skeleton>
    );
  };

  const renderData = (hex?: string) => hex ? (
    <RawInputData
      hex={ hex }
      isLoading={ isLoading }
      defaultDataType="UTF-8"
      rich
    />
  ) : (
    <Skeleton loading={ isLoading }>
      <Text>No data</Text>
    </Skeleton>
  );

  switch (data.operation) {
    case OperationType.CREATE:
      return (
        <>
          <ItemLabel hint="Data associated with this entity">Data</ItemLabel>
          <ItemValue>
            { renderData(data.data) }
          </ItemValue>

          <ItemLabel hint="Size of the data in bytes">Data Size</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <Text>{ formatDataSize(hexToSize(data.data)) }</Text>
            </Skeleton>
          </ItemValue>

          <ItemLabel hint="Block number when this entity expires">Expiration Block</ItemLabel>
          <ItemValue>
            <BlockEntity number={ data.expires_at_block_number } isLoading={ isLoading }/>
          </ItemValue>

          { withTimestamps && (
            <>
              <ItemLabel hint="Date when this entity expires">Expiration Timestamp</ItemLabel>
              <ItemValue>
                <DetailedInfoTimestamp timestamp={ data.expires_at_timestamp } isLoading={ isLoading }/>
              </ItemValue>
            </>
          ) }
        </>
      );

    case OperationType.DELETE:
      return (
        <>
          <ItemLabel hint="Data that was deleted">Before Data</ItemLabel>
          <ItemValue>
            { renderData(data.prev_data) }
          </ItemValue>

          <ItemLabel hint="Size of the deleted data in bytes">Before Data Size</ItemLabel>
          <ItemValue>
            <Skeleton loading={ isLoading }>
              <Text>{ formatDataSize(hexToSize(data.prev_data)) }</Text>
            </Skeleton>
          </ItemValue>

          <ItemLabel hint="Block number when this entity expires">Expiration Block</ItemLabel>
          <ItemValue>
            <BlockEntity number={ data.expires_at_block_number } isLoading={ isLoading }/>
          </ItemValue>

          { withTimestamps && (
            <>
              <ItemLabel hint="Date when this entity expires">Expiration Timestamp</ItemLabel>
              <ItemValue>
                <DetailedInfoTimestamp timestamp={ data.expires_at_timestamp } isLoading={ isLoading }/>
              </ItemValue>
            </>
          ) }
        </>
      );

    case OperationType.UPDATE: {
      return (
        <>
          <ItemLabel hint="Data comparison">Data</ItemLabel>
          <ItemValue>
            <Grid
              templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
              gap={{ base: 4, lg: 6 }}
              w="100%"
            >
              <Box>
                <Text fontWeight="500" mb={ 2 } color="text.secondary">Before</Text>
                { renderData(data.prev_data) }
              </Box>
              <Box>
                <Text fontWeight="500" mb={ 2 } color="text.secondary">After</Text>
                { renderData(data.data) }
              </Box>
            </Grid>
          </ItemValue>

          <ItemLabel hint="Size comparison">Data Size</ItemLabel>
          <ItemValue>
            { renderValueTransition(formatDataSize(hexToSize(data.prev_data)), formatDataSize(hexToSize(data.data))) }
          </ItemValue>

          <ItemLabel hint="Expiration block comparison">Expiration Block</ItemLabel>
          <ItemValue>
            { renderValueTransition(
              !isUndefined(data.prev_expires_at_block_number) ?
                <BlockEntity number={ data.prev_expires_at_block_number } isLoading={ isLoading }/> :
                '-',
              <BlockEntity number={ data.expires_at_block_number } isLoading={ isLoading }/>,
            ) }
          </ItemValue>

          { withTimestamps && (
            <>
              <ItemLabel hint="Expiration timestamp comparison">Expiration Timestamp</ItemLabel>
              <ItemValue>
                { renderValueTransition(
                  !isUndefined(data.prev_expires_at_timestamp) ?
                    <DetailedInfoTimestamp timestamp={ data.prev_expires_at_timestamp } isLoading={ isLoading }/> :
                    '-',
                  <DetailedInfoTimestamp timestamp={ data.expires_at_timestamp } isLoading={ isLoading }/>
                  ,
                ) }
              </ItemValue>
            </>
          ) }
        </>
      );
    }

    case OperationType.EXTEND: {
      return (
        <>
          <ItemLabel hint="Expiration block comparison">Expiration Block</ItemLabel>
          <ItemValue>
            { renderValueTransition(
              !isUndefined(data.prev_expires_at_block_number) ?
                <BlockEntity number={ data.prev_expires_at_block_number } isLoading={ isLoading }/> :
                '-',
              <BlockEntity number={ data.expires_at_block_number } isLoading={ isLoading }/>,
            ) }
          </ItemValue>

          { withTimestamps && (
            <>
              <ItemLabel hint="Expiration timestamp comparison">Expiration Timestamp</ItemLabel>
              <ItemValue>
                { renderValueTransition(
                  !isUndefined(data.prev_expires_at_timestamp) ?
                    <DetailedInfoTimestamp timestamp={ data.prev_expires_at_timestamp } isLoading={ isLoading }/> :
                    '-',
                  <DetailedInfoTimestamp timestamp={ data.expires_at_timestamp } isLoading={ isLoading }/>
                  ,
                ) }
              </ItemValue>
            </>
          ) }
        </>
      );
    }

    default:
      return null;
  };
};

export default OperationSpecificData;
