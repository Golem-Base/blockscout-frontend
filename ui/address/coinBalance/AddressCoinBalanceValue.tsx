import BigNumber from 'bignumber.js';
import React from 'react';

import { getShortenedBigNumber } from 'lib/getShortenedBigNumber';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { WEI } from 'ui/shared/value/utils';

export function formatScientific(value: string) {
  const str = value.replace(/^0+/, '');

  if (str.length <= 1) return str;

  const first = str[0];
  const next = str.slice(1, 3);
  const exponent = str.length - 1;

  return `${ first }.${ next }e+${ exponent }`;
}

interface Props {
  isLoading: boolean;
  value: string;
}

const AddressCoinBalanceValue = ({ isLoading, value }: Props) => {
  const valueBn = BigNumber(value).div(WEI);
  const formattedTotalValue = valueBn.dp(8).toFormat();
  const shortenedValue = getShortenedBigNumber(valueBn);

  return (
    <Skeleton loading={ isLoading } color="text.secondary" display="inline-block">
      <Tooltip
        positioning={{ placement: 'top' }}
        disabled={ shortenedValue === formattedTotalValue }
        content={ formattedTotalValue }
      >
        <span>{ shortenedValue }</span>
      </Tooltip>
    </Skeleton>
  );
};

export default AddressCoinBalanceValue;
