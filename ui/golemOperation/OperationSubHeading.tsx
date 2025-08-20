import { Box } from '@chakra-ui/react';
import React from 'react';

import TxEntity from 'ui/shared/entities/tx/TxEntity';

type Props = {
  txHash: string;
  opIndex: string;
};

const OperationSubHeading = ({ txHash, opIndex }: Props) => {
  return (
    <Box display="flex" alignItems="center" w="100%">
      <TxEntity hash={ txHash } truncation="none"/>, index { opIndex }
    </Box>
  );
};

export default OperationSubHeading;
