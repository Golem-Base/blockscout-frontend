import { Box, Text } from '@chakra-ui/react';
import { isNull, isUndefined } from 'es-toolkit';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import formatDataSize from 'lib/formatDataSize';
import hexToSize from 'lib/hexToSize';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = Pick<Transaction, 'nonce' | 'type' | 'position'> & {
  queueIndex?: number;
  rawInput?: string;
};

const TxDetailsOther = ({ nonce, type, position, queueIndex, rawInput }: Props) => {
  const txSize = !isUndefined(rawInput) ? formatDataSize(hexToSize(rawInput)) : null;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Other data related to this transaction"
      >
        Other
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        {
          [
            typeof type === 'number' && (
              <Box key="type">
                <span>Txn type: </span>
                <span>{ type }</span>
                { type === 2 && <Text as="span" ml={ 1 } color="text.secondary">(EIP-1559)</Text> }
                { type === 3 && <Text as="span" ml={ 1 } color="text.secondary">(EIP-4844)</Text> }
                { type === 4 && <Text as="span" ml={ 1 } color="text.secondary">(EIP-7702)</Text> }
              </Box>
            ),
            queueIndex !== undefined ? (
              <Box key="queueIndex">
                <span>Queue index: </span>
                <span>{ queueIndex }</span>
              </Box>
            ) : (
              <Box key="nonce">
                <span>Nonce: </span>
                <span>{ nonce }</span>
              </Box>
            ),
            position !== null && position !== undefined && (
              <Box key="position">
                <span>Position: </span>
                <span>{ position }</span>
              </Box>
            ),
            !isNull(txSize) && (
              <Box key="size">
                <Text as="span" fontWeight="500">Size: </Text>
                <Text fontWeight="600" as="span">{ txSize }</Text>
              </Box>
            ),
          ]
            .filter(Boolean)
            .map((item, index) => (
              <React.Fragment key={ index }>
                { index !== 0 && <TextSeparator/> }
                { item }
              </React.Fragment>
            ))
        }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsOther;
