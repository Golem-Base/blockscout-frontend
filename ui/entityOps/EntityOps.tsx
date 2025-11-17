import type { UseQueryResult } from '@tanstack/react-query';
import { map, sum } from 'es-toolkit/compat';
import React from 'react';

import type { CountOperationsResponse } from '@golembase/l3-indexer-types';
import { OperationTypeFilter_OperationTypeFilter as OperationType } from '@golembase/l3-indexer-types';
import type { FilterOperationType } from 'types/api/golemBaseIndexer';

import type { ResourceError, ResourcePayload } from 'lib/api/resources';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs';
import { RoutedTabs } from 'toolkit/components/RoutedTabs';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import EntityOpsContent from './EntityOpsContent';

const TAB_LIST_PROPS = {
  mt: 1,
  mb: { base: 6, lg: 1 },
  py: 5,
};

const TAB_LIST_PROPS_MOBILE = {
  my: 8,
};

const LABELS: Record<FilterOperationType, string> = {
  [OperationType.ALL]: 'All',
  [OperationType.CREATE]: 'Create',
  [OperationType.UPDATE]: 'Update',
  [OperationType.EXTEND]: 'Extend',
  [OperationType.DELETE]: 'Delete',
  [OperationType.CHANGEOWNER]: 'Change Owner',
};

function operationToTab(operation: string) {
  return `entity_ops_${ operation.toLowerCase() }`;
}

export const ENTITY_OPS_TABS = Object.keys(LABELS).map(operationToTab);

type Props = {
  isQueryEnabled?: boolean;
  opsQuery: QueryWithPagesResult<'golemBaseIndexer:operations'>;
  opsCountQuery: UseQueryResult<ResourcePayload<'golemBaseIndexer:operationsCount'>, ResourceError<unknown>>;
};

const EntityOps = ({ opsQuery, opsCountQuery }: Props) => {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();

  const component = React.useMemo(() => (
    <EntityOpsContent
      pagination={ opsQuery.pagination }
      items={ opsQuery.data?.items }
      isPlaceholderData={ opsQuery.isPlaceholderData }
      isError={ opsQuery.isError }
    />
  ), [ opsQuery.pagination, opsQuery.data?.items, opsQuery.isPlaceholderData, opsQuery.isError ]);

  const tabs = React.useMemo(() => map(LABELS, (title, operation): TabItemRegular => {
    const operationType = operation.toLowerCase() as Lowercase<FilterOperationType>;
    const key: keyof CountOperationsResponse = `${ operationType }_count` as keyof CountOperationsResponse;
    const count = opsCountQuery?.data ? Number(opsCountQuery?.data[key]) : null;
    const countAll = opsCountQuery?.data ? sum(Object.values(opsCountQuery?.data).map(Number)) : null;

    return {
      id: operationToTab(operation),
      title,
      count: operation === OperationType.ALL ? countAll : count,
      component,
    };
  }), [ opsCountQuery?.data, component ]);

  if (!isMounted) {
    return null;
  }

  const rightSlot = !isMobile && (
    <Pagination { ...opsQuery.pagination } ml={ 8 }/>
  );

  return (
    <RoutedTabs
      tabs={ tabs }
      variant="secondary"
      size="sm"
      listProps={ isMobile ? TAB_LIST_PROPS_MOBILE : TAB_LIST_PROPS }
      rightSlot={ rightSlot }
      stickyEnabled={ !isMobile }
      isLoading={ opsCountQuery.isLoading || opsQuery.isLoading }
    />
  );
};

export default EntityOps;
