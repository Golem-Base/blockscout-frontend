import type { CountOperationsRequest, ListOperationsRequest, OperationType } from '@golembase/l3-indexer-types';

export type GolemBaseIndexerOpsFilters = Omit<ListOperationsRequest, 'page'>;

export type GolemBaseIndexerOpsCountFilters = Omit<CountOperationsRequest, 'page'>;

export type FilterOperationType = Exclude<OperationType, 'UNRECOGNIZED'>;
