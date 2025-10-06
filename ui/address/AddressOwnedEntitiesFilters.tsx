import { Box, createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';

import { EntityStatus } from '@golembase/l3-indexer-types';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import { Button } from 'toolkit/chakra/button';
import { Select } from 'toolkit/chakra/select';

import AddressOwnedEntitiesInputFilters from './AddressOwnedEntitiesInputFilters';
import { useAddressOwnedEntitiesFilters } from './useAddressOwnedEntitiesFilters';

type Props = {
  isLoading: boolean;
  defaultFilterStatus: string;
};

const AddressOwnedEntitiesFilters = ({ isLoading, defaultFilterStatus }: Props) => {
  const { state, setStatus, setInputValue, applyFilters } = useAddressOwnedEntitiesFilters(defaultFilterStatus);

  const collection = React.useMemo(() => {
    const getStatusOption = (status: string) => ({
      value: status,
      label: capitalizeFirstLetter(status.toLowerCase()),
    });
    const items = Object.keys(EntityStatus).map(getStatusOption);

    return createListCollection({ items });
  }, []);

  const handleStatusChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const selected = value?.length ? value[0] : defaultFilterStatus;
    setStatus(selected);
  }, [ defaultFilterStatus, setStatus ]);

  const handleSubmit = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    applyFilters();
  }, [ applyFilters ]);

  return (
    <form onSubmit={ handleSubmit }>
      <Flex
        flexDir={{ xl: 'row', base: 'column' }}
        gap={ 4 }
        alignItems={{ xl: 'flex-end', base: 'flex-start' }}
        backgroundColor={{ _light: 'gray.50', _dark: 'gray.800' }}
        p={ 2 } borderRadius="base">
        <Box>
          <Select
            collection={ collection }
            placeholder="Select status"
            value={ [ state.selectedStatus ] }
            onValueChange={ handleStatusChange }
            loading={ isLoading }
            w="140px"
          />
        </Box>

        <AddressOwnedEntitiesInputFilters loading={ isLoading } state={ state.inputValues } setInputValue={ setInputValue }/>

        <Button type="submit" size="sm">
          Apply
        </Button>
      </Flex>
    </form>
  );
};

export default AddressOwnedEntitiesFilters;
