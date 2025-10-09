import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { dayjsBigFuture } from 'toolkit/utils/dayjsBigFuture';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  expiresAtTimestampSec: string;
  isLoading?: boolean;
};

const LongestLivedEntitiesExpirationTime = ({ expiresAtTimestampSec, isLoading }: Props) => {
  const { formatted, fromNow } = dayjsBigFuture(Number(expiresAtTimestampSec) * 1000);

  return (
    <Skeleton loading={ isLoading } cursor="pointer">
      <Tooltip content={ formatted }>
        <Flex alignItems="center" gap={ 2 }>
          <IconSvg name="clock" boxSize={ 4 } color="gray.500" isLoading={ isLoading }/>
          { fromNow }
        </Flex>
      </Tooltip>
    </Skeleton>
  );
};

export default LongestLivedEntitiesExpirationTime;
