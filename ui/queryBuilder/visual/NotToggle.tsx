import { Box } from '@chakra-ui/react';
import { type CheckedChangeDetails } from '@zag-js/checkbox';
import React from 'react';
import type { NotToggleProps } from 'react-querybuilder';

import { Checkbox } from 'toolkit/chakra/checkbox';

const NotToggle = ({ checked, handleOnChange, disabled }: NotToggleProps) => {
  const onCheckedChange = React.useCallback((details: CheckedChangeDetails) => handleOnChange(details.checked === true), [ handleOnChange ]);

  return (
    <Box>
      <Checkbox
        checked={ checked }
        onCheckedChange={ onCheckedChange }
        disabled={ disabled }
      >
        NOT
      </Checkbox>
    </Box>
  );
};

export default React.memo(NotToggle);
