import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import styled from '@emotion/styled-base'
const HighlightPre = styled('pre')`
  padding: 15px;
`

const Code = ({ code, language }) => (
  <Highlight {...defaultProps} code={code} language={language}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <HighlightPre className={className} style={style}>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </HighlightPre>
    )}
  </Highlight>
)

export default Code
