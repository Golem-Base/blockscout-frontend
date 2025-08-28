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
  handleClosePopover: () => void;
}

const EntityDeleteActionButton = ({
  entityQuery,
  handleClosePopover,
  className,
  ...props
}: Props) => {
  const { open, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <EntityDeleteConfirmationModal
        entityQuery={ entityQuery }
        open={ open }
        handleClose={ onOpen }
        handleClosePopover={ handleClosePopover }
        onOpenChange={ onOpenChange }
      />

      <Button { ...props } className={ className } onClick={ onOpen }>
        <IconSvg name="delete" boxSize={ 4 } mr={ 2 }/>
        Delete
      </Button>
    </>
  );
};

export default EntityDeleteActionButton;
