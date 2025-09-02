import { useRouter } from 'next/router';
import React from 'react';

import EntityResultsBar from 'ui/entity/EntityResultsBar';
import EntityResultsTable from 'ui/entity/EntityResultsTable';
import useEntityResultsQuery, {
  ENTITY_FILTER_KEYS,
} from 'ui/entity/useEntityResultsQuery';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

const EntityResults = () => {
  const { query } = useEntityResultsQuery();
  const router = useRouter();

  const searchTerm =
    router.query &&
    Object.entries(router.query)
      .filter(([ key ]) => ENTITY_FILTER_KEYS.includes(key))
      .map(([ key, value ]) => `${ key }: ${ value }`)
      .join(', ');

  return (
    <>
      <HeaderMobile hideSearchBar/>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn>
          <HeaderAlert/>
          <HeaderDesktop hideSearchBar/>
          <AppErrorBoundary>
            <Layout.Content flexGrow={ 0 }>
              <PageTitle title="Entity results"/>
              <EntityResultsBar
                data={ query?.data }
                isLoading={ query?.isLoading }
                isError={ query?.isError }
                pagination={ query?.pagination }
                searchTerm={ searchTerm }
              />

              <EntityResultsTable
                isLoading={ query?.isLoading }
                isError={ query?.isError }
                pagination={ query?.pagination }
                data={ query?.data }
              />
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </>
  );
};

export default EntityResults;
