import { integerValidator } from './integer';

describe('integerValidator', () => {
  it('should return true for valid positive integer strings', () => {
    expect(integerValidator('0')).toBe(true);
    expect(integerValidator('123')).toBe(true);
  });

  it('should return true for valid negative integer strings', () => {
    expect(integerValidator('-1')).toBe(true);
    expect(integerValidator('-999999')).toBe(true);
  });

  it('should return error message for float strings', () => {
    expect(integerValidator('0.5')).toBe('Must be a valid integer');
    expect(integerValidator('-1.5')).toBe('Must be a valid integer');
  });

  it('should return error message for strings with letters', () => {
    expect(integerValidator('abc')).toBe('Must be a valid integer');
    expect(integerValidator('1a2b3')).toBe('Must be a valid integer');
  });
});
