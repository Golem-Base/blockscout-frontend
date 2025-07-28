import type { ApiResource } from '../types';
import type * as golemBaseIndexer from 'types/golem-base-indexer-types';

export const GOLEM_BASE_INDEXER_API_RESOURCES = {
  entity: {
    path: '/api/v1/entities/:key',
    pathParams: [ 'key' as const ],
  },
  entities: {
    path: '/api/v1/entities',
  },
} satisfies Record<string, ApiResource>;

export type GolemBaseIndexerApiResourceName = `golemBaseIndexer:${ keyof typeof GOLEM_BASE_INDEXER_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GolemBaseIndexerApiResourcePayload<R extends GolemBaseIndexerApiResourceName> =
R extends 'golemBaseIndexer:entity' ? golemBaseIndexer.FullEntity :
R extends 'golemBaseIndexer:entities' ? golemBaseIndexer.ListEntitiesResponse :
never;
/* eslint-enable @stylistic/indent */
