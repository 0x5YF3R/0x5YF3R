import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card } from '@/components/ui/card';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Card className="bg-cyber-dark border border-cyber-blue/20 p-6 rounded-lg shadow-lg">
      <ReactMarkdown
        className="markdown-content"
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 text-cyber-blue" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyber-blue" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold mt-6 mb-3 text-cyber-blue" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 leading-7" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-cyber-blue hover:text-cyber-blue underline transition-colors" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-4" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-cyber-blue bg-cyber-black/50 pl-4 py-1 my-4" {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !match ? (
              <code className="bg-cyber-black px-1 py-0.5 rounded text-cyber-blue" {...props}>
                {children}
              </code>
            ) : (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-cyber-blue/30" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-cyber-blue/30 px-4 py-2 bg-cyber-dark" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-cyber-blue/30 px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Card>
  );
};

export default MarkdownRenderer;
