import type { UseQueryResult } from '@tanstack/react-query';

import type { FullEntity } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';

export type EntityQuery = UseQueryResult<FullEntity, ResourceError<unknown>>;

export interface Annotation<T> {
  key: string;
  value: T;
}

export interface EntityFormFields {
  dataText: string;
  dataFile: Array<File>;
  btl: number;
  stringAnnotations: Array<Annotation<string>>;
  numericAnnotations: Array<Annotation<number>>;
}
