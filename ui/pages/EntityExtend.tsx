import type { Hex } from '@arkiv-network/sdk';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { ArkivExtendEntity } from '../entity/utils/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useArkivClient } from 'lib/arkiv/useArkivClient';
import dayjs from 'lib/date/dayjs';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { toaster } from 'toolkit/chakra/toaster';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

import ExtendEntityForm from '../entity/ExtendEntityForm';
import { useCanEditEntity } from '../entity/utils/useCanEditEntity';

const EntityExtend = () => {
  const router = useRouter();
  const key = getQueryParamString(router.query.key);

  const entityQuery = useApiQuery('golemBaseIndexer:entity', {
    pathParams: { key },
    queryOptions: {
      enabled: Boolean(key),
    },
  });

  const { createClient } = useArkivClient();

  throwOnAbsentParamError(key);
  throwOnResourceLoadError(entityQuery);

  const canEdit = useCanEditEntity(entityQuery.data);

  useEffect(() => {
    if (!entityQuery.isLoading && !canEdit) {
      router.push({ pathname: '/entity/[key]', query: { key } }, undefined, { shallow: true });
    }
  }, [ canEdit, entityQuery.isLoading, key, router ]);

  const handleSubmit = React.useCallback(async(data: ArkivExtendEntity) => {
    const client = await createClient();
    const updatedAfter = String(Date.now());
    await client.extendEntity({ ...data, entityKey: key as Hex });

    toaster.success({
      title: 'Success',
      description: `Successfully extended entity ${ key }`,
    });

    await router.push({ pathname: '/entity/[key]', query: { key, updated: updatedAfter } }, undefined, { shallow: true });
  }, [ createClient, router, key ]);

  const content = (() => {
    if (entityQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (entityQuery.isPending) {
      return <ContentLoader/>;
    }

    const now = dayjs().toISOString();
    const initialExpiresAtTimestamp = entityQuery.data?.expires_at_timestamp || now;

    return (
      <ExtendEntityForm
        onSubmit={ handleSubmit }
        initialExpiresAtTimestamp={ initialExpiresAtTimestamp }
      />
    );
  })();

  return (
    <>
      <PageTitle title="Extend Entity"/>
      { content }
    </>
  );
};

export default EntityExtend;
