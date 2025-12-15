import BigNumber from 'bignumber.js';

import { WEI } from 'toolkit/utils/consts';

export const getSafeCost = (cost: string | undefined) => {
  try {
    if (!cost) return '-';
    return BigNumber(cost).div(WEI).toFormat();
  } catch {
    return '-';
  }
};
