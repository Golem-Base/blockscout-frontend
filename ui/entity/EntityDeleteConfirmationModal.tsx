import type { Hex } from '@arkiv-network/sdk';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

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
  handleClosePopover: () => void;
}

const EntityDeleteConfirmationModal = ({
  entityQuery,
  open,
  onOpenChange,
  handleClose,
  handleClosePopover,
}: Props) => {
  const key = entityQuery.data?.key;

  const router = useRouter();
  const { createClient } = useGolemBaseClient();

  const handleDelete = React.useCallback(async() => {
    if (!key) return;
    const client = await createClient();
    await client.deleteEntity({ entityKey: key as Hex });
  }, [ key, createClient ]);

  const onSuccess = React.useCallback(async() => {
    if (!key) return;
    handleClose();
    handleClosePopover();

    const updatedAfter = String(Date.now());
    await router.push({ pathname: '/entity/[key]', query: { key, updated: updatedAfter } }, undefined, { shallow: true });

    toaster.success({
      title: 'Success',
      description: `Successfully deleted entity ${ key }`,
    });
  }, [ handleClose, handleClosePopover, key, router ]);

  const renderContent = React.useCallback(() => {
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
