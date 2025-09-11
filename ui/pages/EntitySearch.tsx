import { Box, Text, chakra } from '@chakra-ui/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import useQueryEntities from 'ui/entity/utils/useQueryEntities';
import QueryBuilderInput from 'ui/queryBuilder/QueryBuilderInput';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
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
  const [ validationErrors, setValidationErrors ] = React.useState<Array<monaco.editor.IMarker>>([]);
  const [ hasValidationErrors, setHasValidationErrors ] = React.useState(false);

  const enabled = Boolean(searchTerm);

  const { data, isError, isPlaceholderData: isLoading } = useQueryEntities(searchTerm, { enabled });

  const handleChange = React.useCallback((value: string) => {
    if (value && !hasValidationErrors) {
      router.push({ pathname: '/entity/search', query: { q: value } }, undefined, { shallow: true });
    }
  }, [ router, hasValidationErrors ]);

  const handleValidationChange = React.useCallback((hasErrors: boolean, errors: Array<monaco.editor.IMarker>) => {
    setHasValidationErrors(hasErrors);
    setValidationErrors(errors);
  }, []);

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
        <QueryBuilderInput
          defaultValue={ searchTerm }
          onSearch={ handleChange }
          onValidationChange={ handleValidationChange }
        />
        { hasValidationErrors && validationErrors.length > 0 && (
          <Box mt={ 2 }>
            { validationErrors.map((error, index) => (
              <Text key={ index } color="text.error" textStyle="sm" fontSize="sm">
                Line { error.startLineNumber }: { error.message }
              </Text>
            )) }
          </Box>
        ) }
      </>
    );
  }, [ handleChange, searchTerm, handleValidationChange, hasValidationErrors, validationErrors ]);

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
