import React from 'react';

import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

const CreateEntityLink = ({ className, ...props }: ButtonProps) => {
  const { isConnected } = useGolemBaseClient();

  if (!isConnected) {
    return null;
  }

  return (
    <Link
      href="/entity/create"
      className={ className }
      asChild
    >
      <Button { ...props }>
        <IconSvg name="plus" boxSize={ 4 } mr={ 2 }/>
        Create New Entity
      </Button>
    </Link>
  );
};

export default CreateEntityLink;
