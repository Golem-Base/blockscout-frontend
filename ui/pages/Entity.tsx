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
import EntityLifecycle from 'ui/entity/EntityLifecycle';
import EntitySubHeading from 'ui/entity/EntitySubHeading';
import PageTitle from 'ui/shared/Page/PageTitle';

import TextAd from '../shared/ad/TextAd';

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
      title: 'Data & Content',
      component: <EntityData entityQuery={ entityQuery }/>,
    },
    {
      id: 'lifecycle',
      title: 'Lifecycle',
      component: <EntityLifecycle entityQuery={ entityQuery }/>,
    },
  ];

  const backLink = React.useMemo(() => {
    // @TODO: test it once search is implemented
    if (router.query.from === 'search') {
      return {
        label: 'Back to search results',
        url: '/search',
      };
    }
    return;
  }, [ router.query.from ]);

  const titleSecondRow = key ? (
    <EntitySubHeading entityKey={ key }/>
  ) : null;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Entity Details"
        backLink={ backLink }
        contentAfter={ null }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ entityQuery.isPlaceholderData }/>
    </>
  );
};

export default EntityPageContent;
