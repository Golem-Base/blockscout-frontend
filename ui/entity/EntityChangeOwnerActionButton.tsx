import React from 'react';

import type { FullEntity } from '@golembase/l3-indexer-types';

import { route } from 'nextjs-routes';

import { Button, type ButtonProps } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

import { useCanEditEntity } from './utils/useCanEditEntity';

interface Props extends ButtonProps {
  entity?: Pick<FullEntity, 'key' | 'owner' | 'status'>;
}

const EntityChangeOwnerActionButton = ({ entity, className, ...props }: Props) => {
  const canEdit = useCanEditEntity(entity);

  if (!entity || !canEdit) {
    return null;
  }

  return (
    <Link
      href={ route({ pathname: '/entity/[key]/change-owner', query: { key: entity.key } }) }
      className={ className }
      asChild
    >
      <Button { ...props }>
        <IconSvg name="user_op" boxSize={ 4 } mr={ 2 }/>
        Change Owner
      </Button>
    </Link>
  );
};

export default EntityChangeOwnerActionButton;
