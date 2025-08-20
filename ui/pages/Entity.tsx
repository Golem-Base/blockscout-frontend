import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENTITY_BASE } from 'stubs/entity';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import EntityData from 'ui/entity/EntityData';
import EntityDetails from 'ui/entity/EntityDetails';
import EntitySubHeading from 'ui/entity/EntitySubHeading';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

import UpdateEntityButton from '../entity/UpdateEntityButton';

const RETRY_DELAY = 3000;
const RETRY_TIMES = 4;

const EntityPageContent = () => {
  const router = useRouter();
  const key = getQueryParamString(router.query.key);
  const updatedParam = getQueryParamString(router.query.updated);

  const appProps = useAppContext();
  const freshEntity = appProps.referrer && appProps.referrer.includes('/entity/create');

  const targetTimestamp = React.useMemo(() => {
    if (!updatedParam) return null;
    const parsed = parseInt(updatedParam, 10);
    return isNaN(parsed) ? null : parsed;
  }, [ updatedParam ]);

  const entityQuery = useApiQuery('golemBaseIndexer:entity', {
    pathParams: { key },
    queryOptions: {
      enabled: Boolean(key),
      retryDelay: RETRY_DELAY,
      placeholderData: ENTITY_BASE,
      retry: (failureCount, error) => {
        const errorCode = getErrorObjStatusCode(error);
        if (!freshEntity || errorCode !== 404) {
          return false;
        }
        return failureCount < RETRY_TIMES;
      },
      refetchInterval: (query) => {
        const { data } = query.state;
        if (!targetTimestamp || !data) {
          return false;
        }

        const shouldRefetch = !data.updated_at_timestamp || (new Date(data.updated_at_timestamp).getTime() < targetTimestamp);
        return shouldRefetch ? RETRY_DELAY : false;
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
        afterTitle={ <UpdateEntityButton size="sm" ml={ 3 } entity={ entityQuery.data } disabled={ entityQuery.isLoading }/> }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ entityQuery.isPlaceholderData }/>
    </>
  );
};

export default EntityPageContent;
