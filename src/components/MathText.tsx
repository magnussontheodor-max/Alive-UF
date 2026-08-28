import React, { useMemo } from 'react';
import katex from 'katex';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMath(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr, { throwOnError: false, displayMode });
  } catch {
    return escapeHtml(expr);
  }
}

/**
 * Renderar text som kan innehålla matte: $$...$$ för blockmatte och $...$
 * för inline-matte (KaTeX). Övrig text visas som vanlig text.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => {
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    return blockParts
      .map((part) => {
        if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
          return renderMath(part.slice(2, -2), true);
        }
        return part
          .split(/(\$[^$]+\$)/g)
          .map((seg) => {
            if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 1) {
              return renderMath(seg.slice(1, -1), false);
            }
            return escapeHtml(seg);
          })
          .join('');
      })
      .join('');
  }, [text]);

  // eslint-disable-next-line react/no-danger
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
