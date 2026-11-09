import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ math, block = false, className = '' }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-math ${block ? 'block my-2 overflow-x-auto text-center' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Parses a string containing $...$ or $$...$$ or mixed text and renders LaTeX segments.
 */
export const FormattedText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const elements = React.useMemo(() => {
    if (!text) return null;

    // Split on $$...$$ first, then $...$
    const parts: React.ReactNode[] = [];
    const blockRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        // Parse inline math inside the preceding text chunk
        parts.push(
          <span key={`text-${lastIndex}`}>
            {parseInlineMath(text.slice(lastIndex, match.index))}
          </span>
        );
      }
      parts.push(
        <MathRenderer key={`block-${match.index}`} math={match[1]} block={true} />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {parseInlineMath(text.slice(lastIndex))}
        </span>
      );
    }

    return parts;
  }, [text]);

  return <div className={`leading-relaxed ${className}`}>{elements}</div>;
};

function parseInlineMath(chunk: string): React.ReactNode[] {
  const inlineRegex = /\$([^\$]+?)\$/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(chunk)) !== null) {
    if (match.index > last) {
      nodes.push(chunk.slice(last, match.index));
    }
    nodes.push(
      <MathRenderer key={`inline-${match.index}-${last}`} math={match[1]} block={false} />
    );
    last = match.index + match[0].length;
  }

  if (last < chunk.length) {
    nodes.push(chunk.slice(last));
  }

  return nodes;
}
