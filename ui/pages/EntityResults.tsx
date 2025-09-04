import { useRouter } from 'next/router';
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
  const { data, isPlaceholderData, isError, pagination } = useEntityResultsQuery();
  const router = useRouter();
  const appProps = useAppContext();

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/entity');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to entity',
      url: appProps.referrer,
    };
  }, [ appProps.referrer, router ]);

  if (!data) {
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
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </>
  );
};

export default EntityResults;
