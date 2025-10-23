import { Box, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import EntityAnnotation from './EntityAnnotation';
import type { EntityFilterKey } from './useEntityResultsQuery';
import { ENTITY_FILTER_KEYS } from './useEntityResultsQuery';

type Props = Pick<QueryWithPagesResult<'golemBaseIndexer:entities'>, 'isLoading' | 'isError' | 'pagination' | 'data'>;

const getFilterValue = (getFilterValueFromQuery<EntityFilterKey>).bind(null, ENTITY_FILTER_KEYS);

const EntityResultsBar = ({ isLoading, isError, pagination, data }: Props) => {
  const router = useRouter();
  const displayedItems = data?.items || [];

  if (isError) {
    return null;
  }

  const searchTerm =
    router.query &&
    Object.entries(router.query)
      .filter(([ key ]) => getFilterValue(key));

  const resultsCount = displayedItems.length;

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
            <Skeleton display="inline-block" loading={ isLoading } fontWeight={ 700 }>
              { isLoading ? '100' : resultsCount }
            </Skeleton>
            { ' ' }
            matching result
            { (displayedItems.length || 0) > 1 || pagination.page > 1 ? 's' : '' }
            { ' ' }
          </span>
          { searchTerm && (
            <>
              for { searchTerm.map(([ name, value ]) => (
                <EntityAnnotation key={ name } name={ name } value={ value }/>
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
