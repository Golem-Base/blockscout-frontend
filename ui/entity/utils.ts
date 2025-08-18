import type { GolemBaseCreate } from 'golem-base-sdk';
import { Annotation as GolemAnnotation } from 'golem-base-sdk';

import type { Annotation, EntityFormFields } from './types';
import type { FullEntity } from '@golembase/l3-indexer-types';

import hexToUtf8 from 'lib/hexToUtf8';
import { Kb } from 'toolkit/utils/consts';

export const MAX_SIZE = 100 * Kb;

export async function mapEntityFormData(formData: EntityFormFields): Promise<GolemBaseCreate> {
  return {
    data: await getUint8Array(formData),
    btl: formData.btl,
    stringAnnotations: formData.stringAnnotations.map(mapAnnotation),
    numericAnnotations: formData.numericAnnotations.map(mapAnnotation),
  };
}

export function mapFullEntityData(entity: FullEntity): EntityFormFields {
  return {
    dataText: entity.data ? hexToUtf8(entity.data) : '',
    dataFile: [],
    btl: 1,
    stringAnnotations: entity.string_annotations,
    numericAnnotations: entity.numeric_annotations.map(annotation => ({
      key: annotation.key,
      value: Number(annotation.value),
    })),
  };
}

async function getUint8Array(formData: EntityFormFields): Promise<Uint8Array> {
  if (formData.dataFile.length > 0) {
    const arrayBuffer = await formData.dataFile[0].arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  const encoder = new TextEncoder();
  return encoder.encode(formData.dataText);
}

function mapAnnotation<T>(annotation: Annotation<T>): GolemAnnotation<T> {
  return new GolemAnnotation(annotation.key, annotation.value);
}
