import { createListCollection, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { EntityStatus } from '@golembase/l3-indexer-types';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import { Select } from 'toolkit/chakra/select';

type Props = {
  isLoading: boolean;
  defaultFilterStatus: string;
};

const AddressOwnedEntitiesFilters = ({
  isLoading,
  defaultFilterStatus,
}: Props) => {
  const router = useRouter();

  const collection = React.useMemo(() => {
    const getStatusOption = (status: string) => ({
      value: status,
      label: capitalizeFirstLetter(status.toLowerCase()),
    });
    const items = Object.keys(EntityStatus).map(getStatusOption);

    return createListCollection({ items });
  }, []);

  const handleFilterChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const params = new URLSearchParams(router.query as Record<string, string>);
    const selected = value?.length ? value[0] : undefined;

    const isAllSelected = selected?.toLowerCase() === 'all';

    if (isAllSelected) params.delete('status');
    if (!isAllSelected && selected) params.set('status', selected);

    router.replace(
      {
        pathname: router.pathname,
        query: Object.fromEntries(params.entries()),
      },
      undefined,
      { shallow: true },
    );
  }, [ router ]);

  return (
    <Flex w="fit-content">
      <Select
        collection={ collection }
        placeholder="Select status"
        defaultValue={ [ defaultFilterStatus ] }
        onValueChange={ handleFilterChange }
        loading={ isLoading }
      />
    </Flex>
  );
};

export default AddressOwnedEntitiesFilters;
