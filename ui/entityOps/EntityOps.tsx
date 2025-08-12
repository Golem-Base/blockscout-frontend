import { map } from 'es-toolkit/compat';
import React from 'react';

import { OperationType } from '@golembase/l3-indexer-types';
import type { FilterOperationType, GolemBaseIndexerOpsFilters } from 'types/api/golemBaseIndexer';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs';
import { RoutedTabs } from 'toolkit/components/RoutedTabs';
import Pagination from 'ui/shared/pagination/Pagination';

import EntityOpsContent from './EntityOpsContent';
import useEntityOpsQuery from './useEntityOpsQuery';

const TAB_LIST_PROPS = {
  mt: 1,
  mb: { base: 6, lg: 1 },
  py: 5,
};

const TAB_LIST_PROPS_MOBILE = {
  my: 8,
};

const LABELS: Record<FilterOperationType, string> = {
  [OperationType.CREATE]: 'Create',
  [OperationType.UPDATE]: 'Update',
  [OperationType.EXTEND]: 'Extend',
  [OperationType.DELETE]: 'Delete',
};

function operationToTab(operation: string) {
  return `entity_ops_${ operation.toLowerCase() }`;
}

export const ENTITY_OPS_TABS = Object.keys(LABELS).map(operationToTab);

type Props = {
  isQueryEnabled?: boolean;
  queryParams: Omit<GolemBaseIndexerOpsFilters, 'operation'>;
};

const EntityOps = ({ isQueryEnabled = true, queryParams }: Props) => {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();

  const opsCountQuery = useApiQuery('golemBaseIndexer:operationsCount', {
    queryOptions: {
      enabled: isQueryEnabled,
    },
    queryParams,
  });

  const opsQuery = useEntityOpsQuery({ filters: queryParams, enabled: isQueryEnabled });

  const component = React.useMemo(() => (
    <EntityOpsContent
      pagination={ opsQuery.pagination }
      items={ opsQuery.data?.items }
      isPlaceholderData={ opsQuery.isPlaceholderData }
      isError={ opsQuery.isError }
    />
  ), [ opsQuery.pagination, opsQuery.data?.items, opsQuery.isPlaceholderData, opsQuery.isError ]);

  const tabs = React.useMemo(() => map(LABELS, (title, operation): TabItemRegular => {
    const count = opsCountQuery.data ?
      Number(opsCountQuery.data[`${ operation.toLowerCase() as Lowercase<FilterOperationType> }_count`]) :
      null;
    return {
      id: operationToTab(operation),
      title,
      count,
      component,
    };
  }), [ opsCountQuery.data, component ]);

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
