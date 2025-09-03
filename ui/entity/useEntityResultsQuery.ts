import { pick } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { Entity } from '@golembase/l3-indexer-types';
import { EntityStatus } from '@golembase/l3-indexer-types';

import { ENTITY } from 'stubs/entity';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const ENTITY_RESULT_ITEM: Entity = pick(ENTITY, [
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

export default function useEntityResultsQuery() {
  const router = useRouter();

  const pathname = router.pathname;

  const filters = pick(router.query, ENTITY_FILTER_KEYS);

  const query = useQueryWithPages({
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

  return React.useMemo(
    () => ({ query, pathname }),
    [ pathname, query ],
  );
}
