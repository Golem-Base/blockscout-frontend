import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { Button } from 'toolkit/chakra/button';

const ActionButton = ({ handleOnClick, ...props }: ActionProps) => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={ handleOnClick }
      { ...props }
    />
  );
};

export default React.memo(ActionButton);
