import React from 'react';
import { Bold, Italic, List, ListOrdered, Code, Terminal } from 'lucide-react';

interface RichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  helperText?: string;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  textareaRef,
  value,
  onChange,
  label,
  helperText,
}) => {
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + prefix + defaultPlaceholder + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToWrap = selectedText || defaultPlaceholder;
    const replacement = prefix + textToWrap + suffix;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToWrap.length;
      textarea.setSelectionRange(start + prefix.length, newCursorPos);
    }, 10);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + '\n' + prefix + ' ');
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const selectedText = value.substring(start, end);
    const after = value.substring(end);

    // If text is selected, prefix each line
    if (selectedText) {
      const lines = selectedText.split('\n');
      const prefixed = lines.map((l) => (l.startsWith(prefix) ? l : `${prefix} ${l}`)).join('\n');
      onChange(before + prefixed + after);
    } else {
      // Check if cursor is on newline or insert newline with prefix
      const needsNewline = before.length > 0 && !before.endsWith('\n');
      const insertStr = (needsNewline ? '\n' : '') + prefix + ' ';
      onChange(before + insertStr + after);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + insertStr.length, start + insertStr.length);
      }, 10);
    }
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + '\n```bash\n# linux command here\n```\n');
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'kubectl get nodes -o wide';
    const before = value.substring(0, start);
    const after = value.substring(end);

    const needsNewline = before.length > 0 && !before.endsWith('\n');
    const block = `${needsNewline ? '\n' : ''}\`\`\`bash\n${selectedText}\n\`\`\`\n`;

    onChange(before + block + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + block.length, start + block.length);
    }, 10);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-900 text-slate-300 rounded-t-xl border border-slate-800 border-b-0 text-xs select-none">
      <div className="flex items-center gap-1">
        {label && <span className="font-bold text-slate-200 text-xs mr-2">{label}</span>}
        
        {/* Bold */}
        <button
          type="button"
          onClick={() => insertFormatting('**', '**', 'bold text')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Bold (**text**)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Italic / Slanting */}
        <button
          type="button"
          onClick={() => insertFormatting('*', '*', 'italic text')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Italic (*text*)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-800 mx-1" />

        {/* Bullet Point */}
        <button
          type="button"
          onClick={() => insertLinePrefix('•')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          title="Bullet Point (• Item)"
        >
          <List className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] hidden sm:inline">Bullet</span>
        </button>

        {/* Step-by-Step Numbered */}
        <button
          type="button"
          onClick={() => insertLinePrefix('1.')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          title="Step-by-step Process (1. Step)"
        >
          <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] hidden sm:inline">Step</span>
        </button>

        <div className="w-px h-4 bg-slate-800 mx-1" />

        {/* Inline Linux Code */}
        <button
          type="button"
          onClick={() => insertFormatting('`', '`', 'command')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          title="Inline Command (`code`)"
        >
          <Code className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono hidden sm:inline">`cmd`</span>
        </button>

        {/* Linux Terminal Code Block */}
        <button
          type="button"
          onClick={insertCodeBlock}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          title="Linux Terminal Block (```bash)"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono hidden sm:inline">Terminal</span>
        </button>
      </div>

      {helperText && (
        <span className="text-[10px] text-slate-400 italic hidden md:inline">
          {helperText}
        </span>
      )}
    </div>
  );
};
