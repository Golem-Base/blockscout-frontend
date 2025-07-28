import type { ApiResource } from '../types';
import type * as golemBaseIndexer from '@blockscout/golem-base-indexer-types';

export const GOLEM_BASE_INDEXER_API_RESOURCES = {
  entities: {
    path: '/api/v1/entities',
  },
  entity: {
    path: '/api/v1/entities/:key',
    pathParams: [ 'key' as const ],
  },
} satisfies Record<string, ApiResource>;

export type GolemBaseIndexerApiResourceName = `golemBaseIndexer:${ keyof typeof GOLEM_BASE_INDEXER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiResourcePayload<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:entities' ? golemBaseIndexer.ListEntitiesResponse :
R extends 'golemBaseIndexer:entity' ? golemBaseIndexer.Entity :
never;
/* eslint-enable @stylistic/indent */
