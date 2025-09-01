export const GAS_UNITS = [
  'usd',
  'gwei',
  'wei',
] as const;

export type GasUnit = typeof GAS_UNITS[number];
