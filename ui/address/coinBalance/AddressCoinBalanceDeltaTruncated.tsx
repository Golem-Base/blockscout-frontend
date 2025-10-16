import { Stat } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { ZERO } from 'toolkit/utils/consts';

const AddressCoinBalanceDeltaTruncated = ({ isLoading, deltaBn }: { isLoading: boolean; deltaBn: BigNumber }) => {
  const isPositiveDelta = deltaBn.gte(ZERO);

  const MAX_DELTA_LENGTH = 12;
  const formattedDeltaBn = deltaBn.dp(8).toFormat();
  const displayDelta = formattedDeltaBn.length > MAX_DELTA_LENGTH ? `${ formattedDeltaBn.slice(0, MAX_DELTA_LENGTH) }...` : formattedDeltaBn;

  return (
    <Skeleton loading={ isLoading }>
      <Tooltip
        positioning={{ placement: 'top' }}
        disabled={ formattedDeltaBn.length <= MAX_DELTA_LENGTH }
        content={ (
          <Stat.Root size="sm" positive={ isPositiveDelta }>
            <Stat.ValueText whiteSpace="normal" wordBreak="break-word" maxW="250px">
              { formattedDeltaBn }
            </Stat.ValueText>

            { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
          </Stat.Root>
        ) }
      >
        <Stat.Root flexGrow="0" size="sm" positive={ isPositiveDelta }>
          <Stat.ValueText fontWeight={ 600 }>
            { displayDelta }
          </Stat.ValueText>
          { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
        </Stat.Root>
      </Tooltip>
    </Skeleton>
  );
};

export default AddressCoinBalanceDeltaTruncated;
