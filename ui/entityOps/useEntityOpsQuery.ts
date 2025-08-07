import { useRouter } from 'next/router';

import { OperationType } from '@golembase/l3-indexer-types';
import type { GolemBaseIndexerOpsFilters } from 'types/api/golemBaseIndexer';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import { ENTITY_OPERATION } from 'stubs/entityOps';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const getFilterValue = (getFilterValueFromQuery<OperationType>).bind(null, Object.values(OperationType));

const defaultType = OperationType.CREATE;

interface Props {
  filters: Omit<GolemBaseIndexerOpsFilters, 'operation'>;
  enabled?: boolean;
}

export default function useEntityOpsQuery({ enabled, filters }: Props) {
  const router = useRouter();
  const tab = Array.isArray(router.query.tab) ? router.query.tab[0] : router.query.tab;
  const operationTypeRaw = tab?.replace('entity_ops_', '').toUpperCase();

  const operation = getFilterValue(operationTypeRaw) ?? defaultType;

  return useQueryWithPages({
    resourceName: 'golemBaseIndexer:operations',
    filters: { operation, page_size: '50', ...filters },
    options: {
      enabled: enabled,
      placeholderData: generateListStub<'golemBaseIndexer:operations'>(ENTITY_OPERATION, 50, { next_page_params: {
        page: 2,
        page_size: 50,
      } },
      ),
    },
  });
}
