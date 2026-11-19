'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ForumMarkdownContentProps {
  content: string;
}

export function ForumMarkdownContent({ content }: ForumMarkdownContentProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Split content by code fences ```[lang]\n...\n```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let blockIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-line">
          {renderInlineMarkdown(textBefore)}
        </span>
      );
    }

    const lang = match[1] || 'code';
    const code = match[2].trimEnd();
    const currentBlockIndex = blockIndex++;

    parts.push(
      <div key={`code-${match.index}`} className="my-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm text-xs font-mono">
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300">
            {lang}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(code, currentBlockIndex)}
            className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copiedIndex === currentBlockIndex ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-3.5 overflow-x-auto text-emerald-300 leading-relaxed scrollbar-thin">
          <code>{code}</code>
        </pre>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  const remainingText = content.substring(lastIndex);
  if (remainingText) {
    parts.push(
      <span key={`text-${lastIndex}`} className="whitespace-pre-line">
        {renderInlineMarkdown(remainingText)}
      </span>
    );
  }

  return <div className="text-zinc-800 text-xs sm:text-sm leading-relaxed">{parts}</div>;
}

// Simple parser for inline code `code` and bold **bold**
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      tokens.push(text.substring(lastIdx, m.index));
    }
    const token = m[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push(
        <code
          key={`code-${m.index}`}
          className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 text-[#2563EB] border border-zinc-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={`bold-${m.index}`} className="font-semibold text-zinc-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    lastIdx = m.index + token.length;
  }

  if (lastIdx < text.length) {
    tokens.push(text.substring(lastIdx));
  }

  return tokens;
}