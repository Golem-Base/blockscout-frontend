import type {
  ListEntitiesRequest,
  ListOperationsRequest,
  OperationTypeFilter_OperationTypeFilter as OperationTypeFilter,
  PaginationRequest,
} from '@golembase/l3-indexer-types';

export type GolemBaseIndexerOpsFilters = Omit<ListOperationsRequest, 'page'>;

export type FilterOperationType = Exclude<OperationTypeFilter, 'UNRECOGNIZED'>;

export type GolemBaseIndexerPaginationFilters = Omit<PaginationRequest, 'page'>;

export type GolemBaseIndexerEntitiesFilters = ListEntitiesRequest;
