import { validateEntityQuery } from '../queryValidation';

describe('validateEntityQuery', () => {
  describe('valid queries', () => {
    it('should accept simple equality expression', () => {
      const result = validateEntityQuery('name = "test"');
      expect(result).toBeNull();
    });

    it('should accept numeric equality expression', () => {
      const result = validateEntityQuery('age = 25');
      expect(result).toBeNull();
    });

    it('should accept ownership expression', () => {
      const result = validateEntityQuery('$owner = "0x1234567890123456789012345678901234567890"');
      expect(result).toBeNull();
    });

    it('should accept AND expression', () => {
      const result = validateEntityQuery('name = "test" && age = 25');
      expect(result).toBeNull();
    });

    it('should accept OR expression', () => {
      const result = validateEntityQuery('name = "test" || age = 25');
      expect(result).toBeNull();
    });

    it('should accept complex nested expression', () => {
      const result = validateEntityQuery('(name = "test" && age = 25) || (type = "admin" && $owner = "0x1234567890123456789012345678901234567890")');
      expect(result).toBeNull();
    });
  });

  describe('invalid queries', () => {
    it('should reject unmatched opening parenthesis', () => {
      const result = validateEntityQuery('(name = "test"');
      expect(result).toEqual('Unmatched parentheses in query');
    });

    it('should reject unmatched closing parenthesis', () => {
      const result = validateEntityQuery('name = "test")');
      expect(result).toEqual('Unmatched parentheses in query');
    });

    it('should reject invalid operators', () => {
      const result = validateEntityQuery('name = "test" & age = 25');
      expect(result).toEqual('Invalid operators. Use && for AND, || for OR');
    });

    it('should reject operators at start', () => {
      const result = validateEntityQuery('&& name = "test"');
      expect(result).toEqual('Invalid operators. Use && for AND, || for OR');
    });

    it('should reject operators at end', () => {
      const result = validateEntityQuery('name = "test" &&');
      expect(result).toEqual('Invalid operators. Use && for AND, || for OR');
    });

    it('should reject consecutive operators', () => {
      const result = validateEntityQuery('name = "test" && && age = 25');
      expect(result).toEqual('Invalid operators. Use && for AND, || for OR');
    });

    it('should reject invalid equality expression', () => {
      const result = validateEntityQuery('name =');
      expect(result).toEqual('Invalid equality expression. Use format: field = "string" or field = number');
    });

    it('should reject unquoted string', () => {
      const result = validateEntityQuery('name = test');
      expect(result).toEqual('Invalid equality expression. Use format: field = "string" or field = number');
    });

    it('should reject unquoted string with special chars', () => {
      const result = validateEntityQuery('name = test123\'');
      expect(result).toEqual('Invalid equality expression. Use format: field = "string" or field = number');
    });

    it('should reject invalid ownership expression', () => {
      const result = validateEntityQuery('$owner = "invalid"');
      expect(result).toEqual('Invalid ownership expression. Use format: $owner = "0x..."');
    });
  });
});
