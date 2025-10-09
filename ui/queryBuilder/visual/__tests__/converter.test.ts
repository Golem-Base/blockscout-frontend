import { OWNER_KEY } from 'toolkit/components/forms/validators';

import { stringToRuleGroup, ruleGroupToString } from '../converter';

describe('converter', () => {
  describe('stringToRuleGroup', () => {
    it('should handle empty string', () => {
      const result = stringToRuleGroup('');
      expect(result).toEqual({ combinator: 'and', rules: [] });
    });

    it('should handle owner query', () => {
      const result = stringToRuleGroup('$owner="0x123"');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        field: OWNER_KEY,
        operator: '=',
        value: '0x123',
      });
    });

    it('should handle string field query', () => {
      const result = stringToRuleGroup('name="test"');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        field: 'string:name',
        operator: '=',
        value: 'test',
      });
    });

    it('should handle numeric field query', () => {
      const result = stringToRuleGroup('amount=100');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        field: 'numeric:amount',
        operator: '=',
        value: '100',
      });
    });

    it('should handle numeric comparison operators', () => {
      const result = stringToRuleGroup('amount > 50');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        field: 'numeric:amount',
        operator: '>',
        value: '50',
      });
    });

    it('should handle glob pattern matching', () => {
      const result = stringToRuleGroup('name ~ "test*"');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        field: 'string:name',
        operator: '~',
        value: 'test*',
      });
    });

    it('should handle lte and gte operators', () => {
      const result = stringToRuleGroup('amount >= 50 && amount <= 100');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(2);
      expect(result.rules[0]).toMatchObject({
        field: 'numeric:amount',
        operator: '>=',
        value: '50',
      });
      expect(result.rules[1]).toMatchObject({
        field: 'numeric:amount',
        operator: '<=',
        value: '100',
      });
    });

    it('should handle negation', () => {
      const result = stringToRuleGroup('!(name="test")');
      expect(result.combinator).toBe('and');
      expect(result.not).toBe(true);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        field: 'string:name',
        operator: '=',
        value: 'test',
      });
    });

    it('should handle negation with multiple conditions', () => {
      const result = stringToRuleGroup('!(name="test" && amount=100)');
      expect(result.combinator).toBe('and');
      expect(result.not).toBe(true);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0]).toMatchObject({
        combinator: 'and',
        rules: [
          { field: 'string:name', operator: '=', value: 'test' },
          { field: 'numeric:amount', operator: '=', value: '100' },
        ],
      });
    });

    it('should handle multiple AND conditions', () => {
      const result = stringToRuleGroup('name="test" && amount=100');
      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(2);
    });

    it('should handle complex query with parentheses and mixed operators', () => {
      const queryString = 'name = "test entity" && !(age > 18 || age < 65) && category = "inactive" && $owner = "0x1234567890123456789012345678901234567890"';
      const result = stringToRuleGroup(queryString);

      expect(result.combinator).toBe('and');
      expect(result.rules).toHaveLength(4);

      expect(result.rules[0]).toMatchObject({
        field: 'string:name',
        operator: '=',
        value: 'test entity',
      });

      expect(result.rules[1]).toMatchObject({
        combinator: 'and',
        not: true,
        rules: [
          {
            combinator: 'or',
            rules: [
              { field: 'numeric:age', operator: '>', value: '18' },
              { field: 'numeric:age', operator: '<', value: '65' },
            ],
          },
        ],
      });

      expect(result.rules[2]).toMatchObject({
        field: 'string:category',
        operator: '=',
        value: 'inactive',
      });

      expect(result.rules[3]).toMatchObject({
        field: OWNER_KEY,
        operator: '=',
        value: '0x1234567890123456789012345678901234567890',
      });
    });
  });

  describe('ruleGroupToString', () => {
    it('should handle empty rules', () => {
      const result = ruleGroupToString({ combinator: 'and', rules: [] });
      expect(result).toBe('');
    });

    it('should handle owner rule', () => {
      const input = {
        combinator: 'and' as const,
        rules: [ {
          id: 'test',
          field: OWNER_KEY,
          operator: '=',
          value: '0x123',
        } ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('$owner = "0x123"');
    });

    it('should handle string field rule', () => {
      const input = {
        combinator: 'and' as const,
        rules: [ {
          id: 'test',
          field: 'string:name',
          operator: '=',
          value: 'test',
        } ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('name = "test"');
    });

    it('should handle numeric field rule', () => {
      const input = {
        combinator: 'and' as const,
        rules: [ {
          id: 'test',
          field: 'numeric:amount',
          operator: '>',
          value: '100',
        } ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('amount > 100');
    });

    it('should handle multiple AND rules', () => {
      const input = {
        combinator: 'and' as const,
        rules: [
          { id: 'test1', field: 'string:name', operator: '=', value: 'test' },
          { id: 'test2', field: 'numeric:amount', operator: '=', value: '100' },
        ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('name = "test" && amount = 100');
    });

    it('should handle OR combinator', () => {
      const input = {
        combinator: 'or' as const,
        rules: [
          { id: 'test1', field: 'string:name', operator: '=', value: 'test1' },
          { id: 'test2', field: 'string:name', operator: '=', value: 'test2' },
        ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('name = "test1" || name = "test2"');
    });

    it('should handle nested groups', () => {
      const input = {
        combinator: 'and' as const,
        rules: [
          { id: 'test1', field: 'string:name', operator: '=', value: 'test' },
          {
            combinator: 'or' as const,
            rules: [
              { id: 'test2', field: 'numeric:amount', operator: '=', value: '100' },
              { id: 'test3', field: 'numeric:amount', operator: '=', value: '200' },
            ],
          },
        ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('name = "test" && (amount = 100 || amount = 200)');
    });

    it('should handle glob pattern matching', () => {
      const input = {
        combinator: 'and' as const,
        rules: [ {
          id: 'test',
          field: 'string:name',
          operator: '~',
          value: 'test*',
        } ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('name ~ "test*"');
    });

    it('should handle lte and gte operators', () => {
      const input = {
        combinator: 'and' as const,
        rules: [
          { id: 'test1', field: 'numeric:amount', operator: '>=', value: '50' },
          { id: 'test2', field: 'numeric:amount', operator: '<=', value: '100' },
        ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('amount >= 50 && amount <= 100');
    });

    it('should handle negation', () => {
      const input = {
        combinator: 'and' as const,
        not: true,
        rules: [ {
          id: 'test',
          field: 'string:name',
          operator: '=',
          value: 'test',
        } ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('!(name = "test")');
    });

    it('should handle negation with multiple conditions', () => {
      const input = {
        combinator: 'and' as const,
        not: true,
        rules: [
          { id: 'test1', field: 'string:name', operator: '=', value: 'test' },
          { id: 'test2', field: 'numeric:amount', operator: '=', value: '100' },
        ],
      };
      const result = ruleGroupToString(input);
      expect(result).toBe('!(name = "test" && amount = 100)');
    });
  });
});
