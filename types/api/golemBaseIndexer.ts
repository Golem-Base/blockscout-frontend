import type { CountOperationsRequest, ListOperationsRequest, OperationType, ListBiggestSpendersRequest } from '@golembase/l3-indexer-types';

export type GolemBaseIndexerOpsFilters = Omit<ListOperationsRequest, 'page'>;

export type FilterOperationType = Exclude<OperationType, 'UNRECOGNIZED'>;

export type GolemBaseIndexerSpendersFilters = Omit<ListBiggestSpendersRequest, 'page'>;
