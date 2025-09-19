import { Box } from '@chakra-ui/react';
import React from 'react';

import { TOP_ENTITY_CREATOR } from 'stubs/leaderboards';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TopEntityCreatorsListItem from 'ui/topEntityCreators/TopEntityCreatorsListItem';
import TopEntityCreatorsTable from 'ui/topEntityCreators/TopEntityCreatorsTable';

interface Props {
  isQueryEnabled?: boolean;
}

const TopEntityCreators = ({ isQueryEnabled = true }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:entitiesCreated',
    filters: { page_size: '50' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'golemBaseIndexer:entitiesCreated'>(TOP_ENTITY_CREATOR, 50, {
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
        <TopEntityCreatorsTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data?.items }
          isLoading={ isPlaceholderData }
        >
        </TopEntityCreatorsTable>
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <TopEntityCreatorsListItem
              key={ item.rank + (isPlaceholderData ? index : '') }
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
      <PageTitle title="Top Entity Creators" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no accounts that have created entities."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default TopEntityCreators;
