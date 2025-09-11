import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

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
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import IconSvg from 'ui/shared/IconSvg';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import EntityStatus from 'ui/shared/statusTag/EntityStatus';

type Props = Pick<
  QueryWithPagesResult<'golemBaseIndexer:entities'>,
  'isLoading' | 'isError' | 'data'
>;

const EntityResultsTable = ({
  isLoading,
  isError,
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
    <Box overflowX="auto" width="100%">
      <TableRoot fontWeight={ 500 } minWidth="800px">
        <TableHeaderSticky>
          <TableRow>
            <TableColumnHeader width="80%">Search result</TableColumnHeader>
            <TableColumnHeader width="20%" minWidth="100px" maxWidth="120px" textAlign="center">Status</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { displayedItems.map((item, index) => (
            <TableRow key={ (isLoading ? 'placeholder_' : 'actual_') + index }>
              <TableCell
                fontSize="sm"
                textTransform="capitalize"
                verticalAlign="middle"
                width="70%"
                maxWidth="0"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
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
                    <Link
                      href={ route({ pathname: '/entity/[key]', query: { key: item.key } }) }
                      overflow="hidden"
                      whiteSpace="nowrap"
                      display="block"
                    >
                      { item.key }
                    </Link>
                  </Skeleton>
                </Flex>
              </TableCell>
              <TableCell
                fontSize="sm"
                textTransform="capitalize"
                verticalAlign="middle"
                width="30%"
                minWidth="140px"
                maxWidth="180px"
                textAlign="center"
              >
                <EntityStatus isLoading={ isLoading } status={ item.status }/>
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </TableRoot>
    </Box>
  );
};

export default EntityResultsTable;
