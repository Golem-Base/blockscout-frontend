import type { GolemBaseCreate, Hex } from 'golem-base-sdk';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import getQueryParamString from 'lib/router/getQueryParamString';
import { toaster } from 'toolkit/chakra/toaster';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

import EntityForm from '../entity/EntityForm';
import { useCanEditEntity } from '../entity/useCanEditEntity';
import { mapFullEntityToFormFields } from '../entity/utils';

const EntityUpdate = () => {
  const router = useRouter();
  const key = getQueryParamString(router.query.key);

  const entityQuery = useApiQuery('golemBaseIndexer:entity', {
    pathParams: { key },
    queryOptions: {
      enabled: Boolean(key),
    },
  });

  const { createClient } = useGolemBaseClient();

  throwOnAbsentParamError(key);
  throwOnResourceLoadError(entityQuery);

  const canEdit = useCanEditEntity(entityQuery.data);

  useEffect(() => {
    if (!entityQuery.isLoading && !canEdit) {
      router.push({ pathname: '/entity/[key]', query: { key } }, undefined, { shallow: true });
    }
  }, [ canEdit, entityQuery.isLoading, key, router ]);

  const handleSubmit = React.useCallback(async(entityData: GolemBaseCreate,
  ) => {
    const client = await createClient();
    const updateData = { ...entityData, entityKey: key as Hex };
    await client.updateEntities([ updateData ]);

    toaster.success({
      title: 'Success',
      description: `Successfully updated entity ${ key }`,
    });

    await router.push({ pathname: '/entity/[key]', query: { key } }, undefined, { shallow: true });
  }, [ createClient, router, key ]);

  const initialValues = useMemo(() => {
    if (!entityQuery.data) return null;

    return mapFullEntityToFormFields(entityQuery.data);
  }, [ entityQuery.data ]);

  const content = (() => {
    if (entityQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (entityQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <EntityForm
        onSubmit={ handleSubmit }
        initialValues={ initialValues }
        edit
      />
    );
  })();

  return (
    <>
      <PageTitle title="Update Entity"/>
      { content }
    </>
  );
};

export default EntityUpdate;
