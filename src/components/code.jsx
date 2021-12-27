/* eslint react/destructuring-assignment: 0 */
import * as React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import loadable from '@loadable/component';
import theme from 'prism-react-renderer/themes/nightOwl';
import Prism from 'prism-react-renderer/prism';

import Copy from '@lekoarts/gatsby-theme-minimal-blog/src/components/copy';
import useMinimalBlogConfig from '@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config';

(typeof global !== 'undefined' ? global : window).Prism = Prism;

require('prismjs/components/prism-elixir');
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-go');

function getParams(className = ``) {
  const [lang = ``, params = ``] = className.split(`:`);

  return [lang.split(`language-`).pop().split(`{`).shift()].concat(
    params.split(`&`).reduce((merged, param) => {
      const [key, value] = param.split(`=`);
      merged[key] = value;
      return merged;
    }, {}),
  );
}

const RE = /{([\d,-]+)}/;

const calculateLinesToHighlight = (meta) => {
  if (!RE.test(meta)) {
    return () => false;
  }
  const lineNumbers = RE.exec(meta)[1]
    .split(`,`)
    .map((v) => v.split(`-`).map((x) => parseInt(x, 10)));
  return (index) => {
    const lineNumber = index + 1;
    const inRange = lineNumbers.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
    );
    return inRange;
  };
};

const LazyLiveProvider = loadable(async () => {
  const Module = await import(`react-live`);
  const { LiveProvider, LiveEditor, LiveError, LivePreview } = Module;
  return (props) => (
    <LiveProvider {...props}>
      {props.showCopyButton && <Copy content={props.code} />}
      <LiveEditor data-name="live-editor" />
      <LiveError />
      <LivePreview data-name="live-preview" />
    </LiveProvider>
  );
});

const Code = ({
  codeString,
  noLineNumbers = false,
  className: blockClassName,
  metastring = ``,
  ...props
}) => {
  const { showLineNumbers, showCopyButton } = useMinimalBlogConfig();

  const [language, { title = `` }] = getParams(blockClassName);
  const shouldHighlightLine = calculateLinesToHighlight(metastring);

  const hasLineNumbers =
    !noLineNumbers && language !== `noLineNumbers` && showLineNumbers;

  if (props[`react-live`]) {
    return (
      <div className="react-live-wrapper">
        <LazyLiveProvider
          code={codeString}
          noInline
          theme={theme}
          showCopyButton={showCopyButton}
        />
      </div>
    );
  }
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <React.Fragment>
          {title && (
            <div className="code-title">
              <div>{title}</div>
            </div>
          )}
          <div className="gatsby-highlight" data-language={language}>
            <pre
              className={className}
              style={style}
              data-linenumber={hasLineNumbers}
            >
              {showCopyButton && <Copy content={codeString} fileName={title} />}
              <code className={`language-${language}`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });

                  if (shouldHighlightLine(i)) {
                    lineProps.className = `${lineProps.className} highlight-line`;
                  }

                  return (
                    <div {...lineProps}>
                      {hasLineNumbers && (
                        <span className="line-number-style">{i + 1}</span>
                      )}
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </React.Fragment>
      )}
    </Highlight>
  );
};

export default Code;
