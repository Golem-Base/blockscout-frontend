import type { UseQueryResult } from '@tanstack/react-query';

import type { FullEntity } from '@blockscout/golem-base-indexer-types';

import type { ResourceError } from 'lib/api/resources';

export type EntityQuery = UseQueryResult<FullEntity, ResourceError<unknown>>;
