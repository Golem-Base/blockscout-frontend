import { Box } from '@chakra-ui/react';
import React from 'react';

import getItemIndex from 'lib/getItemIndex';
import { EFFECTIVELY_LARGEST_ENTITIES } from 'stubs/leaderboards';
import { generateListStub } from 'stubs/utils';
import EffectivelyLargestEntitiesListItem from 'ui/effectivelyLargestEntitiesTable/EffectivelyLargestEntitiesListItem';
import EffectivelyLargestEntitiesTable from 'ui/effectivelyLargestEntitiesTable/EffectivelyLargestEntitiesTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  isQueryEnabled?: boolean;
}

const EffectivelyLargestEntities = ({ isQueryEnabled = true }: Props) => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'golemBaseIndexer:effectivelyLargestEntities',
    filters: { page_size: '50' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'golemBaseIndexer:effectivelyLargestEntities'>(EFFECTIVELY_LARGEST_ENTITIES, 50, {
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
        <EffectivelyLargestEntitiesTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data?.items }
          isLoading={ isPlaceholderData }
          pageStartIndex={ pageStartIndex }
        >
        </EffectivelyLargestEntitiesTable>
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <EffectivelyLargestEntitiesListItem
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
      <PageTitle title="Effectively largest entities" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no effectively largest entities to display."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default EffectivelyLargestEntities;
