import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Entity } from '@golembase/l3-indexer-types';

import { route } from 'nextjs-routes';

import dayjs from 'lib/date/dayjs';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import IconSvg from 'ui/shared/IconSvg';

import DetailedInfoTimestamp from './LongestLivedEntitiesExpirationTime';

type Props = {
  item: Entity;
  isLoading?: boolean;
  rank: number;
};

const LongestLivedEntitiesTableItem = ({
  item,
  isLoading,
  rank,
}: Props) => {

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { rank }
        </Skeleton>
      </TableCell>
      <TableCell
        fontSize="sm"
        textTransform="capitalize"
        verticalAlign="middle"
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
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          <DetailedInfoTimestamp
            iconDirection="left"
            timestamp={
              dayjs().add(Number(rank), 'hours').valueOf() }
            isLoading={ isLoading }
          />
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(LongestLivedEntitiesTableItem);
