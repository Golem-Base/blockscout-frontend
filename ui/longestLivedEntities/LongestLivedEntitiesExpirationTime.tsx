import { Flex } from '@chakra-ui/react';
import { isNil } from 'es-toolkit';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  timestamp?: string | number | null;
  isLoading?: boolean;
};

const LongestLivedEntitiesExpirationTime = ({ timestamp, isLoading }: Props) => {
  return (
    <Skeleton loading={ isLoading } cursor="pointer">
      <Tooltip content={ dayjs(timestamp).format('llll') }>
        <Flex alignItems="center" gap={ 2 }>
          { isNil(timestamp) ? 'Far in the future' : dayjs(timestamp).fromNow() }
          <IconSvg name="clock" boxSize={ 4 } color="gray.500" isLoading={ isLoading }/>
        </Flex>
      </Tooltip>
    </Skeleton>
  );
};

export default LongestLivedEntitiesExpirationTime;
