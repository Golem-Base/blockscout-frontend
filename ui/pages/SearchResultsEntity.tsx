import { Box, chakra } from '@chakra-ui/react';
import { noop } from 'es-toolkit';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import useQueryEntities from '../entity/utils/useQueryEntities';

const SearchResultsEntityPageContent = () => {
  const router = useRouter();
  const searchTerm = getQueryParamString(router.query.q)?.trim() || '';

  const { data, isError, isLoading } = useQueryEntities(searchTerm, {
    enabled: Boolean(searchTerm),
  });

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      router.push({ pathname: '/entity/search-results', query: { q: searchTerm } }, undefined, { shallow: true });
    }
  }, [ searchTerm, router ]);

  const displayedItems = React.useMemo(() => {
    if (!data) return [];

    return data.map((item) => ({
      type: 'golembase_entity' as const,
      golembase_entity: item.entityKey,
    }));
  }, [ data ]);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!displayedItems.length) {
      return null;
    }

    return (
      <>
        <Box hideFrom="lg">
          { displayedItems.map((item, index) => (
            <SearchResultListItem
              key={ (isLoading ? 'placeholder_' : 'actual_') + index }
              data={ item }
              searchTerm={ searchTerm }
              isLoading={ isLoading }
            />
          )) }
        </Box>
        <Box hideBelow="lg">
          <TableRoot fontWeight={ 500 }>
            <TableHeaderSticky top={ 0 }>
              <TableRow>
                <TableColumnHeader width="30%">Search result</TableColumnHeader>
                <TableColumnHeader width="35%"/>
                <TableColumnHeader width="35%" pr={ 10 }/>
                <TableColumnHeader width="150px">Category</TableColumnHeader>
              </TableRow>
            </TableHeaderSticky>
            <TableBody>
              { displayedItems.map((item, index) => (
                <SearchResultTableItem
                  key={ (isLoading ? 'placeholder_' : 'actual_') + index }
                  data={ item }
                  searchTerm={ searchTerm }
                  isLoading={ isLoading }
                />
              )) }
            </TableBody>
          </TableRoot>
        </Box>
      </>
    );
  })();

  const bar = (() => {
    if (isError) {
      return null;
    }

    const resultsCount = displayedItems.length;

    return isLoading ? (
      <Skeleton loading h={ 6 } w="280px" borderRadius="full" mb={ 6 }/>
    ) : (
      <Box mb={ 6 } lineHeight="32px">
        <span>Found </span>
        <chakra.span fontWeight={ 700 }>{ resultsCount }</chakra.span>
        <span> matching entit{ resultsCount === 1 ? 'y' : 'ies' } for </span>"
        <chakra.span fontWeight={ 700 }>{ searchTerm }</chakra.span>"
      </Box>
    );
  })();

  const renderSearchBar = React.useCallback(() => {
    return (
      <SearchResultsInput
        searchTerm={ searchTerm }
        handleSubmit={ handleSubmit }
        handleSearchTermChange={ noop }
      />
    );
  }, [ handleSubmit, searchTerm ]);

  const pageContent = (
    <>
      <PageTitle title="Search results"/>
      { bar }
      { content }
    </>
  );

  return (
    <>
      <HeaderMobile renderSearchBar={ renderSearchBar }/>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn>
          <HeaderAlert/>
          <HeaderDesktop renderSearchBar={ renderSearchBar }/>
          <AppErrorBoundary>
            <Layout.Content flexGrow={ 0 }>
              { pageContent }
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </>
  );
};

export default React.memo(SearchResultsEntityPageContent);
