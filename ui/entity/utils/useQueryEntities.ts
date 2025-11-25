import type { QueryOptions, QueryReturnType } from '@arkiv-network/sdk';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { createPublicClient } from 'lib/arkiv/useArkivClient';

export default function useQueryEntities(
  searchTerm: string,
  { searchOptions, ...options }: { searchOptions?: QueryOptions } & Omit<
    UseQueryOptions<QueryReturnType, Error, QueryReturnType>,
    'queryKey' | 'queryFn'
  > = {},
) {
  return useQuery({
    queryKey: [ 'golemBase', 'queryEntities', searchTerm, searchOptions ],
    queryFn: async() => {
      const client = createPublicClient();
      return client.query(searchTerm, searchOptions);
    },
    enabled: options?.enabled !== false && Boolean(searchTerm?.trim()),
    ...options,
  });
}
