import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import EntityOps from 'ui/entityOps/EntityOps';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

type Props = {
  opsQuery: QueryWithPagesResult<'golemBaseIndexer:operations'>;
  heightOrHash: string;
};

const BlockEntityOps = ({ opsQuery, heightOrHash }: Props) => {
  const queryParams = { block_number_or_hash: heightOrHash };

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
