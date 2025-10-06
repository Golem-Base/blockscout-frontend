import { pick } from 'es-toolkit';
import { useRouter } from 'next/router';

import type { Entity } from '@golembase/l3-indexer-types';
import { EntityStatus } from '@golembase/l3-indexer-types';

import { ENTITY } from 'stubs/entity';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

export const ENTITY_RESULT_ITEM: Entity = pick(ENTITY, [
  'key',
  'status',
  'last_updated_at_tx_hash',
  'expires_at_block_number',
]);

export const ENTITY_FILTER_KEYS = [
  'numeric_annotation_key',
  'numeric_annotation_value',
  'string_annotation_key',
  'string_annotation_value',
];

export type EntityFilterKey = typeof ENTITY_FILTER_KEYS[number];

export default function useEntityResultsQuery() {
  const router = useRouter();

  const filters = pick(router.query, ENTITY_FILTER_KEYS);

  return useQueryWithPages({
    resourceName: 'golemBaseIndexer:entities',
    filters: {
      ...filters,
      status: EntityStatus.ACTIVE,
    },
    options: {
      enabled: Object.keys(filters).length > 0,
      placeholderData: generateListStub<'golemBaseIndexer:entities'>(
        ENTITY_RESULT_ITEM,
        5,
        {
          next_page_params: {
            page: 1,
            page_size: 5,
          },
        },
      ),
    },
  });
}
