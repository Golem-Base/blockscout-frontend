import { Box } from '@chakra-ui/react';
import React from 'react';

import getItemIndex from 'lib/getItemIndex';
import { LARGEST_ENTITIES } from 'stubs/leaderboards';
import { generateListStub } from 'stubs/utils';
import LargestEntitiesListItem from 'ui/largestEntitiesTable/LargestEntitiesListItem';
import LargestEntitiesTable from 'ui/largestEntitiesTable/LargestEntitiesTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  isQueryEnabled?: boolean;
}

const LargestEntities = ({ isQueryEnabled = true }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:largestEntities',
    filters: { page_size: '50' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'golemBaseIndexer:largestEntities'>(LARGEST_ENTITIES, 50, {
        next_page_params: {
          page: 2,
          page_size: 50,
        },
      },
      ),
    },
  });

  const pageStartIndex = getItemIndex(0, pagination.page);

  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <LargestEntitiesTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data?.items }
          isLoading={ isPlaceholderData }
          pageStartIndex={ pageStartIndex }
        >
        </LargestEntitiesTable>
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <LargestEntitiesListItem
              key={ item.entity_key + (isPlaceholderData ? index : '') }
              item={ item }
              rank={ pageStartIndex + index }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Largest entities" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no largest entities to display."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default LargestEntities;
