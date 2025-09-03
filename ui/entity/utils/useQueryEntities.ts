import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'golem-base-sdk';

import { createPublicClient } from 'lib/golemBase/useGolemBaseClient';
import { ENTITY_QUERY_ITEM } from 'stubs/entity';

type QueryEntitiesItem = { entityKey: Hex; storageValue: Uint8Array };

export default function useQueryEntities(
  searchTerm: string,
  options?: Omit<
    UseQueryOptions<Array<QueryEntitiesItem>, Error, Array<QueryEntitiesItem>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: [ 'golemBase', 'queryEntities', { searchTerm } ],
    queryFn: async() => {
      const client = createPublicClient();
      return client.queryEntities(searchTerm);
    },
    enabled: options?.enabled !== false && Boolean(searchTerm?.trim()),
    placeholderData: Array(5).fill(ENTITY_QUERY_ITEM),
    ...options,
  });
}
