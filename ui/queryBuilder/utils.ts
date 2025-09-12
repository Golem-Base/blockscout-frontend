import type { RuleGroupType } from 'react-querybuilder';

import { COMBINATOR_MAP, OPERATOR_MAP, VALIDATION_PATTERNS } from './constants';

export const parseTextToVisual = (text: string): RuleGroupType => {
  if (!text.trim()) {
    return { combinator: 'and', rules: [] };
  }

  // Handle complex expressions with AND/OR
  const parts = text.trim().split(/\s+(&&|\|\|)\s+/);
  
  if (parts.length > 1) {
    // Multiple parts - build a group
    const rules = [];
    let combinator = 'and';
    
    for (let i = 0; i < parts.length; i += 2) {
      const part = parts[i];
      if (i + 1 < parts.length) {
        const op = parts[i + 1];
        combinator = op === '||' ? 'or' : 'and';
      }
      
      const parsedPart = parseTextToVisual(part);
      if (parsedPart.rules.length > 0) {
        rules.push(...parsedPart.rules);
      }
    }
    
    return { combinator, rules };
  }

  // Single expression
  const singleText = text.trim();
  
  // Handle parentheses
  const parenMatch = singleText.match(/^\s*!?\s*\((.+)\)\s*$/);
  if (parenMatch) {
    return parseTextToVisual(parenMatch[1]);
  }

  // Handle $owner queries
  const ownerMatch = singleText.match(/^\$owner\s*(!=|=)\s*"([^"]+)"$/);
  if (ownerMatch) {
    return {
      combinator: 'and',
      rules: [ {
        field: '$owner',
        operator: ownerMatch[1],
        value: ownerMatch[2],
      } ],
    };
  }

  // Handle string annotation queries with various operators
  const stringPatterns = [
    /^([\p{L}_][\p{L}\p{N}_]*)\s*(~|!~)\s*"([^"]+)"$/u,  // glob patterns
    /^([\p{L}_][\p{L}\p{N}_]*)\s*(!=|=|>=|<=|>|<)\s*"([^"]+)"$/u,  // string comparisons
  ];

  for (const pattern of stringPatterns) {
    const match = singleText.match(pattern);
    if (match) {
      return {
        combinator: 'and',
        rules: [ {
          field: 'string_annotation',
          operator: match[2],
          value: `${ match[1] }=${ match[3] }`,
        } ],
      };
    }
  }

  // Handle numeric annotation queries
  const numericMatch = singleText.match(/^([\p{L}_][\p{L}\p{N}_]*)\s*(!=|=|>=|<=|>|<)\s*(\d+(?:\.\d+)?)$/u);
  if (numericMatch) {
    return {
      combinator: 'and',
      rules: [ {
        field: 'numeric_annotation',
        operator: numericMatch[2],
        value: `${ numericMatch[1] }=${ numericMatch[3] }`,
      } ],
    };
  }

  return { combinator: 'and', rules: [] };
};

export const convertQueryToString = (query: RuleGroupType): string => {
  if (!query.rules || query.rules.length === 0) {
    return '';
  }

  const combinator = COMBINATOR_MAP[query.combinator] || '&&';

  const ruleStrings = query.rules.map((rule) => {
    if ('rules' in rule) {
      return `(${ convertQueryToString(rule) })`;
    } else {
      const { field, operator, value } = rule;
      const mappedOperator = OPERATOR_MAP[operator] || operator;

      if (field === '$owner') {
        return `$owner ${ mappedOperator } "${ value }"`;
      } else if (field === 'string_annotation' || field === 'numeric_annotation') {
        // Parse the annotation value (format: "key=value")
        const annotationValue = String(value || '');
        const match = annotationValue.match(/^(.+?)=(.+)$/);
        
        if (match) {
          const [ , key, val ] = match;
          if (field === 'string_annotation') {
            // For string annotations, wrap value in quotes
            return `${ key } ${ mappedOperator } "${ val }"`;
          } else {
            // For numeric annotations, don't wrap in quotes
            return `${ key } ${ mappedOperator } ${ val }`;
          }
        } else {
          // If no value part, just return the key with operator
          return `${ annotationValue } ${ mappedOperator } ""`;
        }
      } else {
        const valueStr = typeof value === 'string' ? `"${ value }"` : String(value);
        return `${ field } ${ mappedOperator } ${ valueStr }`;
      }
    }
  });

  return ruleStrings.join(` ${ combinator } `);
};

export const validateQuery = (query: string): { isValid: boolean; errors: Array<string> } => {
  const errors: Array<string> = [];

  if (!query.trim()) {
    return { isValid: true, errors: [] };
  }

  // Validate $owner addresses
  const ownerMatches = [ ...query.matchAll(/\$owner\s*[!=]+\s*"([^"]+)"/g) ];
  for (const match of ownerMatches) {
    const address = match[1];
    if (!VALIDATION_PATTERNS.OWNER_ADDRESS.test(address)) {
      errors.push('Owner address must be a valid Ethereum address (0x followed by 40 hex characters)');
    }
  }

  // Validate annotation keys (both string and numeric)
  const annotationMatches = [
    ...query.matchAll(/([\p{L}_][\p{L}\p{N}_]*)\s*[=!<>~]+\s*"[^"]+"/gu), // string annotations
    ...query.matchAll(/([\p{L}_][\p{L}\p{N}_]*)\s*[=!<>]+\s*\d+(?:\.\d+)?/gu), // numeric annotations
  ];
  
  for (const match of annotationMatches) {
    const key = match[1];
    // Skip $owner as it's handled separately
    if (key.startsWith('$')) continue;
    
    if (!VALIDATION_PATTERNS.ANNOTATION_KEY.test(key)) {
      errors.push(`Annotation key "${ key }" must be a valid identifier (Unicode letters, numbers, underscore, starting with letter or underscore)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
