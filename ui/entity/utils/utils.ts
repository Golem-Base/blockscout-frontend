import type { Attribute } from '@arkiv-network/sdk';
import { ExpirationTime } from '@arkiv-network/sdk/utils';

import type {
  Annotation,
  ArkivEntityData,
  ArkivExtendEntity,
  EntityFormFields,
  ExtendEntityFormFields,
  MimeType,
} from './types';
import type { FullEntity } from '@golembase/l3-indexer-types';

import dayjs from 'lib/date/dayjs';
import hexToUtf8 from 'lib/hexToUtf8';
import { Kb } from 'toolkit/utils/consts';

export const MAX_SIZE = 100 * Kb;

// MimeType from @arkiv-network/sdk
export const MIME_TYPES = [
  'text/plain', 'text/html', 'text/css', 'text/csv', 'text/xml', 'text/javascript',
  'application/json', 'application/xml', 'application/pdf', 'application/zip',
  'application/gzip', 'application/octet-stream', 'application/javascript',
  'application/x-www-form-urlencoded', 'image/png', 'image/jpeg', 'image/webp',
  'image/gif', 'image/svg+xml', 'audio/mpeg', 'audio/wav', 'audio/ogg',
  'video/mp4', 'video/webm', 'video/ogg', 'multipart/form-data',
] as const;

export function generateAnnotationId(): string {
  return Math.random().toString(36);
}

function mapApiAnnotationToFormAnnotation(apiAnnotation: { key: string; value: string }): Annotation {
  return {
    id: generateAnnotationId(),
    key: apiAnnotation.key,
    value: apiAnnotation.value,
  };
}

export async function mapEntityFormDataToArkivCreate(formData: EntityFormFields): Promise<ArkivEntityData> {
  const payload = await convertFormDataToUint8Array(formData);

  const attributes: Array<Attribute> = [
    ...formData.stringAnnotations.map(annotation => ({ key: annotation.key, value: annotation.value })),
    ...formData.numericAnnotations.map(annotation => ({ key: annotation.key, value: Number(annotation.value) })),
  ];

  return {
    payload,
    attributes,
    contentType: getMimeType(formData.dataFile[0]),
    expiresIn: ExpirationTime.fromDate(new Date(formData.expirationDate)),
  };
}

export async function mapExtendEntityFormDataToArkivExtend(formData: ExtendEntityFormFields): Promise<ArkivExtendEntity> {
  return {
    expiresIn: ExpirationTime.fromDate(new Date(formData.expirationDate)),
  };
}

export const FORMAT_DATE_TIME = 'YYYY-MM-DDTHH:mm';

export function mapFullEntityToFormFields(entity: FullEntity): EntityFormFields {
  return {
    dataText: entity.data ? hexToUtf8(entity.data) : '',
    dataFile: [],
    expirationDate: entity.expires_at_timestamp ? dayjs(entity.expires_at_timestamp).format(FORMAT_DATE_TIME) : '',
    stringAnnotations: entity.string_annotations.map(mapApiAnnotationToFormAnnotation),
    numericAnnotations: entity.numeric_annotations.map(mapApiAnnotationToFormAnnotation),
  };
}

async function convertFormDataToUint8Array(formData: EntityFormFields): Promise<Uint8Array> {
  if (formData.dataFile.length > 0) {
    const arrayBuffer = await formData.dataFile[0].arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  const encoder = new TextEncoder();
  return encoder.encode(formData.dataText);
}

function getMimeType(file?: File): MimeType {
  if (file) {
    if (MIME_TYPES.includes(file.type)) {
      return file.type as MimeType;
    }
    // If file exists but type is not recognized, treat as binary
    return 'application/octet-stream';
  }

  // No file provided, using text input - default to text/plain
  return 'text/plain';
}
