import formatDataSize from './formatDataSize';

describe('formatDataSize', () => {
  describe('bigint inputs', () => {
    it('should format all units correctly', () => {
      expect(formatDataSize(BigInt(0))).toBe('0 bytes');
      expect(formatDataSize(BigInt(512))).toBe('512 bytes');
      expect(formatDataSize(BigInt(1024))).toBe('1 KiB');
      expect(formatDataSize(BigInt(1536))).toBe('1.50 KiB');
      expect(formatDataSize(BigInt(1048576))).toBe('1 MiB');
      expect(formatDataSize(BigInt(1572864))).toBe('1.50 MiB');
      expect(formatDataSize(BigInt(1073741824))).toBe('1 GiB');
      expect(formatDataSize(BigInt(1610612736))).toBe('1.50 GiB');
      expect(formatDataSize(BigInt(1099511627776))).toBe('1 TiB');
      expect(formatDataSize(BigInt(1649267441664))).toBe('1.50 TiB');
    });
  });

  describe('number inputs', () => {
    it('should format all units correctly', () => {
      expect(formatDataSize(0)).toBe('0 bytes');
      expect(formatDataSize(1024)).toBe('1 KiB');
      expect(formatDataSize(1048576)).toBe('1 MiB');
      expect(formatDataSize(1073741824)).toBe('1 GiB');
      expect(formatDataSize(1099511627776)).toBe('1 TiB');
    });
  });

  describe('string inputs', () => {
    it('should format valid numeric strings correctly', () => {
      expect(formatDataSize('0')).toBe('0 bytes');
      expect(formatDataSize('1024')).toBe('1 KiB');
      expect(formatDataSize('1048576')).toBe('1 MiB');
      expect(formatDataSize('1073741824')).toBe('1 GiB');
      expect(formatDataSize('1099511627776')).toBe('1 TiB');
      expect(formatDataSize('9223372036854775807')).toBe('8388607.99 TiB');
    });

    it('should return "Unknown" for invalid strings', () => {
      expect(formatDataSize('abc')).toBe('Unknown');
      expect(formatDataSize('123abc')).toBe('Unknown');
      expect(formatDataSize('1.2.3')).toBe('Unknown');
      expect(formatDataSize('1024 bytes')).toBe('Unknown');
      expect(formatDataSize('NaN')).toBe('Unknown');
      expect(formatDataSize('Infinity')).toBe('Unknown');
      expect(formatDataSize('1024.5')).toBe('Unknown'); // BigInt can't parse decimals
      expect(formatDataSize('1e3')).toBe('Unknown'); // BigInt doesn't support scientific notation
    });

    it('should handle whitespace as zero bytes', () => {
      expect(formatDataSize('')).toBe('0 bytes'); // BigInt('') returns 0n
      expect(formatDataSize(' ')).toBe('0 bytes'); // BigInt(' ') returns 0n
    });
  });

  describe('edge cases', () => {
    it('should return "Unknown" for invalid inputs', () => {
      expect(formatDataSize(undefined)).toBe('Unknown');
      expect(formatDataSize(null as unknown as string)).toBe('Unknown');
      expect(formatDataSize(-1)).toBe('Unknown');
      expect(formatDataSize(BigInt(-1))).toBe('Unknown');
      expect(formatDataSize('-1024')).toBe('Unknown');
    });

    it('should handle boundary values correctly', () => {
      expect(formatDataSize(1023)).toBe('1023 bytes');
      expect(formatDataSize(1048575)).toBe('1023.99 KiB'); // 1024^2 - 1
      expect(formatDataSize(1073741823)).toBe('1023.99 MiB'); // 1024^3 - 1
      expect(formatDataSize(1099511627775)).toBe('1023.99 GiB'); // 1024^4 - 1
    });
  });

  describe('precision and formatting', () => {
    it('should format fractions correctly', () => {
      expect(formatDataSize(1536)).toBe('1.50 KiB'); // .5 -> .50
      expect(formatDataSize(1562)).toBe('1.52 KiB'); // Shows exactly 2 decimals
    });

    it('should show no decimal places for whole numbers', () => {
      expect(formatDataSize(1024)).toBe('1 KiB');
      expect(formatDataSize(2048)).toBe('2 KiB');
      expect(formatDataSize(1048576)).toBe('1 MiB');
    });

    it('should handle very small fractions correctly', () => {
      expect(formatDataSize(1025)).toBe('1 KiB'); // Very small fraction, shows as whole number
      expect(formatDataSize(1035)).toBe('1.01 KiB'); // 11/1024 ≈ 0.01074219, rounds to .01
    });
  });

  describe('short bytes', () => {
    it('should format bytes correctly', () => {
      expect(formatDataSize(1000, true)).toBe('1000 B');
    });
  });

  describe('precision', () => {
    it('should format fractions correctly', () => {
      expect(formatDataSize(1059, true, 5)).toBe('1.03417 KiB');
      expect(formatDataSize(1059, true, 2)).toBe('1.03 KiB');
      expect(formatDataSize(1059, true, 0)).toBe('1 KiB');
    });
  });
});
