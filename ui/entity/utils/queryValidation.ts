export function validateEntityQuery(query: string): string | null {
  if (!query || query.trim().length === 0) {
    return 'Query cannot be empty';
  }

  const trimmedQuery = query.trim();

  try {
    if (!hasBalancedParentheses(trimmedQuery)) {
      return 'Unmatched parentheses in query';
    }

    if (!hasValidStringLiterals(trimmedQuery)) {
      return 'Invalid string literal. Use double quotes for strings';
    }

    if (!hasValidOperators(trimmedQuery)) {
      return 'Invalid operators. Use && for AND, || for OR';
    }

    if (hasInvalidEqualityPattern(trimmedQuery)) {
      return 'Invalid equality expression. Use format: field = "string" or field = number';
    }

    if (hasInvalidOwnershipPattern(trimmedQuery)) {
      return 'Invalid ownership expression. Use format: $owner = "0x..."';
    }

    if (!hasValidStructure(trimmedQuery)) {
      return 'Invalid query structure. Query must contain valid expressions';
    }

    return null;
  } catch (error) {
    return 'Invalid query syntax';
  }
}

function hasBalancedParentheses(query: string): boolean {
  const stack: Array<string> = [];
  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    if (char === '(') {
      stack.push(char);
    } else if (char === ')') {
      if (stack.length === 0) return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}

function hasValidOperators(query: string): boolean {
  if (/[^&]&[^&]/.test(query) || /[^|]\|[^|]/.test(query)) {
    return false;
  }

  if (/\bOR\b/i.test(query) || /\bAND\b/i.test(query)) {
    return false;
  }

  const operatorPattern = /&&|\|\|/g;
  const matches = query.match(operatorPattern);

  if (!matches) return true;

  if (query.startsWith('&&') || query.startsWith('||') ||
      query.endsWith('&&') || query.endsWith('||')) {
    return false;
  }

  if (/&&\s*&&|\|\|\s*\|\||&&\s*\|\||\|\|\s*&&/.test(query)) {
    return false;
  }

  return true;
}

function hasValidStringLiterals(query: string): boolean {
  const stringPattern = /"(?:[^"\\]|\\.)*"/g;
  const matches = query.match(stringPattern);

  if (!matches) {
    let quoteCount = 0;
    for (let i = 0; i < query.length; i++) {
      if (query[i] === '"' && (i === 0 || query[i - 1] !== '\\')) {
        quoteCount++;
      }
    }
    return quoteCount === 0;
  }

  let quoteCount = 0;
  for (let i = 0; i < query.length; i++) {
    if (query[i] === '"' && (i === 0 || query[i - 1] !== '\\')) {
      quoteCount++;
    }
  }

  return quoteCount % 2 === 0;
}

function hasValidStructure(query: string): boolean {
  if (/\$owner\s*=\s*"0x[a-fA-F0-9]{40}"/.test(query)) {
    return true;
  }

  if (/[a-z_]\w*\s*=\s*(?:"(?:[^"\\]|\\.)*"|\d+)/i.test(query)) {
    return true;
  }

  if (/\([^)]+\)/.test(query)) {
    const parenMatches = query.match(/\([^)]+\)/g);
    if (parenMatches) {
      for (const match of parenMatches) {
        const content = match.slice(1, -1);
        if (hasValidStructure(content)) {
          return true;
        }
      }
    }
  }

  return false;
}

function hasInvalidEqualityPattern(query: string): boolean {
  const incompleteEqualityPattern = /[a-z_]\w*\s*=\s*$/i;
  if (incompleteEqualityPattern.test(query)) {
    return true;
  }

  const unquotedStringPattern = /[a-z_]\w*\s*=\s*[^"0-9\s][^"]*$/i;
  return unquotedStringPattern.test(query);
}

function hasInvalidOwnershipPattern(query: string): boolean {
  const ownershipPattern = /\$owner\s*=\s*"[^"]*"/g;
  const matches = query.match(ownershipPattern);

  if (!matches) {
    return false;
  }

  for (const match of matches) {
    const addressMatch = match.match(/"([^"]*)"/);
    if (addressMatch) {
      const address = addressMatch[1];
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return true;
      }
    }
  }

  return false;
}
