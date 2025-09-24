import { Box } from '@chakra-ui/react';
import React from 'react';

import { CUSTOM_CONTRACT_TX } from 'stubs/customContractTx';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import CustomContractTxsListItem from '../customContractTxs/CustomContractTxsListItem';
import CustomContractTxsTable from '../customContractTxs/CustomContractTxsTable';

const CustomContractTxs = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:customContractTransactions',
    options: {
      placeholderData: generateListStub<'golemBaseIndexer:customContractTransactions'>(
        CUSTOM_CONTRACT_TX,
        50,
        {
          pagination: {
            total_items: '100',
          },
          next_page_params: {
            page: 2,
            page_size: 50,
          },
        },
      ),
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <CustomContractTxsListItem
            key={ item.hash + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <CustomContractTxsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (isError) {
      return null;
    }

    const totalItems = Number(data?.pagination?.total_items ?? '0');
    return (
      <Skeleton loading={ isPlaceholderData } display="inline-block">
        A total of { totalItems.toLocaleString() } contract transactions found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Custom Contract Transactions" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no transactions."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default CustomContractTxs;
