import type { CollectionItem } from '@chakra-ui/react';
import { Flex, Text, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { OnFilterChange } from './types';

import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';

interface Props {
  isLoading: boolean;
  options: Array<CollectionItem>;
  defaultValue: string;
  onValueChange: OnFilterChange;
  name: string;
}

const ChainIndicatorFilter = ({ defaultValue, options, isLoading, onValueChange, name }: Props) => {
  const collection = React.useMemo(() => {
    return createListCollection<SelectOption<string>>({ items: options });
  }, [ options ]);

  return (
    <Flex gap={ 1 } alignItems="center" h="fit-content">
      <Text fontSize="xs">Type:</Text>
      <Select
        collection={ collection }
        placeholder="Select section"
        defaultValue={ [ defaultValue ] }
        onValueChange={ onValueChange(name) }
        size="xs"
        w="90px"
        loading={ isLoading }
      />
    </Flex>
  );
};

export default ChainIndicatorFilter;
