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
    console.time('createClient');
    const client = await createClient(); 
    console.timeEnd('createClient');
    console.time('createEntities');
    const [ result ] = await client.createEntities([ entityData ]);
    console.timeEnd('createEntities');
    const key = result.entityKey;

    toaster.success({
      title: 'Success',
      description: `Successfully created entity ${ key }`,
    });
    console.time('router.push');

    await router.push({ pathname: '/entity/[key]', query: { key } }, undefined, { shallow: true });
    console.timeEnd('router.push');
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
