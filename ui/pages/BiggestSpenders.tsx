import { Box } from '@chakra-ui/react';
import React from 'react';

import { TOP_SPENDER } from 'stubs/leaderboards';
import { generateListStub } from 'stubs/utils';
import BiggestSpendersListItem from 'ui/biggestSpenders/BiggestSpendersListItem';
import BiggestSpendersTable from 'ui/biggestSpenders/BiggestSpendersTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  isQueryEnabled?: boolean;
}

const BiggestSpenders = ({ isQueryEnabled = true }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:biggestSpenders',
    filters: { page_size: '50' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'golemBaseIndexer:biggestSpenders'>(TOP_SPENDER, 50, {
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
        <BiggestSpendersTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data?.items }
          isLoading={ isPlaceholderData }
        >
        </BiggestSpendersTable>
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item) => {
          return (
            <BiggestSpendersListItem
              key={ item.rank }
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
      <PageTitle title="Biggest Spenders" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no accounts with transaction fees."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default BiggestSpenders;
