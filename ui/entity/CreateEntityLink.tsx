import React from 'react';

import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import type { ButtonLinkProps } from 'ui/shared/ButtonLink';
import ButtonLink from 'ui/shared/ButtonLink';
import IconSvg from 'ui/shared/IconSvg';

const CreateEntityLink = ({ children, ...props }: Omit<ButtonLinkProps, 'href'>) => {
  const { isConnected } = useGolemBaseClient();

  if (!isConnected) {
    return null;
  }

  return (
    <ButtonLink href="/entity/create" { ...props } >
      <IconSvg name="docs" boxSize={ 5 }/>
      { children }
    </ButtonLink>
  );
};

export default CreateEntityLink;
