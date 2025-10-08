import { Flex } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  expiresAtTimestampSec: string;
  isLoading?: boolean;
};

/**
 * @param {string | number | bigint} baseMs - base timestamp in milliseconds
 * @param {string | number | bigint} addSec - seconds to add
 * @returns {dayjs.Dayjs} safely computed date
 */
function safeAddTimestamp(baseMs: string | number | bigint, addSec: string | number | bigint): dayjs.Dayjs {
  const base = BigInt(baseMs);
  const add = BigInt(addSec) * BigInt(1000);

  const sum = base + add;

  if (sum > BigInt(Number.MAX_SAFE_INTEGER)) {
    const MAX_DATE_MS = BigInt(8640000000000000);
    const safeDate = new Date(Number(sum % MAX_DATE_MS));

    return dayjs(safeDate);
  }

  return dayjs(Number(sum));
}

const LongestLivedEntitiesExpirationTime = ({ expiresAtTimestampSec, isLoading }: Props) => {
  const now = Date.now();
  const date = safeAddTimestamp(now, expiresAtTimestampSec);

  return (
    <Skeleton loading={ isLoading } cursor="pointer">
      <Tooltip content={ date.format('llll') }>
        <Flex alignItems="center" gap={ 2 }>
          <IconSvg name="clock" boxSize={ 4 } color="gray.500" isLoading={ isLoading }/>
          { date.fromNow() }
        </Flex>
      </Tooltip>
    </Skeleton>
  );
};

export default LongestLivedEntitiesExpirationTime;
