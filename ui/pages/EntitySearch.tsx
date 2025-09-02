import { Box, Text, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { validateEntityQuery } from 'ui/entity/utils/queryValidation';
import useQueryEntities from 'ui/entity/utils/useQueryEntities';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

const SearchEntityPageContent = () => {
  const router = useRouter();
  const searchTerm = getQueryParamString(router.query.q)?.trim() || '';
  const [ inputValue, setInputValue ] = React.useState(searchTerm);
  const [ validationError, setValidationError ] = React.useState<string | null>(null);

  const enabled = Boolean(searchTerm);

  const { data, isError, isPlaceholderData: isLoading } = useQueryEntities(searchTerm, { enabled });

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputValue.trim();

    const error = validateEntityQuery(value);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);

    if (value) {
      router.push({ pathname: '/entity/search', query: { q: value } }, undefined, { shallow: true });
    }
  }, [ inputValue, router ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    if (validationError) {
      setValidationError(null);
    }
    setInputValue(value);
  }, [ validationError ]);

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

    if (!enabled) {
      return <EmptySearchResult text="Enter a search term to find entities"/>;
    }

    if (!displayedItems.length) {
      return <EmptySearchResult text="No entities found for your search"/>;
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
    if (isError || !enabled) {
      return null;
    }

    const resultsCount = displayedItems.length;

    return isLoading ? (
      <Skeleton loading h={ 6 } w="280px" borderRadius="full" mb={ 6 }/>
    ) : (
      <Box mb={ 6 } lineHeight="32px">
        <span>Found </span>
        <chakra.span fontWeight={ 700 }>{ resultsCount }</chakra.span>
        <span> matching entit{ resultsCount === 1 ? 'y' : 'ies' } for </span>
        <chakra.span fontWeight={ 700 }>{ searchTerm }</chakra.span>
      </Box>
    );
  })();

  const renderSearchBar = React.useCallback(() => {
    return (
      <>
        <SearchResultsInput
          searchTerm={ inputValue }
          handleSubmit={ handleSubmit }
          handleSearchTermChange={ handleSearchTermChange }
          placeholder="Query entities..."
        />
        { validationError && (
          <Box mt={ 2 }>
            <Text color="text.error" textStyle="sm" fontSize="sm">
              { validationError }
            </Text>
          </Box>
        ) }
      </>
    );
  }, [ handleSubmit, handleSearchTermChange, inputValue, validationError ]);

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

export default React.memo(SearchEntityPageContent);
