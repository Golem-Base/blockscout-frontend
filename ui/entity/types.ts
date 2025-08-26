import type { UseQueryResult } from '@tanstack/react-query';

import type { FullEntity } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';

export type EntityQuery = UseQueryResult<FullEntity, ResourceError<unknown>>;

export interface Annotation {
  id: string;
  key: string;
  value: string;
}

export interface EntityFormFields {
  dataText: string;
  dataFile: Array<File>;
  btl: string;
  stringAnnotations: Array<Annotation>;
  numericAnnotations: Array<Annotation>;
}

export interface ExtendEntityFormFields {
  entityKey: string;
  numberOfBlocks: string;
}
