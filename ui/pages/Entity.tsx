import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import EntityData from 'ui/entity/EntityData';
import EntityDetails from 'ui/entity/EntityDetails';
import EntitySubHeading from 'ui/entity/EntitySubHeading';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

import UpdateEntityButton from '../entity/UpdateEntityButton';

const EntityPageContent = () => {
  const router = useRouter();
  const key = getQueryParamString(router.query.key);

  const entityQuery = useApiQuery('golemBaseIndexer:entity', {
    pathParams: { key },
    queryOptions: {
      enabled: Boolean(key),
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
