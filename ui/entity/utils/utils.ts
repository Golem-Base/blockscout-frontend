import type { Attribute } from '@arkiv-network/sdk';

import type {
  Annotation,
  ArkivEntityData,
  ArkivExtendEntity,
  EntityFormFields,
  ExtendEntityFormFields,
  MimeType,
} from './types';
import type { FullEntity } from '@golembase/l3-indexer-types';

import { createPublicClient } from 'lib/golemBase/useGolemBaseClient';
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

// @TODO: check if remove can
function formatGolemBaseNumber(value: string): number {
  return value === '0' ? '' as unknown as number : Number(value);
}

export async function mapEntityFormDataToArkivCreate(formData: EntityFormFields): Promise<ArkivEntityData> {
  const payload = await convertFormDataToUint8Array(formData);

  const attributes: Array<Attribute> = [
    ...formData.stringAnnotations.map(annotation => ({ key: annotation.key, value: annotation.value })),
    ...formData.numericAnnotations.map(annotation => ({ key: annotation.key, value: formatGolemBaseNumber(annotation.value) })),
  ];

  return {
    payload,
    attributes,
    contentType: getMimeType(formData.dataFile[0]),
    expiresIn: await convertBtlToExpiresIn(formData.btl),
  };
}

export async function mapExtendEntityFormDataToArkivExtend(formData: ExtendEntityFormFields): Promise<ArkivExtendEntity> {
  return {
    expiresIn: await convertBtlToExpiresIn(formData.btl),
  };
}

export function mapFullEntityToFormFields(entity: FullEntity): EntityFormFields {
  return {
    dataText: entity.data ? hexToUtf8(entity.data) : '',
    dataFile: [],
    btl: '',
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

async function convertBtlToExpiresIn(btl: string): Promise<number> {
  const publicClient = createPublicClient();
  const blockTiming = await publicClient.getBlockTiming();
  return Number(btl) * blockTiming.blockDuration;
}

function getMimeType(file?: File): MimeType {
  if (file && MIME_TYPES.includes(file.type)) {
    return file.type as MimeType;
  }

  return 'text/plain';
}
