import type { Attribute } from '@arkiv-network/sdk';

import type { Annotation, ArkivEntityData, ArkivExtendEntity, EntityFormFields, ExtendEntityFormFields } from './types';
import type { MimeType } from '@arkiv-network/sdk/types';
import type { FullEntity } from '@golembase/l3-indexer-types';

import { createPublicClient } from 'lib/golemBase/useGolemBaseClient';
import hexToUtf8 from 'lib/hexToUtf8';
import { Kb } from 'toolkit/utils/consts';

export const MAX_SIZE = 100 * Kb;

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
  const contentType = (formData.dataFile[0]?.type ?? 'text/plain') as MimeType;

  const attributes: Array<Attribute> = [
    ...formData.stringAnnotations.map(annotation => ({ key: annotation.key, value: annotation.value })),
    ...formData.numericAnnotations.map(annotation => ({ key: annotation.key, value: formatGolemBaseNumber(annotation.value) })),
  ];

  return {
    payload,
    attributes,
    contentType,
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

export async function convertBtlToExpiresIn(btl: string): Promise<number> {
  const publicClient = createPublicClient();
  const blockTiming = await publicClient.getBlockTiming();
  return Number(btl) * blockTiming.blockDuration;
}
