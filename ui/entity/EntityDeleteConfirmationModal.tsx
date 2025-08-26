import type { UseQueryResult } from '@tanstack/react-query';
import type { Hex } from 'golem-base-sdk';
import React, { useCallback } from 'react';

import type { FullEntity } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';
import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import { toaster } from 'toolkit/chakra/toaster';
import DeleteModal from 'ui/shared/DeleteModal';

interface Props {
  entityQuery: UseQueryResult<FullEntity, ResourceError<unknown>>;
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  handleClose: () => void;
}

const EntityDeleteConfirmationModal = ({
  entityQuery,
  open,
  onOpenChange,
  handleClose,
}: Props) => {
  const key = entityQuery.data?.key;

  const { createClient } = useGolemBaseClient();

  const handleDelete = useCallback(async() => {
    const client = await createClient();
    await client.deleteEntities([ key as Hex ]);
  }, [ key, createClient ]);

  const onSuccess = useCallback(async() => {
    handleClose();

    await entityQuery.refetch();

    toaster.success({
      title: 'Success',
      description: `Successfully deleted entity ${ key }`,
    });
  }, [ entityQuery, handleClose, key ]);

  const renderContent = useCallback(() => {
    return <>Are you sure you want to delete this entity?</>;
  }, []);

  return (
    <DeleteModal
      title="Delete entity"
      renderContent={ renderContent }
      onOpenChange={ onOpenChange }
      open={ open }
      mutationFn={ handleDelete }
      onSuccess={ onSuccess }
    />
  );
};

export default EntityDeleteConfirmationModal;
