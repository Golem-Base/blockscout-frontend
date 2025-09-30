import { Box } from '@chakra-ui/react';
import React from 'react';

import { ADDRESS_BY_DATA_OWNED } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import AddressesWithTheMostDataListItem from 'ui/addressesWithTheMostData/AddressesWithTheMostDataListItem';
import AddressesWithTheMostDataTable from 'ui/addressesWithTheMostData/AddressesWithTheMostDataTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const AccountsWithTheMostData = () => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:addressByDataOwned',
    options: {
      placeholderData: generateListStub<'golemBaseIndexer:addressByDataOwned'>(
        ADDRESS_BY_DATA_OWNED,
        50,
        {
          pagination: {
            page: '1',
            page_size: '50',
            total_items: '50',
            total_pages: '1',
          },
          next_page_params: null,
        },
      ),
    },
  });

  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <AddressesWithTheMostDataTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data.items }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <AddressesWithTheMostDataListItem
              key={ item.address + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Top accounts with the most data" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no accounts."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default AccountsWithTheMostData;
