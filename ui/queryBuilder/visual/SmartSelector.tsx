import { Text, createListCollection } from '@chakra-ui/react';
import type { ValueChangeDetails } from '@zag-js/select';
import React from 'react';
import type { OperatorSelectorProps, CombinatorSelectorProps, BaseOption } from 'react-querybuilder';

import { Select } from 'toolkit/chakra/select';

type SmartSelectorProps = (OperatorSelectorProps | CombinatorSelectorProps) & {
  placeholder: string;
  name: string;
  width?: string;
};

const normalizeOptions = (options: Array<BaseOption>) =>
  options
    .map(option =>
      'name' in option && 'label' in option && option.name ?
        { label: option.label, value: option.name } :
        null,
    )
    .filter(Boolean);

const SmartSelector = ({ options, value, handleOnChange, className, placeholder, name, width = '80px' }: SmartSelectorProps) => {
  const handleValueChange = React.useCallback(({ value: newValue }: ValueChangeDetails<string>) => {
    handleOnChange(newValue[0]);
  }, [ handleOnChange ]);

  const normalizedOptions = normalizeOptions(Array.isArray(options) ? options : []);
  const isValidValue = value && normalizedOptions.some(option => option.value === value);

  React.useEffect(() => {
    if (!isValidValue) {
      handleOnChange(normalizedOptions[0]?.value);
    }
  }, [ isValidValue, normalizedOptions, handleOnChange ]);

  if (options.length === 1) {
    return (
      <Text fontSize="sm" fontWeight="medium" px={ 2 }>
        { options[0].label }
      </Text>
    );
  }

  const collection = createListCollection({
    items: normalizedOptions,
  });

  return (
    <Select
      size="sm"
      width={ width }
      name={ name }
      collection={ collection }
      value={ value ? [ value ] : [] }
      onValueChange={ handleValueChange }
      placeholder={ placeholder }
      className={ className }
    />
  );
};

export default React.memo(SmartSelector);
