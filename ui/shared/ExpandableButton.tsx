import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  'aria-label'?: string;
}

const ExpandableButton = ({ isOpen, onToggle, isLoading, 'aria-label': ariaLabel }: Props) => {
  const defaultAriaLabel = isOpen ? 'Collapse section' : 'Expand section';

  return (
    <Skeleton loading={ isLoading }>
      <IconButton
        aria-label={ ariaLabel || defaultAriaLabel }
        variant="link"
        size="2xs"
        onClick={ onToggle }
      >
        <IconSvg
          name="arrows/east-mini"
          boxSize={ 6 }
          transform={ isOpen ? 'rotate(270deg)' : 'rotate(180deg)' }
          transitionDuration="faster"
        />
      </IconButton>
    </Skeleton>
  );
};

export default ExpandableButton;
