import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { ENTITY_QUERY_ITEM } from 'stubs/entity';
import { Button } from 'toolkit/chakra/button';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import useQueryEntities from 'ui/entity/utils/useQueryEntities';
import QueryBuilder from 'ui/queryBuilder/QueryBuilder';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import ActionBar from 'ui/shared/ActionBar';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import IconSvg from 'ui/shared/IconSvg';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

const SearchEntityPageContent = () => {
  const router = useRouter();
  const searchTerm = getQueryParamString(router.query.q)?.trim() || '';
  const cursor = getQueryParamString(router.query.cursor) || undefined;

  const enabled = Boolean(searchTerm);

  const cursorHistoryRef = React.useRef<Array<string | undefined>>([]);
  const prevSearchTermRef = React.useRef<string>('');

  React.useEffect(() => {
    if (searchTerm !== prevSearchTermRef.current) {
      cursorHistoryRef.current = [];
      prevSearchTermRef.current = searchTerm;
    }
  }, [ searchTerm ]);

  const { data, isError, isPlaceholderData: isLoading } = useQueryEntities(searchTerm, {
    placeholderData: {
      entities: Array(50).fill(ENTITY_QUERY_ITEM),
      cursor: undefined,
      blockNumber: undefined,
    },
    searchOptions: {
      resultsPerPage: 50,
      includeData: { payload: false },
      cursor,
    },
  });

  const handleSubmit = React.useCallback((value: string) => {
    if (value) {
      router.push({ pathname: '/entity/search', query: { q: value } }, undefined, { shallow: true });
    }
  }, [ router ]);

  const handleFirstClick = React.useCallback(() => {
    const query = { ...router.query };
    delete query.cursor;
    cursorHistoryRef.current = [];
    router.push({ pathname: '/entity/search', query }, undefined, { shallow: true });
  }, [ router ]);

  const handlePrevClick = React.useCallback(() => {
    const prevQuery = { ...router.query };

    if (cursorHistoryRef.current.length === 0) {
      delete prevQuery.cursor;
    } else {
      const prevCursors = [ ...cursorHistoryRef.current ];
      const prevCursor = prevCursors.pop();
      cursorHistoryRef.current = prevCursors;

      if (prevCursor) {
        prevQuery.cursor = prevCursor;
      } else {
        delete prevQuery.cursor;
      }
    }

    router.push({ pathname: '/entity/search', query: prevQuery }, undefined, { shallow: true });
  }, [ router ]);

  const handleNextClick = React.useCallback(() => {
    if (!data?.cursor) {
      return;
    }

    cursorHistoryRef.current = [ ...cursorHistoryRef.current, cursor ];

    router.push(
      { pathname: '/entity/search', query: { ...router.query, cursor: data.cursor } },
      undefined,
      { shallow: true },
    );
  }, [ data, cursor, router ]);

  const displayedItems = React.useMemo(() => {
    if (!data) return [];

    return data.entities.map((item) => ({
      type: 'golembase_entity' as const,
      golembase_entity: item.key,
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

  const pagination = (() => {
    if (isError || !enabled) {
      return null;
    }

    const hasPagination = cursor || data?.cursor;

    if (!hasPagination) {
      return null;
    }

    const showSkeleton = !cursor && !data?.cursor && isLoading;

    return (
      <ActionBar mt={{ base: 0, lg: -6 }} alignItems="center">
        <Flex as="nav" alignItems="center" ml="auto" my={ 1 } gap={ 2 }>
          <Skeleton loading={ showSkeleton }>
            <Button
              variant="pagination"
              size="sm"
              onClick={ handleFirstClick }
              disabled={ !cursor || isLoading }
            >
              First
            </Button>
          </Skeleton>
          <IconButton
            aria-label="Prev page"
            variant="pagination"
            boxSize={ 8 }
            onClick={ handlePrevClick }
            disabled={ !cursor || isLoading }
            loadingSkeleton={ showSkeleton }
          >
            <IconSvg name="arrows/east-mini" boxSize={ 5 }/>
          </IconButton>
          <IconButton
            aria-label="Next page"
            variant="pagination"
            boxSize={ 8 }
            onClick={ handleNextClick }
            disabled={ !data?.cursor || isLoading }
            loadingSkeleton={ showSkeleton }
          >
            <IconSvg name="arrows/east-mini" boxSize={ 5 } transform="rotate(180deg)"/>
          </IconButton>
        </Flex>
      </ActionBar>
    );
  })();

  const pageContent = (
    <>
      <PageTitle title="Entities search"/>
      <Box mb={ 6 }>
        <QueryBuilder
          initialValue={ searchTerm }
          onSubmit={ handleSubmit }
          isLoading={ isLoading && enabled }
        />
      </Box>
      { pagination }
      { content }
    </>
  );

  return (
    <>
      <HeaderMobile hideSearchButton/>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn paddingTop={{ base: 3, lg: 6 }}>
          <HeaderAlert/>
          <HeaderDesktop hideSearchBar/>
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
