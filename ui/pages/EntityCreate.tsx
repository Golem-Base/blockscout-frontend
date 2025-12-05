import { useRouter } from 'next/router';
import React from 'react';

import type { ArkivEntityData } from '../entity/utils/types';

import { useArkivClient } from 'lib/arkiv/useArkivClient';
import { toaster } from 'toolkit/chakra/toaster';
import PageTitle from 'ui/shared/Page/PageTitle';

import EntityForm from '../entity/EntityForm';
import { calculateExpiresIn } from '../entity/utils/utils';

const EntityCreate = () => {
  const router = useRouter();
  const { createClient } = useArkivClient();

  const handleSubmit = React.useCallback(async(entityData: ArkivEntityData) => {
    const client = await createClient();
    const expiresIn = calculateExpiresIn(entityData.expiresInDateTime);

    const { entityKey } = await client.createEntity({ ...entityData, expiresIn });

    toaster.success({
      title: 'Success',
      description: `Successfully created entity ${ entityKey }`,
    });

    await router.push({ pathname: '/entity/[key]', query: { key: entityKey } }, undefined, { shallow: true });
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
