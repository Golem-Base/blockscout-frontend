import type { GolemBaseCreate, GolemBaseExtend } from 'golem-base-sdk';
import { Annotation as GolemAnnotation } from 'golem-base-sdk';

import type { Annotation, EntityFormFields, ExtendEntityFormFields } from './types';
import type { FullEntity } from '@golembase/l3-indexer-types';

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

function formatGolemBaseNumber(value: string): number {
  return value === '0' ? '' as unknown as number : Number(value);
}

export async function mapEntityFormDataToGolemCreate(formData: EntityFormFields): Promise<GolemBaseCreate> {
  return {
    data: await convertFormDataToUint8Array(formData),
    btl: Number(formData.btl),
    stringAnnotations: formData.stringAnnotations.map(annotation => new GolemAnnotation(annotation.key, annotation.value)),
    numericAnnotations: formData.numericAnnotations.map(annotation => new GolemAnnotation(annotation.key, formatGolemBaseNumber(annotation.value))),
  };
}

export async function mapExtendEntityFormDataToGolemExtend(formData: ExtendEntityFormFields): Promise<GolemBaseExtend> {
  return {
    entityKey: formData.entityKey as `0x${ string }`,
    numberOfBlocks: Number(formData.numberOfBlocks),
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

export function mapFullEntityToExtendFormFields(entity: FullEntity): ExtendEntityFormFields {
  return {
    entityKey: entity.key,
    numberOfBlocks: '',
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
