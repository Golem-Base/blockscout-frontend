import BigNumber from 'bignumber.js';

import { WEI } from 'ui/shared/value/utils';

export const getSafeCost = (cost: string | undefined) => {
  try {
    if (!cost) return '-';
    return BigNumber(cost).div(WEI).toFormat();
  } catch {
    return '-';
  }
};
