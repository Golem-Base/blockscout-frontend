import type { SystemStyleObject } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import type { EditorProps } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { Operator } from 'ui/queryBuilder/shared/constants';
import ErrorBoundary from 'ui/shared/ErrorBoundary';

import { getOperatorDescription } from '../shared/operators';
import { validateQuery } from '../shared/validation';
import { KEYWORDS, MONACO_OPERATORS } from './constants';
import { languageConfiguration, monarchTokensProvider } from './languageDefinition';

type Monaco = typeof monaco;

const EDITOR_OPTIONS: EditorProps['options'] = {
  readOnly: false,
  minimap: { enabled: false },
  scrollbar: {
    alwaysConsumeMouseWheel: true,
    vertical: 'hidden',
    horizontal: 'hidden',
    horizontalScrollbarSize: 0,
    verticalScrollbarSize: 0,
  },
  dragAndDrop: false,
  wordWrap: 'on',
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 0,
  renderLineHighlight: 'none',
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  fontSize: 14,
  lineHeight: 20,
  contextmenu: false,
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'on',
  renderValidationDecorations: 'off',
  renderWhitespace: 'none',
  cursorBlinking: 'solid',
  cursorStyle: 'line',
  cursorWidth: 2,
  padding: {
    top: 8,
    bottom: 8,
  },
};

const EDITOR_HEIGHT = 100;
const LANGUAGE_ID = 'golembase-query';

interface Props {
  initialValue: string;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
}

const QueryBuilderInput = ({ initialValue, onSubmit, isLoading }: Props) => {
  const [ value, setValue ] = React.useState(initialValue);
  const instanceRef = React.useRef<Monaco | null>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { colorMode } = useColorMode();

  const validation = React.useMemo(() => validateQuery(value), [ value ]);

  React.useEffect(() => {
    instanceRef.current?.editor.setTheme(colorMode === 'light' ? 'vs' : 'vs-dark');
  }, [ colorMode ]);

  const handleChange = React.useCallback((newValue: string | undefined) => {
    setValue(newValue || '');
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (validation.isValid) {
      onSubmit(value);
    }
  }, [ value, onSubmit, validation.isValid ]);

  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
    instanceRef.current = monacoInstance;
    editorRef.current = editor;
    monacoInstance.editor.setTheme(colorMode === 'light' ? 'vs' : 'vs-dark');

    monacoInstance.languages.register({ id: LANGUAGE_ID });
    monacoInstance.languages.setMonarchTokensProvider(LANGUAGE_ID, monarchTokensProvider);
    monacoInstance.languages.setLanguageConfiguration(LANGUAGE_ID, languageConfiguration);

    monacoInstance.languages.registerCompletionItemProvider(LANGUAGE_ID, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const keywordSuggestions = KEYWORDS.map(keyword => ({
          label: keyword,
          kind: monacoInstance.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          documentation: `${ keyword } filter`,
          detail: 'Meta-annotation',
          range,
        }));

        const operatorSuggestions = MONACO_OPERATORS.map(operator => {
          const isLogical = operator === '&&' || operator === '||';
          // eslint-disable-next-line no-nested-ternary
          const description = isLogical ?
            (operator === '&&' ? 'Logical AND operator' : 'Logical OR operator') :
            getOperatorDescription(operator as Operator);
          const detail = isLogical ? 'Logical' : 'Comparison';

          return {
            label: operator,
            kind: monacoInstance.languages.CompletionItemKind.Operator,
            insertText: operator,
            documentation: description,
            detail,
            range,
          };
        });

        const suggestions = [
          ...keywordSuggestions,
          ...operatorSuggestions,
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

  }, [ colorMode ]);

  const containerCss: SystemStyleObject = {
    '& .monaco-editor': {
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1px solid var(--rqb-border-color)',
      outline: 'none',
    },
  };

  const renderErrorScreen = React.useCallback(() => {
    return <Box bgColor="gray.100" w="100%" h="100%" p={ 2 }>Oops! Something went wrong!</Box>;
  }, []);

  return (
    <Box>
      <Box width="100%" height={ `${ EDITOR_HEIGHT }px` } css={ containerCss } mb={ 4 }>
        <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
          <MonacoEditor
            height={ `${ EDITOR_HEIGHT }px` }
            language={ LANGUAGE_ID }
            value={ value }
            options={ EDITOR_OPTIONS }
            onMount={ handleEditorDidMount }
            onChange={ handleChange }
            loading={ (
              <Skeleton
                data-cy="monaco-editor-loading"
                height={ `${ EDITOR_HEIGHT }px` }
                borderRadius="4px"
                loading
              />
            ) }
          />
        </ErrorBoundary>
      </Box>

      { validation.errors.length > 0 && (
        <Box mb={ 4 }>
          { validation.errors.map((error, index) => (
            <Box key={ index } color="red.500" fontSize="sm" mb={ 1 }>
              { error }
            </Box>
          )) }
        </Box>
      ) }

      <Button
        size="sm"
        onClick={ handleSubmit }
        disabled={ !validation.isValid || !value.trim() }
        loading={ isLoading }
        colorScheme="blue"
        mt={ 4 }
        ml="auto"
      >
        Run Query
      </Button>
    </Box>
  );
};

export default React.memo(QueryBuilderInput);
