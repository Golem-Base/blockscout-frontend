import { Box } from '@chakra-ui/react';
import React from 'react';

import getItemIndex from 'lib/getItemIndex';
import { LONGEST_LIVED_ENTITIES } from 'stubs/leaderboards';
import { generateListStub } from 'stubs/utils';
import LongestLivedEntitiesListItem from 'ui/longestLivedEntities/LongestLivedEntitiesListItem';
import LongestLivedEntitiesTable from 'ui/longestLivedEntities/LongestLivedEntitiesTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  isQueryEnabled?: boolean;
}

const LongestLivedEntities = ({ isQueryEnabled = true }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:longestLivedEntities',
    filters: { page_size: '50' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'golemBaseIndexer:longestLivedEntities'>(LONGEST_LIVED_ENTITIES, 50, {
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
        <LongestLivedEntitiesTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data?.items }
          isLoading={ isPlaceholderData }
          pageStartIndex={ pageStartIndex }
        />
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <LongestLivedEntitiesListItem
              key={ item.key + (isPlaceholderData ? index : '') }
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
      <PageTitle title="Longest lived entities" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no longest lived entities."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default LongestLivedEntities;
