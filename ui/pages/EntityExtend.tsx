import type { GolemBaseExtend, Hex } from 'golem-base-sdk';
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

import ExtendEntityForm from '../entity/ExtendEntityForm';
import { useCanExtendEntity } from '../entity/useCanExtendEntity';
import { mapFullEntityToExtendFormFields } from '../entity/utils';

const EntityExtend = () => {
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

  const canExtend = useCanExtendEntity(entityQuery.data);

  useEffect(() => {
    if (!entityQuery.isLoading && !canExtend) {
      router.push({ pathname: '/entity/[key]', query: { key } }, undefined, { shallow: true });
    }
  }, [ canExtend, entityQuery.isLoading, key, router ]);

  const handleSubmit = React.useCallback(async(entityData: GolemBaseExtend,
  ) => {
    const client = await createClient();
    const extendData = { entityKey: key as Hex, numberOfBlocks: entityData.numberOfBlocks };
    const updatedAfter = String(Date.now());
    await client.extendEntities([ extendData ]);

    toaster.success({
      title: 'Success',
      description: `Successfully updated entity ${ key }`,
    });

    await router.push({ pathname: '/entity/[key]', query: { key, updated: updatedAfter } }, undefined, { shallow: true });
  }, [ createClient, router, key ]);

  const initialValues = useMemo(() => {
    if (!entityQuery.data) return null;

    return mapFullEntityToExtendFormFields(entityQuery.data);
  }, [ entityQuery.data ]);

  const content = (() => {
    if (entityQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (entityQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <ExtendEntityForm
        onSubmit={ handleSubmit }
        initialValues={ initialValues }
        edit
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
