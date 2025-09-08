import { Box } from '@chakra-ui/react';
import React from 'react';

import { TOP_ENTITY_OWNER } from 'stubs/leaderboards';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TopEntityOwnersListItem from 'ui/topEntityOwners/TopEntityOwnersListItem';
import TopEntityOwnersTable from 'ui/topEntityOwners/TopEntityOwnersTable';

interface Props {
  isQueryEnabled?: boolean;
}

const TopEntityOwners = ({ isQueryEnabled = true }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:entitiesOwned',
    filters: { page_size: '50' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'golemBaseIndexer:entitiesOwned'>(TOP_ENTITY_OWNER, 50, {
        next_page_params: {
          page: 2,
          page_size: 50,
        },
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
        <TopEntityOwnersTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data?.items }
          isLoading={ isPlaceholderData }
        >
        </TopEntityOwnersTable>
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <TopEntityOwnersListItem
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
      <PageTitle title="Top Entity Owners" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no accounts with entities."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default TopEntityOwners;
