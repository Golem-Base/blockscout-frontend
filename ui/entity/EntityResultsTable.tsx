import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import {
  TableBody,
  TableColumnHeader,
  TableHeaderSticky,
  TableRoot,
  TableRow,
  TableCell,
} from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import IconSvg from 'ui/shared/IconSvg';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import EntityStatus from 'ui/shared/statusTag/EntityStatus';

type Props = Pick<
  QueryWithPagesResult<'golemBaseIndexer:entities'>,
  'isLoading' | 'isError' | 'pagination' | 'data'
>;

const EntityResultsTable = ({
  isLoading,
  isError,
  pagination,
  data,
}: Props) => {
  const displayedItems = data?.items || [];

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!displayedItems?.length) {
    return null;
  }

  return (
    <>
      <Box hideFrom="lg">
        { displayedItems.map((item, index) => (
          <Skeleton
            key={ (isLoading ? 'placeholder_' : 'actual_') + index }
            loading={ isLoading }
            display="block"
            whiteSpace="nowrap"
            overflow="hidden"
            mb={ 1 }
          >
            { item.key }
          </Skeleton>
        )) }
      </Box>
      <Box hideBelow="lg">
        <TableRoot fontWeight={ 500 }>
          <TableHeaderSticky
            top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          >
            <TableRow>
              <TableColumnHeader>Search result</TableColumnHeader>
              <TableColumnHeader width="150px">Status</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { displayedItems.map((item, index) => (
              <TableRow key={ (isLoading ? 'placeholder_' : 'actual_') + index }>
                <TableCell
                  fontSize="sm"
                  textTransform="capitalize"
                  verticalAlign="middle"
                >
                  <Flex>
                    <Skeleton
                      loading={ isLoading }
                      borderRadius="full"
                      boxSize={ 5 }
                      mr={ 2 }
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      minW={ 5 }
                      minH={ 5 }
                    >
                      <IconSvg name="docs" boxSize={ 5 } color="text.secondary"/>
                    </Skeleton>
                    <Skeleton loading={ isLoading } minW="120px">
                      <Link href={ `/entity/${ item.key }` }>{ item.key }</Link>
                    </Skeleton>
                  </Flex>
                </TableCell>
                <TableCell
                  fontSize="sm"
                  textTransform="capitalize"
                  verticalAlign="middle"
                >
                  <EntityStatus isLoading={ isLoading } status={ item.status }/>
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </TableRoot>
      </Box>
    </>
  );
};

export default EntityResultsTable;
