import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

interface Props
  extends Pick<
    QueryWithPagesResult<'golemBaseIndexer:entities'>,
    'isLoading' | 'isError' | 'pagination' | 'data'
  > {
  searchTerm: string;
}

const EntityResultsBar = ({
  isLoading,
  isError,
  pagination,
  data,
  searchTerm,
}: Props) => {
  const displayedItems = data?.items || [];

  if (isError) {
    return null;
  }

  const resultsCount =
    pagination.page === 1 ?
      displayedItems.length :
      '50+';

  const text =
    isLoading && pagination.page === 1 ? (
      <Skeleton
        loading
        h={ 6 }
        w="280px"
        borderRadius="full"
        mb={ pagination.isVisible ? 0 : 6 }
      />
    ) : (
      <Box mb={ pagination.isVisible ? 0 : 6 } lineHeight="32px">
        <span>Found </span>
        <chakra.span fontWeight={ 700 }>{ resultsCount }</chakra.span>
        <span>
          { ' ' }
          matching result
          { (displayedItems.length || 0) > 1 || pagination.page > 1 ? 's' : '' }
          { searchTerm && (
            <>
              { ' ' }
              for “<chakra.span fontWeight={ 700 }>{ searchTerm }</chakra.span>”
            </>
          ) }
        </span>
      </Box>
    );

  if (!pagination.isVisible) {
    return text;
  }

  return (
    <>
      <Box hideFrom="lg">{ text }</Box>
      <ActionBar mt={{ base: 0, lg: -6 }} alignItems="center">
        <Box hideBelow="lg">{ text }</Box>
        <Pagination { ...pagination }/>
      </ActionBar>
    </>
  );
};

export default EntityResultsBar;
