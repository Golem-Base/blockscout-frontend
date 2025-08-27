import React from 'react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight, a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { useColorMode } from 'toolkit/chakra/color-mode';

interface Props {
  data: string;
  customStyle?: React.CSSProperties;
}

const SyntaxHighlighter = ({ data, customStyle }: Props) => {
  const { colorMode } = useColorMode();
  const style = colorMode === 'dark' ? a11yDark : a11yLight;

  return (
    <ReactSyntaxHighlighter
      style={ style }
      customStyle={{
        margin: 0,
        padding: 0,
        fontSize: '14px',
        lineHeight: '1.5',
        background: 'transparent',
        fontFamily: 'monospace',
        ...customStyle,
      }}
      codeTagProps={{
        style: {
          fontSize: '14px',
          fontFamily: 'monospace',
        },
      }}
    >
      { data }
    </ReactSyntaxHighlighter>
  );
};

export default React.memo(SyntaxHighlighter);
