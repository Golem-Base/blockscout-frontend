import type { ApiResource } from '../types';
import type * as golemBaseIndexer from '@golembase/l3-indexer-types';
import type {
  GolemBaseIndexerEntitiesFilters,
  GolemBaseIndexerOpsFilters,
  GolemBaseIndexerPaginationFilters,
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
  longestLivedEntities: {
    path: '/api/v1/leaderboard/entities-by-btl',
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
  largestEntities: {
    path: '/api/v1/leaderboard/largest-entities',
    paginated: true,
  },
  effectivelyLargestEntities: {
    path: '/api/v1/leaderboard/effectively-largest-entities',
    paginated: true,
  },
  entitiesCreated: {
    path: '/api/v1/leaderboard/entities-created',
    paginated: true,
  },
  customContractTransactions: {
    path: '/api/v1/transactions/custom-contract',
    paginated: true,
  },
  addressLeaderboardRanks: {
    path: '/api/v1/address/:address/leaderboard-ranks',
    pathParams: [ 'address' as const ],
  },
  chart: {
    path: '/api/v1/chart/:id',
    pathParams: [ 'id' as const ],
  },
  entityDataHistogram: {
    path: '/api/v1/chart/entity-data-histogram',
  },
} satisfies Record<string, ApiResource>;

export type GolemBaseIndexerApiResourceName = `golemBaseIndexer:${ keyof typeof GOLEM_BASE_INDEXER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiResourcePayload<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:entity' ? golemBaseIndexer.FullEntity :
R extends 'golemBaseIndexer:entities' ? PaginatedResponse<golemBaseIndexer.ListEntitiesResponse> :
R extends 'golemBaseIndexer:operation' ? golemBaseIndexer.EntityHistoryEntry :
R extends 'golemBaseIndexer:operations' ? PaginatedResponse<golemBaseIndexer.ListOperationsResponse> :
R extends 'golemBaseIndexer:operationsCount' ? golemBaseIndexer.CountOperationsResponse :
R extends 'golemBaseIndexer:biggestSpenders' ? PaginatedResponse<golemBaseIndexer.LeaderboardBiggestSpendersResponse> :
R extends 'golemBaseIndexer:entitiesOwned' ? PaginatedResponse<golemBaseIndexer.LeaderboardEntitiesOwnedResponse> :
R extends 'golemBaseIndexer:longestLivedEntities' ? PaginatedResponse<golemBaseIndexer.LeaderboardEntitiesByBtlResponse> :
R extends 'golemBaseIndexer:addressStats' ? golemBaseIndexer.AddressStatsResponse :
R extends 'golemBaseIndexer:entitiesCount' ? golemBaseIndexer.CountEntitiesResponse :
R extends 'golemBaseIndexer:blockStats' ? golemBaseIndexer.BlockStatsResponse :
R extends 'golemBaseIndexer:largestEntities' ? PaginatedResponse<golemBaseIndexer.LeaderboardLargestEntitiesResponse> :
R extends 'golemBaseIndexer:effectivelyLargestEntities' ? PaginatedResponse<golemBaseIndexer.LeaderboardEffectivelyLargestEntitiesResponse> :
R extends 'golemBaseIndexer:entitiesCreated' ? PaginatedResponse<golemBaseIndexer.LeaderboardEntitiesCreatedResponse> :
R extends 'golemBaseIndexer:customContractTransactions' ? PaginatedResponse<golemBaseIndexer.ListCustomContractTransactionsResponse> :
R extends 'golemBaseIndexer:addressLeaderboardRanks' ? golemBaseIndexer.AddressLeaderboardRanksResponse :
R extends 'golemBaseIndexer:chart' ? golemBaseIndexer.ChartResponse :
R extends 'golemBaseIndexer:entityDataHistogram' ? golemBaseIndexer.GetEntityDataHistogramResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiPaginationFilters<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:operations' ? GolemBaseIndexerOpsFilters :
R extends 'golemBaseIndexer:biggestSpenders' ? GolemBaseIndexerPaginationFilters :
R extends 'golemBaseIndexer:entitiesOwned' ? GolemBaseIndexerPaginationFilters :
R extends 'golemBaseIndexer:longestLivedEntities' ? GolemBaseIndexerPaginationFilters :
R extends 'golemBaseIndexer:entities' ? GolemBaseIndexerEntitiesFilters :
R extends 'golemBaseIndexer:largestEntities' ? GolemBaseIndexerPaginationFilters :
R extends 'golemBaseIndexer:effectivelyLargestEntities' ? GolemBaseIndexerPaginationFilters :
R extends 'golemBaseIndexer:entitiesCreated' ? GolemBaseIndexerPaginationFilters :
never;
/* eslint-enable @stylistic/indent */
