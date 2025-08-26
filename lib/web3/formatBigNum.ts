import BigNumber from 'bignumber.js';
import { isNil } from 'es-toolkit';

export function formatBigNum(value?: BigNumber.Value | null): string {
  return !isNil(value) ? BigNumber(value).toFormat() : '-';
}
