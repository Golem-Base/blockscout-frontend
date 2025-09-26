import type {
  ListEntitiesRequest,
  ListOperationsRequest,
  OperationType,
  PaginationRequest,
} from '@golembase/l3-indexer-types';

export type GolemBaseIndexerOpsFilters = Omit<ListOperationsRequest, 'page'>;

export type FilterOperationType = Exclude<OperationType, 'UNRECOGNIZED'>;

export type GolemBaseIndexerPaginationFilters = Omit<PaginationRequest, 'page'>;

export type GolemBaseIndexerEntitiesFilters = ListEntitiesRequest;
