import type {
  ListEntitiesRequest,
  ListOperationsRequest,
  OperationType,
  ListBiggestSpendersRequest,
  ListAddressByEntitiesOwnedRequest,
  ListLargestEntitiesRequest,
  ListEntitiesByBtlRequest,
} from '@golembase/l3-indexer-types';

export type GolemBaseIndexerOpsFilters = Omit<ListOperationsRequest, 'page'>;

export type FilterOperationType = Exclude<OperationType, 'UNRECOGNIZED'>;

export type GolemBaseIndexerSpendersFilters = Omit<ListBiggestSpendersRequest, 'page'>;

export type GolemBaseIndexerEntitiesOwnersFilters = Omit<ListAddressByEntitiesOwnedRequest, 'page'>;

export type GolemBaseIndexerEntitiesFilters = ListEntitiesRequest;

export type GolemBaseIndexerEffectivelyLargestEntitiesFilters = Omit<ListLargestEntitiesRequest, 'page'>;

export type GolemBaseIndexerLongestLivedEntitiesFilters = Omit<ListEntitiesByBtlRequest, 'page'>;
