import type { RuleGroupType, RuleType } from 'react-querybuilder';

import { OWNER_KEY } from 'toolkit/components/forms/validators';
import { parseField } from 'ui/queryBuilder/visual/utils';

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
  const match = part.match(/\$owner\s*=\s*"([^"]+)"/);
  return match ? {
    id: createRuleId(),
    field: OWNER_KEY,
    operator: '=',
    value: match[1],
  } : null;
};

const parseStringRule = (part: string): RuleType | null => {
  const match = part.match(/^([a-z_]\w*)\s*([=<>]=?|!=)\s*"([^"]+)"$/i);
  return match ? {
    id: createRuleId(),
    field: `string:${ match[1] }`,
    operator: match[2] === '!=' ? '!=' : match[2],
    value: match[3],
  } : null;
};

const parseNumericRule = (part: string): RuleType | null => {
  const match = part.match(/^([a-z_]\w*)\s*([=<>]=?|!=)\s*(\d+)$/i);
  return match ? {
    id: createRuleId(),
    field: `numeric:${ match[1] }`,
    operator: match[2] === '!=' ? '!=' : match[2],
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
  return parts.join(separator);
}

export function stringToRuleGroup(queryString: string): RuleGroupType {
  if (!queryString.trim()) {
    return { combinator: 'and', rules: [] };
  }

  const parts = queryString
    .split(/\s*&&\s*/)
    .map(part => part.trim())
    .filter(Boolean);

  const rules = parts.map(parseRule);

  return { combinator: 'and', rules };
}
