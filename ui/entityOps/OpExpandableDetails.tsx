import { Box, Grid, HStack } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { formatBigNum } from 'lib/web3/formatBigNum';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  txHash: string;
  opIndex: string;
}

const OpExpandableDetails = ({ txHash, opIndex }: Props) => {
  const operationQuery = useApiQuery('golemBaseIndexer:operation', {
    pathParams: { tx_hash: txHash, op_index: opIndex },
    queryOptions: {
      enabled: Boolean(txHash) && Boolean(opIndex),
    },
  });

  const { data: operation, isLoading } = operationQuery;

  if (!operation) {
    return (
      <Box p={ 4 } color="text.secondary">
        <Skeleton loading={ isLoading }>
          No operation data available.
        </Skeleton>
      </Box>
    );
  }

  return (
    <Box p={ 4 } bg="bg.elevated" borderRadius="md">
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={ 6 }
        fontSize="sm"
      >
        <Box>
          <Box fontWeight="600" mb={ 2 } color="text.secondary">
            Gas Used
          </Box>
          <Skeleton loading={ isLoading } fontWeight="500">
            { formatBigNum(operation.gas_used) }
          </Skeleton>
        </Box>

        <Box>
          <Box fontWeight="600" mb={ 2 } color="text.secondary">
            Sender
          </Box>
          <AddressEntity
            address={{ hash: operation.sender }}
            truncation="constant"
            isLoading={ isLoading }
            noIcon
          />
        </Box>

        <Box>
          <Box fontWeight="600" mb={ 2 } color="text.secondary">
            Timestamp
          </Box>
          <HStack minH="30px" gap={ 0 } color="text.secondary" fontWeight={ 400 }>
            <DetailedInfoTimestamp
              timestamp={ operation.block_timestamp }
              isLoading={ isLoading }
            />
          </HStack>
        </Box>
      </Grid>
    </Box>
  );
};

export default OpExpandableDetails;
