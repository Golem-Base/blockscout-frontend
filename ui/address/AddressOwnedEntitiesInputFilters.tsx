import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Input } from 'toolkit/chakra/input';
import { Skeleton } from 'toolkit/chakra/skeleton';

type InputValues = {
  numeric_annotation_key: string;
  numeric_annotation_value: string;
  string_annotation_key: string;
  string_annotation_value: string;
};

type Props = {
  loading: boolean;
  state: InputValues;
  setInputValue: (key: keyof InputValues, value: string) => void;
};

const AddressOwnedEntitiesInputFilters = ({ loading, state, setInputValue }: Props) => {
  const handleUpdateQuery = React.useCallback((param: keyof InputValues) => {
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
          <Skeleton loading={ loading }>
            <Input
              placeholder="key"
              value={ state.numeric_annotation_key }
              onChange={ handleUpdateQuery('numeric_annotation_key') }
              size="sm"/>
          </Skeleton>
          <Skeleton loading={ loading }>
            <Input
              placeholder="value"
              value={ state.numeric_annotation_value }
              onChange={ handleUpdateQuery('numeric_annotation_value') }
              size="sm"/>
          </Skeleton>
        </Flex>
      </Flex>

      <Flex flexDir="column" gap={ 1 }>
        <Text fontSize="xs" color="gray.500">String annotation:</Text>

        <Flex gap={ 1 }>
          <Skeleton loading={ loading }>
            <Input
              placeholder="key"
              value={ state.string_annotation_key }
              onChange={ handleUpdateQuery('string_annotation_key') }
              size="sm"/>
          </Skeleton>

          <Skeleton loading={ loading }>
            <Input
              placeholder="value"
              value={ state.string_annotation_value }
              onChange={ handleUpdateQuery('string_annotation_value') }
              size="sm"/>
          </Skeleton>
        </Flex>
      </Flex>
    </>
  );
};

export default AddressOwnedEntitiesInputFilters;
