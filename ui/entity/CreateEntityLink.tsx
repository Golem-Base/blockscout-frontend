import React from 'react';

import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends ButtonProps {
  label?: string;
}

const CreateEntityLink = ({ label, variant = 'header', className, ...props }: Props) => {
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
      <Button px={ 2.5 } gapX={ 2 } variant={ variant } { ...props }>
        <IconSvg name="docs" boxSize={ 5 }/>
        { label }
      </Button>
    </Link>
  );
};

export default CreateEntityLink;
