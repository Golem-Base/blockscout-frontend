import type { CollectionItem, SelectValueChangeDetails } from '@chakra-ui/react';
import { Flex, Text, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';

export type OnValueChange<T extends SelectOption<string>> = ((details: SelectValueChangeDetails<T>) => void);

interface Props<T extends SelectOption<string>> {
  isLoading: boolean;
  options: Array<CollectionItem>;
  defaultValue: string;
  onValueChange: OnValueChange<T>;
}

const ChainIndicatorFilter = <T extends SelectOption<string>>({ defaultValue, options, isLoading, onValueChange }: Props<T>) => {
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
        onValueChange={ onValueChange }
        size="xs"
        w="90px"
        loading={ isLoading }
      />
    </Flex>
  );
};

export default ChainIndicatorFilter;
