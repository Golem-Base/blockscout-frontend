import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { KEYWORDS, MONACO_OPERATORS } from './constants';

export const languageConfiguration: monaco.languages.LanguageConfiguration = {
  brackets: [ [ '(', ')' ] ],
  autoClosingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  surroundingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  wordPattern: /[\p{L}_$][\p{L}\p{N}_$]*/u,
};

export const monarchTokensProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: 'invalid',
  keywords: KEYWORDS,
  operators: MONACO_OPERATORS,

  tokenizer: {
    root: [
      { include: '@whitespace' },

      [ /&&/, 'operator' ],
      [ /\|\|/, 'operator' ],
      [ /[=><]/, 'operator' ],

      [ /[()]/, 'delimiter.parenthesis' ],

      [ /"([^"\\]|\\.)*$/, 'string.invalid' ],
      [ /"/, 'string', '@string' ],

      [ /0x[0-9a-fA-F]+/, 'number.hex' ],
      [ /\d+/, 'number' ],

      [
        /[\p{L}_$][\p{L}\p{N}_$]*/u,
        {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],
    ],

    whitespace: [
      [ /[ \t\r\n]+/, 'white' ],
    ],

    string: [
      [ /[^\\"]+/, 'string' ],
      [ /\\./, 'string.escape' ],
      [ /"/, { token: 'string.quote', bracket: '@close', next: '@pop' } ],
    ],
  },
};
