import BigNumber from 'bignumber.js';

export const getShortenedBigNumber = (bn: BigNumber) => {
  if (bn.gte(1_000_000)) {
    const exponent = bn.e!;
    const mantissa = bn.dividedBy(new BigNumber(10).pow(exponent)).toPrecision(4);
    return `${ mantissa }e+${ exponent }`;

  } else {
    return bn.dp(8).toFormat();
  }
};
