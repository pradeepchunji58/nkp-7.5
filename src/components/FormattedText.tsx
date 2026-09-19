import React from 'react';

export interface FormattedTextProps {
  content?: string;
  text?: string;
  className?: string;
}

/**
 * Rich formatted text renderer supporting:
 * - Bullet points (*, -, •, + at start of line)
 * - Numbered steps (1., 2., 1), Step 1:, etc.)
 * - Code & command blocks (```bash ... ``` or ``` ... ```)
 * - Standalone CLI commands ($ nkp ..., kubectl ..., sudo ...)
 * - Inline code (`command`), Bold (**bold** or __bold__), and Italic (*text* or _text_)
 * - Robust handling of both escaped \n and real newlines
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  content,
  text,
  className = '',
}) => {
  const raw = content ?? text ?? '';
  if (!raw) return null;

  // Normalize escaped \n to real newlines
  const normalized = raw.replace(/\\n/g, '\n');

  // Check if content has code blocks (```...```)
  if (normalized.includes('```')) {
    const parts = normalized.split(/(```[\s\S]*?```)/g);
    return (
      <div className={`space-y-2.5 ${className}`}>
        {parts.map((part, idx) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const firstLine = lines[0].trim();
            const hasLang = /^[a-z0-9_-]+$/i.test(firstLine);
            const codeLines = hasLang ? lines.slice(1) : lines;
            const codeText = codeLines.join('\n');

            return (
              <div
                key={idx}
                className="my-2.5 rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner select-text relative group"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-300 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Terminal / Command Block
                  </span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(codeText)}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <pre className="leading-relaxed whitespace-pre-wrap font-mono select-all">{codeText}</pre>
              </div>
            );
          }
          return <FormattedTextLines key={idx} text={part} />;
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      <FormattedTextLines text={normalized} />
    </div>
  );
};

const FormattedTextLines: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Terminal / CLI command line detection: starts with $, #, >, or common CLI binaries
        const cliMatch = trimmed.match(/^(\$|>|#)\s+(.*)$/) ||
          (trimmed.match(/^(nkp|kubectl|sudo|docker|crictl|helm|systemctl|cat|grep|export|curl|openssl)\s+(.*)$/) ? [trimmed, '$', trimmed] : null);

        if (cliMatch) {
          const promptChar = cliMatch[1] === '$' || cliMatch[1] === '#' || cliMatch[1] === '>' ? cliMatch[1] : '$';
          const cmdText = cliMatch[2] || trimmed;
          return (
            <div
              key={idx}
              className="my-1.5 flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto shadow-xs group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-emerald-500 font-bold select-none">{promptChar}</span>
                <span className="select-all truncate">{cmdText}</span>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(cmdText)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0"
                title="Copy Command"
              >
                Copy
              </button>
            </div>
          );
        }

        // Bullet point detection: *, -, •, +
        const bulletMatch = trimmed.match(/^([*\-•\+])\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-emerald-500 font-black mt-1 text-xs select-none leading-none">•</span>
              <span className="flex-1 min-w-0">
                <InlineRichText text={bulletMatch[2]} />
              </span>
            </div>
          );
        }

        // Numbered step detection: 1., 2., 1), Step 1:, etc.
        const numberMatch = trimmed.match(/^((\d+[\.\)])|(Step\s+\d+:?))\s+(.*)$/i);
        if (numberMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded mt-0.5 select-none flex-shrink-0">
                {numberMatch[1]}
              </span>
              <span className="flex-1 min-w-0 pt-0.5">
                <InlineRichText text={numberMatch[4]} />
              </span>
            </div>
          );
        }

        // Standard line
        return (
          <div key={idx} className="leading-relaxed">
            <InlineRichText text={line} />
          </div>
        );
      })}
    </div>
  );
};

/**
 * Handles inline styles: `code`, **bold**, __bold__, <b>bold</b>, <strong>bold</strong>, *italic*, _italic_
 */
export const InlineRichText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split by inline code `...`, bold **...**, __...__, <b>...</b>, <strong>...</strong>, italic *...*, _..._
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|<b>[\s\S]*?<\/b>|<strong>[\s\S]*?<\/strong>|\*[^*]+\*|_[^_]+_)/gi);

  return (
    <>
      {tokens.map((token, index) => {
        if (!token) return null;

        if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
          const codeVal = token.slice(1, -1);
          return (
            <code
              key={index}
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-slate-900 text-emerald-300 font-mono text-[0.88em] font-medium border border-slate-800 shadow-xs select-all"
            >
              {codeVal}
            </code>
          );
        }

        // Bold formatting: maintain black text color and highlight by underline
        if (
          (token.startsWith('**') && token.endsWith('**') && token.length > 4) ||
          (token.startsWith('__') && token.endsWith('__') && token.length > 4)
        ) {
          const boldContent = token.slice(2, -2);
          return (
            <strong
              key={index}
              className="font-extrabold text-black underline decoration-slate-900 decoration-2 underline-offset-2"
            >
              {boldContent}
            </strong>
          );
        }

        if (/^<b>[\s\S]*?<\/b>$/i.test(token)) {
          const boldContent = token.replace(/^<b>/i, '').replace(/<\/b>$/i, '');
          return (
            <strong
              key={index}
              className="font-extrabold text-black underline decoration-slate-900 decoration-2 underline-offset-2"
            >
              {boldContent}
            </strong>
          );
        }

        if (/^<strong>[\s\S]*?<\/strong>$/i.test(token)) {
          const boldContent = token.replace(/^<strong>/i, '').replace(/<\/strong>$/i, '');
          return (
            <strong
              key={index}
              className="font-extrabold text-black underline decoration-slate-900 decoration-2 underline-offset-2"
            >
              {boldContent}
            </strong>
          );
        }

        if (
          (token.startsWith('*') && token.endsWith('*') && token.length > 2) ||
          (token.startsWith('_') && token.endsWith('_') && token.length > 2)
        ) {
          return (
            <em key={index} className="italic text-slate-800">
              {token.slice(1, -1)}
            </em>
          );
        }

        return <span key={index}>{token}</span>;
      })}
    </>
  );
};
