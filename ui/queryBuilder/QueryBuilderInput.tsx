import type { SystemStyleObject } from '@chakra-ui/react';
import { Box, Flex, useToken } from '@chakra-ui/react';
import type { EditorProps } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import { useColorMode } from 'toolkit/chakra/color-mode';
import { IconButton } from 'toolkit/chakra/icon-button';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import IconSvg from 'ui/shared/IconSvg';

import { configRpcQuery, defRpcQuery } from './defRpcQuery';

type Monaco = typeof monaco;

const EDITOR_OPTIONS: EditorProps['options'] = {
  readOnly: false,
  minimap: { enabled: false },
  scrollbar: {
    alwaysConsumeMouseWheel: true,
  },
  dragAndDrop: false,
  wordWrap: 'on',
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  renderLineHighlight: 'none',
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  fontSize: 14,
  lineHeight: 20,
  padding: { top: 10, bottom: 10 },
  contextmenu: false,
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'on',
};

const EDITOR_HEIGHT = 40;

interface Props {
  defaultValue: string;
  onSearch: (value: string) => void;
}

const QueryBuilderInput = ({ defaultValue, onSearch }: Props) => {
  const instanceRef = React.useRef<Monaco | null>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [ borderRadius ] = useToken('radii', 'md');
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    instanceRef.current?.editor.setTheme(colorMode === 'light' ? 'vs' : 'vs-dark');
  }, [ colorMode ]);

  const handleSearch = React.useCallback(() => {
    if (editorRef.current) {
      onSearch(editorRef.current.getValue());
    }
  }, [ onSearch ]);

  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
    instanceRef.current = monacoInstance;
    editorRef.current = editor;
    monacoInstance.editor.setTheme(colorMode === 'light' ? 'vs' : 'vs-dark');

    monacoInstance.languages.register({ id: 'golembase-query' });
    monacoInstance.languages.setMonarchTokensProvider('golembase-query', defRpcQuery);
    monacoInstance.languages.setLanguageConfiguration('golembase-query', configRpcQuery);

    monacoInstance.languages.registerCompletionItemProvider('golembase-query', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          {
            label: '$owner',
            kind: monacoInstance.languages.CompletionItemKind.Keyword,
            insertText: '$owner',
            documentation: 'Owner address filter',
            detail: 'Meta-annotation',
            range,
          },
          {
            label: '=',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '=',
            documentation: 'Equals operator',
            detail: 'Comparison',
            range,
          },
          {
            label: '!=',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '!=',
            documentation: 'Not equals operator',
            detail: 'Comparison',
            range,
          },
          {
            label: '>',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '>',
            documentation: 'Greater than operator',
            detail: 'Comparison',
            range,
          },
          {
            label: '>=',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '>=',
            documentation: 'Greater than or equal operator',
            detail: 'Comparison',
            range,
          },
          {
            label: '<',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '<',
            documentation: 'Less than operator',
            detail: 'Comparison',
            range,
          },
          {
            label: '<=',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '<=',
            documentation: 'Less than or equal operator',
            detail: 'Comparison',
            range,
          },
          {
            label: '~',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '~',
            documentation: 'Pattern match operator',
            detail: 'Pattern',
            range,
          },
          {
            label: '!~',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '!~',
            documentation: 'Pattern not match operator',
            detail: 'Pattern',
            range,
          },
          {
            label: '&&',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '&&',
            documentation: 'Logical AND operator',
            detail: 'Logical',
            range,
          },
          {
            label: '||',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '||',
            documentation: 'Logical OR operator',
            detail: 'Logical',
            range,
          },
          {
            label: '!',
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: '!',
            documentation: 'Logical NOT operator',
            detail: 'Logical',
            range,
          },
          {
            label: '(',
            kind: monacoInstance.languages.CompletionItemKind.Snippet,
            insertText: '($1)',
            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Parentheses for grouping',
            detail: 'Grouping',
            range,
          },
        ];

        return { suggestions };
      },
    });

    editor.addAction({
      id: 'search-on-enter',
      label: 'Search',
      keybindings: [
        monacoInstance.KeyCode.Enter,
      ],
      run: handleSearch,
    });
  }, [ colorMode, handleSearch ]);

  const containerCss: SystemStyleObject = React.useMemo(() => ({
    '& .monaco-editor': {
      'padding-left': '10px',
      'border-top-left-radius': borderRadius,
      'border-bottom-left-radius': borderRadius,
    },
    '& .monaco-editor .overflow-guard': {
      'border-top-left-radius': borderRadius,
      'border-bottom-left-radius': borderRadius,
    },
    '& .monaco-editor .view-lines': {
      paddingBlock: '10px',
    },
    '& .monaco-editor .view-line': {
      display: 'flex',
      alignItems: 'center',
    },
  }), [ borderRadius ]);

  const renderErrorScreen = React.useCallback(() => {
    return <Box bgColor="gray.100" w="100%" h="100%" borderRadius="md" p={ 2 }>Oops! Something went wrong!</Box>;
  }, []);

  return (
    <Flex width="100%" height={ `${ EDITOR_HEIGHT }px` } css={ containerCss }>
      <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
        <Box flexGrow={ 1 }>
          <MonacoEditor
            height={ `${ EDITOR_HEIGHT }px` }
            language="golembase-query"
            defaultValue={ defaultValue }
            options={ EDITOR_OPTIONS }
            onMount={ handleEditorDidMount }
          />
        </Box>
        <IconButton
          aria-label="Search"
          size="md"
          variant="outline"
          borderTopLeftRadius={ 0 }
          borderBottomLeftRadius={ 0 }
          borderTopRightRadius={ borderRadius }
          borderBottomRightRadius={ borderRadius }
          height={ `${ EDITOR_HEIGHT }px` }
          width={ `${ EDITOR_HEIGHT }px` }
          onClick={ handleSearch }
        >
          <IconSvg name="search" boxSize={ 4 }/>
        </IconButton>
      </ErrorBoundary>
    </Flex>
  );
};

export default React.memo(QueryBuilderInput);
