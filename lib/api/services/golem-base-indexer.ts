import type { ApiResource } from '../types';
import type * as golemBaseIndexer from '@golembase/l3-indexer-types';
import type {
  GolemBaseIndexerEffectivelyLargestEntitiesFilters,
  GolemBaseIndexerEntitiesFilters,
  GolemBaseIndexerEntitiesOwnersFilters, GolemBaseIndexerOpsFilters, GolemBaseIndexerSpendersFilters,
} from 'types/api/golemBaseIndexer';

import type { PaginatedResponse } from './paginationConverter';

export const GOLEM_BASE_INDEXER_API_RESOURCES = {
  entity: {
    path: '/api/v1/entity/:key',
    pathParams: [ 'key' as const ],
  },
  entities: {
    path: '/api/v1/entities',
    paginated: true,
    pathParams: [
      'status' as const,
      'string_annotation_key' as const,
      'string_annotation_value' as const,
      'numeric_annotation_key' as const,
      'numeric_annotation_value' as const,
    ],
  },
  entitiesCount: {
    path: '/api/v1/entities/count',
    pathParams: [
      'status' as const,
      'string_annotation_key' as const,
      'string_annotation_value' as const,
      'numeric_annotation_key' as const,
      'numeric_annotation_value' as const,
    ],
  },
  operation: {
    path: '/api/v1/operation/:tx_hash/:op_index',
    pathParams: [ 'tx_hash' as const, 'op_index' as const ],
  },
  operations: {
    path: '/api/v1/operations',
    filterFields: [ 'operation' as const, 'block_hash' as const, 'transaction_hash' as const, 'sender' as const, 'entity_key' as const ],
    paginated: true,
  },
  operationsCount: {
    path: '/api/v1/operations/count',
    filterFields: [ 'operation' as const, 'block_hash' as const, 'transaction_hash' as const, 'sender' as const, 'entity_key' as const ],
  },
  biggestSpenders: {
    path: '/api/v1/leaderboard/biggest-spenders',
    paginated: true,
  },
  entitiesOwned: {
    path: '/api/v1/leaderboard/entities-owned',
    paginated: true,
  },
  addressStats: {
    path: '/api/v1/address/:address/stats',
    pathParams: [ 'address' as const ],
  },
  blockStats: {
    path: '/api/v1/block/:block/stats',
    pathParams: [ 'block' as const ],
  },
  effectivelyLargestEntities: {
    path: '/api/v1/leaderboard/largest-entities',
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type GolemBaseIndexerApiResourceName = `golemBaseIndexer:${ keyof typeof GOLEM_BASE_INDEXER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiResourcePayload<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:entity' ? golemBaseIndexer.FullEntity :
R extends 'golemBaseIndexer:entities' ? PaginatedResponse<golemBaseIndexer.ListEntitiesResponse> :
R extends 'golemBaseIndexer:operation' ? golemBaseIndexer.Operation :
R extends 'golemBaseIndexer:operations' ? PaginatedResponse<golemBaseIndexer.ListOperationsResponse> :
R extends 'golemBaseIndexer:operationsCount' ? golemBaseIndexer.CountOperationsResponse :
R extends 'golemBaseIndexer:biggestSpenders' ? PaginatedResponse<golemBaseIndexer.ListBiggestSpendersResponse> :
R extends 'golemBaseIndexer:entitiesOwned' ? PaginatedResponse<golemBaseIndexer.ListAddressByEntitiesOwnedResponse> :
R extends 'golemBaseIndexer:addressStats' ? golemBaseIndexer.AddressStatsResponse :
R extends 'golemBaseIndexer:entitiesCount' ? golemBaseIndexer.CountEntitiesResponse :
R extends 'golemBaseIndexer:blockStats' ? golemBaseIndexer.BlockStatsResponse :
R extends 'golemBaseIndexer:effectivelyLargestEntities' ? PaginatedResponse<golemBaseIndexer.ListLargestEntitiesResponse> :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiPaginationFilters<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:operations' ? GolemBaseIndexerOpsFilters :
R extends 'golemBaseIndexer:biggestSpenders' ? GolemBaseIndexerSpendersFilters :
R extends 'golemBaseIndexer:entitiesOwned' ? GolemBaseIndexerEntitiesOwnersFilters :
R extends 'golemBaseIndexer:entities' ? GolemBaseIndexerEntitiesFilters :
R extends 'golemBaseIndexer:effectivelyLargestEntities' ? GolemBaseIndexerEffectivelyLargestEntitiesFilters :
never;
/* eslint-enable @stylistic/indent */
