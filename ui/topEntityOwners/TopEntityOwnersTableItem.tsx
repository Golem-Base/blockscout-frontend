import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { LeaderboardEntitiesOwnedItem } from '@golembase/l3-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  item: LeaderboardEntitiesOwnedItem;
  isLoading?: boolean;
};

const TopEntityOwnersTableItem = ({
  item,
  isLoading,
}: Props) => {

  const addressProp = { hash: item.address };

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { item.rank }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Flex alignItems="center" columnGap={ 2 }>
          <AddressEntity
            address={ addressProp }
            isLoading={ isLoading }
            fontWeight={ 700 }
            my="2px"
          />
        </Flex>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          <Text lineHeight="24px" as="span">{ item.entities_count }</Text>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TopEntityOwnersTableItem);
