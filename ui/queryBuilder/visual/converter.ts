import type { RuleGroupType, RuleType } from 'react-querybuilder';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { OWNER_KEY } from 'toolkit/components/forms/validators';
import { parseField } from 'ui/queryBuilder/visual/utils';

const OWNER_RULE_REGEXP = /\$owner\s*(=|!=)\s*"([^"]+)"/;
const STRING_RULE_REGEXP = /^([a-z_]\w*)\s*([=<>]=?|!=|~|!~)\s*"([^"]+)"$/i;
const NUMBER_RULE_REGEXP = /^([a-z_]\w*)\s*([=<>]=?|!=)\s*(\d+)$/i;

const createRuleId = () => `rule_${ Math.random().toString(36).slice(2, 11) }`;

const formatRule = (rule: RuleType): string => {
  const { field, operator, value } = rule;
  if (!field || !value) return '';

  const [ fieldType, fieldName ] = parseField(field);

  if (fieldType === 'numeric') {
    return `${ fieldName } ${ operator } ${ value }`;
  }

  return `${ fieldName } ${ operator } "${ value }"`;
};

const parseOwnerRule = (part: string): RuleType | null => {
  const match = part.match(OWNER_RULE_REGEXP);
  return match ? {
    id: createRuleId(),
    field: OWNER_KEY,
    operator: match[1],
    value: match[2],
  } : null;
};

const parseStringRule = (part: string): RuleType | null => {
  const match = part.match(STRING_RULE_REGEXP);
  return match ? {
    id: createRuleId(),
    field: `string:${ match[1] }`,
    operator: match[2],
    value: match[3],
  } : null;
};

const parseNumericRule = (part: string): RuleType | null => {
  const match = part.match(NUMBER_RULE_REGEXP);
  return match ? {
    id: createRuleId(),
    field: `numeric:${ match[1] }`,
    operator: match[2],
    value: match[3],
  } : null;
};

const parseRule = (part: string): RuleType => {
  return parseOwnerRule(part) ||
         parseStringRule(part) ||
         parseNumericRule(part) ||
         {
           id: createRuleId(),
           field: 'string:',
           operator: '=',
           value: part,
         };
};

export function ruleGroupToString(ruleGroup: RuleGroupType): string {
  if (!ruleGroup.rules?.length) return '';

  const parts: Array<string> = [];

  const processRule = (rule: RuleType | RuleGroupType) => {
    if ('combinator' in rule) {
      const nested = ruleGroupToString(rule);
      if (nested) parts.push(`(${ nested })`);
    } else {
      const formatted = formatRule(rule);
      if (formatted) parts.push(formatted);
    }
  };

  ruleGroup.rules.forEach(processRule);

  const separator = ruleGroup.combinator === 'or' ? ' || ' : ' && ';
  const result = parts.join(separator);

  return ruleGroup.not ? `!(${ result })` : result;
}

function preprocessQueryForCEL(queryString: string): string {
  return queryString
    .replace(/=/g, '==')
    .replace(/\$owner/g, 'owner_address');
}

function postprocessParsedQuery(ruleGroup: RuleGroupType): RuleGroupType {
  const processRule = (rule: RuleType | RuleGroupType): RuleType | RuleGroupType => {
    if ('combinator' in rule) {
      return {
        ...rule,
        rules: rule.rules.map(processRule),
      };
    }

    if (rule.field === 'owner_address') {
      return { ...rule, field: OWNER_KEY };
    }

    if (rule.field) {
      const isNumeric = typeof rule.value === 'number' ||
        (typeof rule.value === 'string' && /^\d+$/.test(rule.value));

      return {
        ...rule,
        field: `${ isNumeric ? 'numeric' : 'string' }:${ rule.field }`,
        value: isNumeric ? String(rule.value) : rule.value,
      };
    }

    return rule;
  };

  return {
    ...ruleGroup,
    rules: ruleGroup.rules.map(processRule),
  };
}

export function stringToRuleGroup(queryString: string): RuleGroupType {
  if (!queryString.trim()) {
    return { combinator: 'and', rules: [] };
  }

  const trimmed = queryString.trim();
  const isNegated = trimmed.startsWith('!(') && trimmed.endsWith(')') &&
                   !trimmed.slice(2, -1).includes('&&') && !trimmed.slice(2, -1).includes('||');
  const content = isNegated ? trimmed.slice(2, -1) : trimmed;

  try {
    const celQuery = preprocessQueryForCEL(content);
    const parsedQuery = parseCEL(celQuery);
    const result = postprocessParsedQuery(parsedQuery);
    if (result.rules.length === 0) {
      throw new Error('CEL parser returned empty rules');
    }
    return isNegated ? { ...result, not: true } : result;
  } catch {
    const parts = content.split(/\s*&&\s*/).map(part => part.trim()).filter(Boolean);
    return {
      combinator: 'and',
      rules: parts.map(parseRule),
      not: isNegated,
    };
  }
}
