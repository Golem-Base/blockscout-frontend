import React from 'react';

import { Button, type ButtonProps } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';

export interface ButtonLinkProps extends ButtonProps {
  href: string;
}

const ButtonLink = ({ href, variant = 'header', className, ...props }: ButtonLinkProps) => {
  return (
    <Link href={ href } className={ className } asChild>
      <Button px={ 2.5 } gapX={ 2 } variant={ variant } { ...props }/>
    </Link>
  );
};

export default ButtonLink;
