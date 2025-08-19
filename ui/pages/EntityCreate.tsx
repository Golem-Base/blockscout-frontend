import type { GolemBaseCreate } from 'golem-base-sdk';
import { useRouter } from 'next/router';
import React from 'react';

import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import { toaster } from 'toolkit/chakra/toaster';
import PageTitle from 'ui/shared/Page/PageTitle';

import EntityForm from '../entity/EntityForm';

const EntityCreate = () => {
  const router = useRouter();
  const { createClient } = useGolemBaseClient();

  const handleSubmit = React.useCallback(async(entityData: GolemBaseCreate) => {
    const client = await createClient();
    const [ result ] = await client.createEntities([ entityData ]);
    const key = result.entityKey;

    toaster.success({
      title: 'Success',
      description: `Successfully created entity ${ key }`,
    });

    await router.push({ pathname: '/entity/[key]', query: { key } }, undefined, { shallow: true });
  }, [ createClient, router ]);

  return (
    <>
      <PageTitle title="Create New Entity"/>
      <EntityForm
        onSubmit={ handleSubmit }
        submitText="Create Entity"
      />
    </>
  );
};

export default EntityCreate;
