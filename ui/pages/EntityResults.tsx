import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import EntityResultsBar from 'ui/entity/EntityResultsBar';
import EntityResultsTable from 'ui/entity/EntityResultsTable';
import useEntityResultsQuery from 'ui/entity/useEntityResultsQuery';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

const EntityResults = () => {
  const { query } = useEntityResultsQuery();
  const appProps = useAppContext();

  const backLink = React.useMemo(() => {
    if (appProps?.referrer?.startsWith(window.location.origin)) {
      return {
        label: 'Back to Entity',
        url: appProps.referrer,
      };
    }

    return;
  }, [ appProps.referrer ]);

  if (!query?.data) {
    return null;
  }

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
              <PageTitle title="Entity results" backLink={ backLink }/>
              <EntityResultsBar
                data={ query.data }
                isLoading={ query.isPlaceholderData }
                isError={ query.isError }
                pagination={ query.pagination }
              />

              <EntityResultsTable
                isLoading={ query.isPlaceholderData }
                isError={ query.isError }
                pagination={ query.pagination }
                data={ query.data }
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
