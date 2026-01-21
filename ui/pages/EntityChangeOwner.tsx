import type { Hex } from '@arkiv-network/sdk';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { ArkivChangeEntityOwner } from '../entity/utils/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useArkivClient } from 'lib/arkiv/useArkivClient';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { toaster } from 'toolkit/chakra/toaster';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import ChangeEntityOwnerForm from 'ui/entity/ChangeEntityOwnerForm';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

import { useCanEditEntity } from '../entity/utils/useCanEditEntity';

const EntityChangeOwner = () => {
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

  const handleSubmit = React.useCallback(async(data: ArkivChangeEntityOwner) => {
    const client = await createClient();
    const updatedAfter = String(Date.now());
    await client.changeOwnership({ entityKey: key as Hex, newOwner: data.newOwner });

    toaster.success({
      title: 'Success',
      description: `Successfully changed entity owner of ${ key }`,
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

    return (
      <ChangeEntityOwnerForm
        onSubmit={ handleSubmit }
      />
    );
  })();

  return (
    <>
      <PageTitle title="Change Owner"/>
      { content }
    </>
  );
};

export default EntityChangeOwner;
