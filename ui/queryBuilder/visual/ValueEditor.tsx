import { Input } from '@chakra-ui/react';
import React, { type ChangeEvent } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import { OWNER_KEY } from 'toolkit/components/forms/validators';

const ValueEditor = ({ field, value, handleOnChange, className }: ValueEditorProps) => {
  const isOwner = field === OWNER_KEY;
  const isNumeric = field?.startsWith('numeric:');

  const placeholder = React.useMemo(() => {
    if (isOwner) return 'Enter wallet address';
    if (isNumeric) return 'Enter numeric value';
    return 'Enter text value';
  }, [ isOwner, isNumeric ]);

  const inputType = isNumeric ? 'number' : 'text';
  const inputName = `value-${ field || 'default' }`;

  const handleChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => handleOnChange(e.target.value), [ handleOnChange ]);

  return (
    <Input
      name={ inputName }
      type={ inputType }
      value={ value || '' }
      onChange={ handleChange }
      placeholder={ placeholder }
      className={ className }
      size="sm"
      width="200px"
    />
  );
};

export default React.memo(ValueEditor);
