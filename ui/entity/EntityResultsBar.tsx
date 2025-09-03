import { Box, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import { ENTITY_FILTER_KEYS } from './useEntityResultsQuery';

type Props = Pick<QueryWithPagesResult<'golemBaseIndexer:entities'>, 'isLoading' | 'isError' | 'pagination' | 'data'>;

const EntityResultsBar = ({ isLoading, isError, pagination, data }: Props) => {
  const router = useRouter();
  const displayedItems = data?.items || [];

  if (isError) {
    return null;
  }

  const searchTerm =
    router.query &&
    Object.entries(router.query)
      .filter(([ key ]) => ENTITY_FILTER_KEYS.includes(key));

  const resultsCount = pagination.page === 1 ? displayedItems.length : '50+';

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
        <chakra.span display="inline-flex" alignItems="center" flexWrap="wrap" gap={ 1 }>
          <span>
            Found
            { ' ' }
            <chakra.span fontWeight={ 700 }>{ resultsCount }</chakra.span>
            { ' ' }
            matching result
            { (displayedItems.length || 0) > 1 || pagination.page > 1 ? 's' : '' }
            { ' ' }
          </span>
          { searchTerm && (
            <>
              for { searchTerm.map(([ name, value ]) => (
                <Tag
                  key={ name }
                  variant="filter"
                  label={ name }
                  display="inline-flex"
                  alignItems="center"
                  mx={ 1 }
                  my={ 0.5 }
                >
                  { value }
                </Tag>
              )) }
            </>
          ) }
        </chakra.span>
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
