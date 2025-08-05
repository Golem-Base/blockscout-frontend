import type { ApiResource } from '../types';
import type * as golemBaseIndexer from '@golembase/l3-indexer-types';
import type { GolemBaseIndexerOpsFilters } from 'types/api/golemBaseIndexer';

import type { PaginatedResponse } from './paginationConverter';

export const GOLEM_BASE_INDEXER_API_RESOURCES = {
  entity: {
    path: '/api/v1/entities/:key',
    pathParams: [ 'key' as const ],
  },
  entities: {
    path: '/api/v1/entities',
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
} satisfies Record<string, ApiResource>;

export type GolemBaseIndexerApiResourceName = `golemBaseIndexer:${ keyof typeof GOLEM_BASE_INDEXER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiResourcePayload<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:entity' ? golemBaseIndexer.FullEntity :
R extends 'golemBaseIndexer:entities' ? golemBaseIndexer.ListEntitiesResponse :
R extends 'golemBaseIndexer:operations' ? PaginatedResponse<golemBaseIndexer.ListOperationsResponse> :
R extends 'golemBaseIndexer:operationsCount' ? golemBaseIndexer.CountOperationsResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiPaginationFilters<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:operations' ? GolemBaseIndexerOpsFilters :
never;
/* eslint-enable @stylistic/indent */
