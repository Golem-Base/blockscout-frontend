import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { dayBigFuture } from 'toolkit/utils/dayBigFuture';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  expiresAtTimestampSec: string;
  expiresAtTimestamp?: string;
  isLoading?: boolean;
};

const LongestLivedEntitiesExpirationTime = ({ expiresAtTimestampSec, expiresAtTimestamp, isLoading }: Props) => {
  const { formatted, fromNow } = dayBigFuture(Number(expiresAtTimestampSec), expiresAtTimestamp);

  return (
    <Skeleton loading={ isLoading } cursor="pointer">
      <Tooltip content={ formatted } disabled={ !formatted }>
        <Flex alignItems="center" gap={ 2 }>
          <IconSvg name="clock" boxSize={ 4 } color="gray.500" isLoading={ isLoading }/>
          { fromNow }
        </Flex>
      </Tooltip>
    </Skeleton>
  );
};

export default LongestLivedEntitiesExpirationTime;
