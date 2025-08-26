import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { FullEntity } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import EntityDeleteConfirmationModal from './EntityDeleteConfirmationModal';

interface Props extends ButtonProps {
  entityQuery: UseQueryResult<FullEntity, ResourceError<unknown>>;
}

const EntityDeleteActionButton = ({ entityQuery, className, ...props }: Props) => {
  const { open, onOpen, onOpenChange } = useDisclosure();

  // open modal on click

  // const handleSubmit = React.useCallback(async(entityData: GolemBaseCreate,
  // ) => {
  //
  //   const updateData = { ...entityData, entityKey: key as Hex };
  //   const updatedAfter = String(Date.now());
  //   await client.updateEntities([ updateData ]);

  //   toaster.success({
  //     title: 'Success',
  //     description: `Successfully updated entity ${ key }`,
  //   });

  //   await router.push({ pathname: '/entity/[key]', query: { key, updated: updatedAfter } }, undefined, { shallow: true });
  // }, [ createClient, router, key ]);

  return (
    <>
      <EntityDeleteConfirmationModal entityQuery={ entityQuery } open={ open } handleClose={ onOpen } onOpenChange={ onOpenChange }/>

      <Button { ...props } className={ className } onClick={ onOpen } >
        <IconSvg name="delete" boxSize={ 4 } mr={ 2 }/>
        Delete
      </Button>
    </>
  );
};

export default EntityDeleteActionButton;
