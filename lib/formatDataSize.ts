import { isNil } from 'es-toolkit';

const byte = BigInt(1);
const kb = BigInt(1024);
const mb = kb * kb;
const gb = mb * kb;
const tb = gb * kb;

/**
 * Formats a data size in bytes into a human-readable string (bytes, KiB, MiB, GiB, etc.)
 * @param sizeInBytes - Size in bytes as a string, number, bigint, or undefined
 * @param shortBytes - If true, returns “B” instead of “bytes” for byte values
 * @param precision - Number of digits to include after the decimal point
 * @returns A formatted string such as “1.23 KiB”, or “Unknown” if the input is invalid
 */
export default function formatDataSize(sizeInBytes?: string | number | bigint | null, shortBytes = false, precision = 2): string {
  if (isNil(sizeInBytes) || sizeInBytes === null) {
    return 'Unknown';
  }

  let bytes: bigint;
  try {
    bytes = typeof sizeInBytes === 'bigint' ? sizeInBytes : BigInt(String(sizeInBytes));
  } catch {
    return 'Unknown';
  }

  if (bytes < BigInt(0)) return 'Unknown';

  if (bytes < kb) return formatUnit(bytes, byte, precision, shortBytes ? 'B' : 'bytes');
  if (bytes < mb) return formatUnit(bytes, kb, precision, 'KiB');
  if (bytes < gb) return formatUnit(bytes, mb, precision, 'MiB');
  if (bytes < tb) return formatUnit(bytes, gb, precision, 'GiB');
  return formatUnit(bytes, tb, precision, 'TiB');
}

function formatUnit(value: bigint, divisor: bigint, precision: number, unit: string): string {
  const whole = value / divisor;
  const remainder = value % divisor;
  const fraction = (remainder * BigInt(10 ** precision)) / divisor;
  return fraction > BigInt(0) ? `${ whole }.${ fraction.toString().padStart(precision, '0') } ${ unit }` : `${ whole } ${ unit }`;

}
