import { useRouter } from 'next/router';
import React from 'react';

import { EntityStatus } from '@golembase/l3-indexer-types';

import useIsMounted from 'lib/hooks/useIsMounted';
import { generateListStub } from 'stubs/utils';
import EntityResultsBar from 'ui/entity/EntityResultsBar';
import EntityResultsTable from 'ui/entity/EntityResultsTable';
import { ENTITY_RESULT_ITEM } from 'ui/entity/useEntityResultsQuery';
import * as Layout from 'ui/shared/layout/components';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressOwnedEntitiesFilters from './AddressOwnedEntitiesFilters';

interface Props {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
}

const AddressOwnedEntities = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:entities',
    options: {
      enabled: isQueryEnabled,
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
    filters: {
      status: router.query.status as EntityStatus || EntityStatus.ALL,
      owner: router.query.hash as string,
      numeric_annotation_key: router.query.numeric_annotation_key as string,
      numeric_annotation_value: router.query.numeric_annotation_value as string,
      string_annotation_key: router.query.string_annotation_key as string,
      string_annotation_value: router.query.string_annotation_value as string,
    },
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const defaultFilterStatus = router.query.status ? String(router.query.status).toUpperCase() : EntityStatus.ALL;

  return (
    <>
      <AddressOwnedEntitiesFilters isLoading={ isPlaceholderData } defaultFilterStatus={ defaultFilterStatus }/>

      <Layout.Content flexGrow={ 0 }>
        <EntityResultsBar
          data={ data }
          isLoading={ isPlaceholderData }
          isError={ isError }
          pagination={ pagination }
        />

        <EntityResultsTable
          isLoading={ isPlaceholderData }
          isError={ isError }
          data={ data }
        />
      </Layout.Content>
    </>
  );
};

export default AddressOwnedEntities;
