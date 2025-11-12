import type { Attribute } from '@arkiv-network/sdk';
import type { UseQueryResult } from '@tanstack/react-query';

import type { MimeType } from '@arkiv-network/sdk/types';
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
  btl: string;
}

export interface ArkivEntityData {
  payload: Uint8Array;
  attributes: Array<Attribute>;
  contentType: MimeType;
  expiresIn: number;
}

export interface ArkivExtendEntity {
  expiresIn: number;
}
