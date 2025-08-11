import React from 'react';

import useEntityOpsQuery from 'ui/entityOps/useEntityOpsQuery';

import BlockEntityOps from './BlockEntityOps';

export default function BlocksEntityOpsForTest({ heightOrHash }: { heightOrHash: string }) {
  const blockEntityOpsQuery = useEntityOpsQuery({ filters: { block_number_or_hash: heightOrHash }, enabled: true });
  return (
    <BlockEntityOps opsQuery={ blockEntityOpsQuery } heightOrHash={ heightOrHash }/>
  );
}
