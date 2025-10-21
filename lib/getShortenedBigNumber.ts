import type BigNumber from 'bignumber.js';

export const getShortenedBigNumber = (bn: BigNumber) => {
  switch (true) {
    case bn.gte(1_000_000_000_000_000_000_000_000):
      return bn.div(1_000_000_000_000_000_000_000_000).dp(3).toFormat() + 'Sp'; // Septillion

    case bn.gte(1_000_000_000_000_000_000_000):
      return bn.div(1_000_000_000_000_000_000_000).dp(3).toFormat() + 'Sx'; // Sextillion

    case bn.gte(1_000_000_000_000_000_000):
      return bn.div(1_000_000_000_000_000_000).dp(3).toFormat() + 'Qi'; // Quintillion

    case bn.gte(1_000_000_000_000_000):
      return bn.div(1_000_000_000_000_000).dp(3).toFormat() + 'Qa'; // Quadrillion

    case bn.gte(1_000_000_000_000):
      return bn.div(1_000_000_000_000).dp(3).toFormat() + 'T'; // Trillion

    case bn.gte(1_000_000_000):
      return bn.div(1_000_000_000).dp(3).toFormat() + 'B'; // Billion

    case bn.gte(1_000_000):
      return bn.div(1_000_000).dp(3).toFormat() + 'M'; // Million

    case bn.gte(1_000):
      return bn.div(1_000).dp(3).toFormat() + 'K'; // Thousand (Kilo)

    case bn.gte(1):
      return bn.dp(4).toFormat();

    default:
      return bn.dp(8).toFormat();
  }
};
