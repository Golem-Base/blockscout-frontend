import React from 'react';

import type { GolemBaseIndexerOpsFilters } from 'types/api/golemBaseIndexer';

import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';

import EntityOpsContent from './EntityOpsContent';
import EntityOpsFilter from './EntityOpsFilter';
import useEntityOpsQuery from './useEntityOpsQuery';

type Props = {
  isQueryEnabled?: boolean;
  queryParams: Omit<GolemBaseIndexerOpsFilters, 'operation'>;
};

const EntityOps = ({ isQueryEnabled = true, queryParams }: Props) => {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();

  const { query, filterValue, initialFilterValue, onFilterChange } = useEntityOpsQuery({
    enabled: isQueryEnabled,
    ...queryParams,
  });

  if (!isMounted) {
    return null;
  }

  const filter = (
    <EntityOpsFilter
      initialValue={ initialFilterValue }
      onFilterChange={ onFilterChange }
      hasActiveFilter={ Boolean(filterValue) }
      isLoading={ query.pagination.isLoading }
      queryParams={ queryParams }
    />
  );

  return (
    <>
      { !isMobile && (
        <ActionBar>
          { filter }
          <Pagination { ...query.pagination } ml={ 8 }/>
        </ActionBar>
      ) }
      <EntityOpsContent
        filter={ filter }
        pagination={ query.pagination }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        items={ query.data?.items }
        isPlaceholderData={ query.isPlaceholderData }
        isError={ query.isError }
      />
    </>
  );
};

export default EntityOps;
