import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import AddressOwnedEntitiesInputField from './AddressOwnedEntitiesInputField';
import type { FilterState, SetInputValue } from './addressOwnedFilterReducer';

type Props = {
  loading: boolean;
  state: FilterState;
  setInputValue: SetInputValue;
};

const AddressOwnedEntitiesInputFilters = ({ loading, state, setInputValue }: Props) => {
  const handleUpdateQuery = React.useCallback((param: keyof FilterState['inputValues']) => {
    const eventHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setInputValue(param, event.target.value);
    };

    return eventHandler;
  }, [ setInputValue ]);

  return (
    <>
      <Flex flexDir="column" gap={ 1 }>
        <Text fontSize="xs" color="gray.500">Numeric annotation:</Text>

        <Flex gap={ 1 }>
          <AddressOwnedEntitiesInputField
            id="numeric_annotation_key"
            placeholder="key"
            loading={ loading }
            error={ Boolean(state.errors.numeric_annotation_key) }
            value={ state.inputValues.numeric_annotation_key }
            onChange={ handleUpdateQuery('numeric_annotation_key') }
          />
          <AddressOwnedEntitiesInputField
            id="numeric_annotation_value"
            placeholder="value"
            loading={ loading }
            type="number"
            error={ Boolean(state.errors.numeric_annotation_value) }
            value={ state.inputValues.numeric_annotation_value }
            onChange={ handleUpdateQuery('numeric_annotation_value') }
          />
        </Flex>
      </Flex>

      <Flex flexDir="column" gap={ 1 }>
        <Text fontSize="xs" color="gray.500">String annotation:</Text>

        <Flex gap={ 1 }>
          <AddressOwnedEntitiesInputField
            id="string_annotation_key"
            placeholder="key"
            loading={ loading }
            error={ Boolean(state.errors.string_annotation_key) }
            value={ state.inputValues.string_annotation_key }
            onChange={ handleUpdateQuery('string_annotation_key') }
          />
          <AddressOwnedEntitiesInputField
            id="string_annotation_value"
            placeholder="value"
            loading={ loading }
            error={ Boolean(state.errors.string_annotation_value) }
            value={ state.inputValues.string_annotation_value }
            onChange={ handleUpdateQuery('string_annotation_value') }
          />
        </Flex>
      </Flex>
    </>
  );
};

export default AddressOwnedEntitiesInputFilters;
