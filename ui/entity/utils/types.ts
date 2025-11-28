import type { Attribute, Address } from '@arkiv-network/sdk';
import type { UseQueryResult } from '@tanstack/react-query';

import type { FullEntity } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';

import type { MIME_TYPES } from './utils';

export type EntityQuery = UseQueryResult<FullEntity, ResourceError<unknown>>;

export type MimeType = typeof MIME_TYPES[number];

export interface Annotation {
  id: string;
  key: string;
  value: string;
}

export interface EntityFormFields {
  expirationDate: string;
  dataText: string;
  dataFile: Array<File>;
  stringAnnotations: Array<Annotation>;
  numericAnnotations: Array<Annotation>;
}

export interface ExtendEntityFormFields {
  expirationDate: string;
}

export interface ChangeEntityOwnerFormFields {
  newOwner: Address;
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

export interface ArkivChangeEntityOwner {
  newOwner: Address;
}
