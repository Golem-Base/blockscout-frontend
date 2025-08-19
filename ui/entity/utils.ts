import type { GolemBaseCreate, NumericAnnotation, StringAnnotation } from 'golem-base-sdk';
import { Annotation as GolemAnnotation } from 'golem-base-sdk';

import type { Annotation, EntityFormFields } from './types';
import type { FullEntity } from '@golembase/l3-indexer-types';

import hexToUtf8 from 'lib/hexToUtf8';
import { Kb } from 'toolkit/utils/consts';

export const MAX_SIZE = 100 * Kb;

export function generateAnnotationId(): string {
  return Math.random().toString(36);
}

function mapFormAnnotationToGolemAnnotation<T>(annotation: Annotation): GolemAnnotation<T> {
  return new GolemAnnotation(annotation.key, annotation.value as T);
}

function mapApiAnnotationToFormAnnotation(apiAnnotation: { key: string; value: string }): Annotation {
  return {
    id: generateAnnotationId(),
    key: apiAnnotation.key,
    value: apiAnnotation.value,
  };
}

export async function mapEntityFormDataToGolemCreate(formData: EntityFormFields): Promise<GolemBaseCreate> {
  return {
    data: await convertFormDataToUint8Array(formData),
    btl: formData.btl,
    stringAnnotations: formData.stringAnnotations.map(mapFormAnnotationToGolemAnnotation) as Array<StringAnnotation>,
    numericAnnotations: formData.numericAnnotations.map(mapFormAnnotationToGolemAnnotation) as Array<NumericAnnotation>,
  };
}

export function mapFullEntityToFormFields(entity: FullEntity): EntityFormFields {
  return {
    dataText: entity.data ? hexToUtf8(entity.data) : '',
    dataFile: [],
    btl: 1,
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
