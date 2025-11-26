import { Flex, chakra } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { FullEntity } from '@golembase/l3-indexer-types';

import type { ResourceError } from 'lib/api/resources';
import { Button } from 'toolkit/chakra/button';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import EntityChangeOwnerActionButton from './EntityChangeOwnerActionButton';
import EntityDeleteActionButton from './EntityDeleteActionButton';
import EntityExtendActionButton from './EntityExtendActionButton';
import EntityUpdateActionButton from './EntityUpdateActionButton';
import { useCanEditEntity } from './utils/useCanEditEntity';

interface Props {
  className?: string;
  entityQuery: UseQueryResult<FullEntity, ResourceError<unknown>>;
}

const EntityActionsList = ({ className, entityQuery }: Props) => {
  const entity = entityQuery.data;

  const { open, onOpenChange, onClose: handleClosePopover } = useDisclosure();
  const canEdit = useCanEditEntity(entity);

  if (!entity || !canEdit) {
    return null;
  }

  return (
    <PopoverRoot open={ open } onOpenChange={ onOpenChange }>
      <PopoverTrigger>
        <Button
          className={ className }
          size="sm"
          variant="dropdown"
          aria-label="Open available actions for this entity"
          fontWeight={ 500 }
          gap={ 2 }
          h="32px"
          flexShrink={ 0 }
        >
          <IconSvg name="dots" transform="rotate(90deg)" boxSize={ 3 }/>
          <span>Actions</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody>
          <chakra.span color="text.secondary" fontSize="xs">
            Actions
          </chakra.span>
          <Flex flexDir="column" columnGap={ 6 } rowGap={ 3 } mt={ 3 }>
            <EntityUpdateActionButton
              size="sm"
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              entity={ entityQuery.data }
              disabled={ entityQuery.isLoading }
            />
            <EntityExtendActionButton
              size="sm"
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              entity={ entityQuery.data }
              disabled={ entityQuery.isLoading }
            />
            <EntityChangeOwnerActionButton
              size="sm"
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              entity={ entityQuery.data }
              disabled={ entityQuery.isLoading }
            />
            <EntityDeleteActionButton
              size="sm"
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              color="red"
              entityQuery={ entityQuery }
              disabled={ entityQuery.isLoading }
              handleClosePopover={ handleClosePopover }
            />
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default EntityActionsList;
