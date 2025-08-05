import React from 'react';

import { OperationType } from '@golembase/l3-indexer-types';
import type { FilterOperationType, GolemBaseIndexerOpsCountFilters } from 'types/api/golemBaseIndexer';

import useApiQuery from 'lib/api/useApiQuery';

interface ReturnType {
  data: Record<FilterOperationType, number>;
  isFetching: boolean;
}

export default function useEntityOpsCountQuery(queryParams: GolemBaseIndexerOpsCountFilters): ReturnType {
  const query = useApiQuery('golemBaseIndexer:operationsCount', {
    queryParams,
  });

  const data = React.useMemo(() => ({
    [OperationType.CREATE]: Number(query.data?.create_count ?? 0),
    [OperationType.UPDATE]: Number(query.data?.update_count ?? 0),
    [OperationType.EXTEND]: Number(query.data?.extend_count ?? 0),
    [OperationType.DELETE]: Number(query.data?.delete_count ?? 0),
  }), [ query.data ]);

  return {
    data,
    isFetching: query.isFetching,
  };
}
