import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const configRpcQuery: monaco.languages.LanguageConfiguration = {
  brackets: [ [ '(', ')' ] ],
  autoClosingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  surroundingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  wordPattern: /[a-z_$][\w$]*/i,
};

export const defRpcQuery: monaco.languages.IMonarchLanguage = {
  defaultToken: 'invalid',

  keywords: [
    '$owner',
  ],

  operators: [
    '=',
    '!=',
    '>=',
    '<=',
    '>',
    '<',
    '~',
    '!~',
    '&&',
    '||',
    '!',
  ],

  tokenizer: {
    root: [
      { include: '@whitespace' },

      [ /&&/, 'operator' ],
      [ /\|\|/, 'operator' ],
      [ /!=/, 'operator' ],
      [ />=/, 'operator' ],
      [ /<=/, 'operator' ],
      [ /!~/, 'operator' ],
      [ /[=><~!]/, 'operator' ],

      [ /[()]/, 'delimiter.parenthesis' ],

      [ /"([^"\\]|\\.)*$/, 'string.invalid' ],
      [ /"/, 'string', '@string' ],

      [ /0x[0-9a-fA-F]+/, 'number.hex' ],
      [ /\d+/, 'number' ],

      [
        /[a-z_$][\w$]*/i,
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
