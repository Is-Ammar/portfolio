import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('http', http);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);

const WriteupMarkdown = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="text-2xl font-semibold text-text-strong mb-4">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl font-semibold text-text-strong mt-6 mb-3">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-lg font-semibold text-text-strong mt-6 mb-3">{children}</h3>
      ),
      p: ({ children }) => (
        <p className="text-sm leading-relaxed text-text-muted mb-4">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-text-muted">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-text-muted">{children}</ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-accent/50 bg-bg/40 px-4 py-3 text-sm text-text-muted">
          {children}
        </blockquote>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline-offset-4 hover:underline"
        >
          {children}
        </a>
      ),
      table: ({ children }) => (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border border-line/60 text-sm text-text-muted">
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border border-line/60 bg-bg/60 px-3 py-2 text-left text-text-strong">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-line/60 px-3 py-2">{children}</td>
      ),
      code: ({ className, children }) => {
        const match = /language-(\w+)/.exec(className ?? '');
        const inline = !match;
        if (!inline) {
          return (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match?.[1] ?? 'text'}
              PreTag="div"
              customStyle={{
                background: 'rgba(5, 6, 10, 0.9)',
                borderRadius: '18px',
                padding: '16px',
                fontSize: '13px',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        }
        return (
          <code className="rounded bg-bg/70 px-1.5 py-0.5 text-[12px] font-mono text-text-strong">
            {children}
          </code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
);

export default WriteupMarkdown;
