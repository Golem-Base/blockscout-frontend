import { createListCollection } from '@chakra-ui/react';
import { map } from 'es-toolkit/compat';
import React from 'react';

import { OperationType } from '@golembase/l3-indexer-types';
import type { FilterOperationType, GolemBaseIndexerOpsCountFilters } from 'types/api/golemBaseIndexer';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

import useEntityOpsCountQuery from './useEntityOpsCountQuery';

const LABELS: Record<FilterOperationType, (n: number) => string> = {
  [OperationType.CREATE]: n => `Create Entity (${ n })`,
  [OperationType.UPDATE]: n => `Update Entity (${ n })`,
  [OperationType.EXTEND]: n => `Extend Entity (${ n })`,
  [OperationType.DELETE]: n => `Delete Entity (${ n })`,
};

interface Props {
  hasActiveFilter: boolean;
  initialValue: OperationType;
  onFilterChange: (nextValue: OperationType) => void;
  isLoading?: boolean;
  queryParams: GolemBaseIndexerOpsCountFilters;
}

const EntityOpsFilter = ({ onFilterChange, initialValue, hasActiveFilter, isLoading, queryParams }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleFilterChange = React.useCallback((nextValue: string) => onFilterChange(nextValue as OperationType), [ onFilterChange ]);

  const opsCountQuery = useEntityOpsCountQuery(queryParams);

  const collection = React.useMemo(() => {
    const items = map(LABELS, (label, operation) => {
      const count = opsCountQuery.data[operation as FilterOperationType];
      return {
        value: operation,
        label: label(count),
      };
    });
    return createListCollection({ items });
  }, [ opsCountQuery ]);

  return (
    <PopoverFilterRadio
      name="entity_operations_filter"
      collection={ collection }
      onChange={ handleFilterChange }
      hasActiveFilter={ hasActiveFilter }
      isLoading={ isInitialLoading }
      initialValue={ initialValue }
    />
  );
};

export default React.memo(EntityOpsFilter);
