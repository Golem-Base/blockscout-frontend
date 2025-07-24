import hexToSize from './hexToSize';

describe('hexToSize', () => {
  it('should calculate length for hex string with 0x prefix', () => {
    expect(hexToSize('0x123456')).toBe(3);
    expect(hexToSize('0x1234567890abcdef')).toBe(8);
  });

  it('should calculate length for hex string without 0x prefix', () => {
    expect(hexToSize('123456')).toBe(3);
    expect(hexToSize('1234567890abcdef')).toBe(8);
  });

  it('should handle empty strings', () => {
    expect(hexToSize('')).toBe(0);
    expect(hexToSize('0x')).toBe(0);
  });

  it('should handle large hex strings', () => {
    const largeHex = '0x' + '1234567890abcdef'.repeat(100);
    expect(hexToSize(largeHex)).toBe(800);
  });

  it('should handle odd length hex strings', () => {
    expect(hexToSize('0x123')).toBe(1.5);
    expect(hexToSize('123')).toBe(1.5);
  });

  it('should handle transaction-like hex strings', () => {
    // Example transaction raw input
    const txInput = '0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37' +
        'aa960450000000000000000000000000000000000000000000000000000000000000000';
    expect(hexToSize(txInput)).toBe(68);
  });
});
