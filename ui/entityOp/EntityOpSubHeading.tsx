import { Box } from '@chakra-ui/react';
import React from 'react';

import EntityOp from 'ui/shared/entities/entityOp/EntityOp';

type Props = {
  txHash: string;
  opIndex: string;
};

const EntityOpSubHeading = ({ txHash, opIndex }: Props) => {
  return (
    <Box display="flex" alignItems="center" w="100%">
      <EntityOp txHash={ txHash } opIndex={ opIndex } noLink noCopy/>
    </Box>
  );
};

export default EntityOpSubHeading;
