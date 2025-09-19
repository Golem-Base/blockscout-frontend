import { Input, createListCollection } from '@chakra-ui/react';
import type { ValueChangeDetails } from '@zag-js/select';
import type { ChangeEvent } from 'react';
import React, { useEffect } from 'react';
import type { FieldSelectorProps } from 'react-querybuilder';

import { Select } from 'toolkit/chakra/select';
import { OWNER_KEY } from 'toolkit/components/forms/validators';
import { parseField } from 'ui/queryBuilder/visual/utils';

const collection = createListCollection({
  items: [
    { label: 'String', value: 'string' },
    { label: 'Numeric', value: 'numeric' },
    { label: 'Owner', value: 'owner' },
  ],
});

const FieldSelector = ({ value, handleOnChange, className }: FieldSelectorProps) => {
  const isOwner = value === OWNER_KEY;
  const [ fieldType, fieldName ] = parseField(value);

  const handleTypeChange = React.useCallback(({ value: newValue }: ValueChangeDetails<string>) => {
    const type = newValue[0];
    if (type === 'owner') {
      handleOnChange(OWNER_KEY);
    } else {
      handleOnChange(`${ type }:`);
    }
  }, [ handleOnChange ]);

  const handleChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newFieldName = e.target.value;
    handleOnChange(`${ fieldType }:${ newFieldName }`);
  }, [ handleOnChange, fieldType ]);

  useEffect(() => {
    // After creation value is `~`
    if (value === '~') {
      handleOnChange('string:');
    }
  }, [ handleOnChange, value ]);

  return (
    <>
      <Select
        name={ `select-${ fieldType }` }
        collection={ collection }
        value={ [ fieldType ] }
        onValueChange={ handleTypeChange }
        placeholder="Field type"
        width="110px"
        size="sm"
        className={ className }
      />

      { !isOwner && (
        <Input
          name={ `field-${ fieldType }` }
          placeholder="Annotation Key"
          value={ fieldName }
          onChange={ handleChange }
          size="sm"
          width="150px"
        />
      ) }
    </>
  );
};

export default React.memo(FieldSelector);
