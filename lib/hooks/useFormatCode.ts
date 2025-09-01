import type { Options } from 'prettier';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginMarkdown from 'prettier/plugins/markdown';
import prettierPluginYaml from 'prettier/plugins/yaml';
import prettier from 'prettier/standalone';
import { useState, useEffect } from 'react';

interface FormatResult {
  formatted: string;
  language: string;
}

const PARSER_CONFIGS: Array<Options> = [
  {
    parser: 'json',
    plugins: [ prettierPluginBabel, prettierPluginEstree ],
  },
  {
    parser: 'yaml',
    plugins: [ prettierPluginYaml ],
  },
  {
    parser: 'babel',
    plugins: [ prettierPluginBabel, prettierPluginEstree ],
  },
  {
    parser: 'markdown',
    plugins: [ prettierPluginMarkdown ],
  },
];

export function useFormatCode(data: string, enabled = true): FormatResult {
  const [ result, setResult ] = useState<FormatResult>({
    formatted: data,
    language: 'text',
  });

  useEffect(() => {
    const formatData = async() => {
      for (const config of PARSER_CONFIGS) {
        try {
          const formatted = await prettier.format(data, {
            parser: config.parser,
            plugins: config.plugins,
            semi: true,
            singleQuote: true,
          });

          setResult({
            formatted,
            language: config.parser as string,
          });
          return;
        } catch { }
      }

      setResult({
        formatted: data,
        language: 'text',
      });
    };

    formatData();
  }, [ data ]);

  return enabled ? result : {
    formatted: data,
    language: 'text',
  };
}
