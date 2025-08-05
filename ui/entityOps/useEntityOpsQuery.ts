import { useRouter } from 'next/router';
import React from 'react';

import { OperationType } from '@golembase/l3-indexer-types';
import type { GolemBaseIndexerOpsFilters } from 'types/api/golemBaseIndexer';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import { ENTITY_OPERATION } from 'stubs/entityOps';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const getFilterValue = (getFilterValueFromQuery<OperationType>).bind(null, Object.values(OperationType));

const defaultType = OperationType.CREATE;

interface Props extends Omit<GolemBaseIndexerOpsFilters, 'operation'> {
  enabled: boolean;
}

export default function useEntityOpsQuery({ enabled, ...filters }: Props) {
  const router = useRouter();

  const initialFilterValue = getFilterValue(router.query.filter) ?? defaultType;
  const [ filterValue, setFilterValue ] = React.useState<OperationType>(initialFilterValue);

  const query = useQueryWithPages({
    resourceName: 'golemBaseIndexer:operations',
    filters: { operation: filterValue, page_size: '50', ...filters },
    options: {
      enabled: enabled,
      placeholderData: generateListStub<'golemBaseIndexer:operations'>(ENTITY_OPERATION, 50, { next_page_params: {
        page: 2,
        page_size: 50,
      } },
      ),
    },
  });

  const onFilterChange = React.useCallback((val: string | Array<string>) => {
    const newVal = getFilterValue(val) ?? defaultType;
    setFilterValue(newVal);
    query.onFilterChange({ operation: newVal });
  }, [ query ]);

  return React.useMemo(() => ({
    query,
    filterValue,
    initialFilterValue,
    onFilterChange,
  }), [ query, filterValue, initialFilterValue, onFilterChange ]);
}
