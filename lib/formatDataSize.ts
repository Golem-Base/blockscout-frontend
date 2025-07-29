/**
 * Formats data size in bytes to a human-readable string (bytes, KiB, MiB, GiB, etc.)
 * @param sizeInBytes - Size in bytes as string, number, bigint, or undefined
 * @returns Formatted string like "1.23 KiB" or "Unknown" if input is invalid
 */
export default function formatDataSize(sizeInBytes?: string | number | bigint): string {
  if (typeof sizeInBytes === 'undefined' || sizeInBytes === null) {
    return 'Unknown';
  }

  let bytes: bigint;
  try {
    bytes = typeof sizeInBytes === 'bigint' ? sizeInBytes : BigInt(String(sizeInBytes));
  } catch {
    return 'Unknown';
  }

  if (bytes < BigInt(0)) return 'Unknown';

  const kb = BigInt(1024);
  const mb = kb * kb;
  const gb = mb * kb;
  const tb = gb * kb;

  if (bytes < kb) return `${ bytes } bytes`;

  if (bytes < mb) return formatUnit(bytes, kb, 'KiB');
  if (bytes < gb) return formatUnit(bytes, mb, 'MiB');
  if (bytes < tb) return formatUnit(bytes, gb, 'GiB');
  return formatUnit(bytes, tb, 'TiB');
}

function formatUnit(value: bigint, divisor: bigint, unit: string): string {
  const whole = value / divisor;
  const remainder = value % divisor;
  const fraction = (remainder * BigInt(100)) / divisor;
  return fraction > BigInt(0) ? `${ whole }.${ fraction.toString().padStart(2, '0') } ${ unit }` : `${ whole } ${ unit }`;
}
