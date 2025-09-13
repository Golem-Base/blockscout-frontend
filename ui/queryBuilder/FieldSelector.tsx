import { Input, createListCollection } from '@chakra-ui/react';
import type { ValueChangeDetails } from '@zag-js/select';
import type { ChangeEvent } from 'react';
import React from 'react';
import type { FieldSelectorProps } from 'react-querybuilder';

import { Select } from 'toolkit/chakra/select';

import { OWNER_KEY } from './constants';

const FieldSelector = ({ value, handleOnChange, className }: FieldSelectorProps) => {
  const isOwner = value === 'owner';

  const collection = React.useMemo(() => createListCollection({
    items: [
      { label: 'Owner', value: 'owner' },
      { label: 'Custom', value: 'custom' },
    ],
  }), []);

  const handleTypeChange = React.useCallback(({ value: newValue }: ValueChangeDetails<string>) => {
    handleOnChange(newValue[0] === 'owner' ? OWNER_KEY : '');
  }, [ handleOnChange ]);

  const handleValueChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleOnChange(e.target.value);
  }, [ handleOnChange ]);

  return (
    <>
      <Select
        collection={ collection }
        value={ [ isOwner ? 'owner' : 'custom' ] }
        onValueChange={ handleTypeChange }
        placeholder="Field type"
        size="sm"
        width="100px"
        className={ className }
      />

      { !isOwner && (
        <Input
          placeholder="field"
          value={ value }
          onChange={ handleValueChange }
          size="sm"
          width="120px"
        />
      ) }
    </>
  );
};

export default React.memo(FieldSelector);
