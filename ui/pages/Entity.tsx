import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import EntityData from 'ui/entity/EntityData';
import EntityDetails from 'ui/entity/EntityDetails';
import EntitySubHeading from 'ui/entity/EntitySubHeading';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

const RETRY_DELAY = 3000;
const RETRY_TIMES = 4;

const EntityPageContent = () => {
  const appProps = useAppContext();
  const freshEntity = appProps.referrer && appProps.referrer.includes('/entity/create');

  const router = useRouter();
  const key = getQueryParamString(router.query.key);

  const entityQuery = useApiQuery('golemBaseIndexer:entity', {
    pathParams: { key },
    queryOptions: {
      enabled: Boolean(key),
      retryDelay: RETRY_DELAY,
      retry: (failureCount, error) => {
        const errorCode = getErrorObjStatusCode(error);
        if (!freshEntity || errorCode !== 400) {
          return false;
        }
        return failureCount < RETRY_TIMES;
      },
    },
  });

  throwOnAbsentParamError(key);
  throwOnResourceLoadError(entityQuery);

  const tabs: Array<TabItemRegular> = [
    {
      id: 'index',
      title: 'Details',
      component: <EntityDetails entityQuery={ entityQuery }/>,
    },
    {
      id: 'data',
      title: 'Data & Annotations',
      component: <EntityData entityQuery={ entityQuery }/>,
    },
  ];

  const titleSecondRow = <EntitySubHeading entityKey={ key }/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Entity Details"
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ entityQuery.isPlaceholderData }/>
    </>
  );
};

export default EntityPageContent;
