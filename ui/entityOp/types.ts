import type { UseQueryResult } from '@tanstack/react-query';

import type { EntityHistoryEntry } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';

export type EntityOpQuery = UseQueryResult<EntityHistoryEntry, ResourceError<unknown>>;
