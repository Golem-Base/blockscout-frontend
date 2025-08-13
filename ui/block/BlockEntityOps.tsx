import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import EntityOps from 'ui/entityOps/EntityOps';
import useEntityOpsQuery from 'ui/entityOps/useEntityOpsQuery';

type Props = {
  heightOrHash: string;
};

const BlockEntityOps = ({ heightOrHash }: Props) => {
  const queryParams = { block_number_or_hash: heightOrHash };

  const opsQuery = useEntityOpsQuery({ filters: { block_number_or_hash: heightOrHash }, enabled: true });
  const opsCountQuery = useApiQuery('golemBaseIndexer:operationsCount', {
    queryOptions: {
      enabled: true,
    },
    queryParams,
  });

  return (
    <EntityOps
      opsQuery={ opsQuery }
      opsCountQuery={ opsCountQuery }
    />
  );
};

export default BlockEntityOps;
