import React from 'react';
import { Lock, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';

interface BlurLockContainerProps {
  isLocked: boolean;
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  onUnlockRequest?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const BlurLockContainer: React.FC<BlurLockContainerProps> = ({
  isLocked,
  title = 'Content Hidden & Blurred by Administrator',
  subtitle = 'Text is permanently blurred to protect examination integrity. Mouse interaction, clicking, and copy-paste are disabled.',
  badgeLabel = 'Blur Focus Active • Copy-Paste Disabled',
  onUnlockRequest,
  children,
  className = '',
}) => {
  if (!isLocked) {
    return <>{children}</>;
  }

  const preventCopyAction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Intercept Ctrl+C, Ctrl+A, Ctrl+X, Cmd+C, Cmd+A, Cmd+X
    if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'a', 'A', 'x', 'X', 'p', 'P'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-100/50 shadow-sm select-none ${className}`}
      onCopy={preventCopyAction}
      onCut={preventCopyAction}
      onPaste={preventCopyAction}
      onContextMenu={preventCopyAction}
      onDragStart={preventCopyAction}
      onKeyDown={handleKeyDown}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {/* Blurred & Inaccessible Content Area */}
      <div
        className="filter blur-[22px] md:blur-[26px] opacity-25 pointer-events-none select-none transition-all duration-300"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      {/* Floating Center Lock & Blur Focus Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-[3px]">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-4 animate-fadeIn">
          {/* Lock Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              <EyeOff className="w-3 h-3 text-slate-500" />
              <span>{badgeLabel}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Security Features Tag Bar */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] font-mono text-slate-500 pt-1">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              🚫 No Mouse Touch/Click
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              🚫 No Copy/Paste
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              🔒 100% Blur Obscured
            </span>
          </div>

          {/* Admin Unlock CTA */}
          {onUnlockRequest && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onUnlockRequest}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Enter Admin PIN to Unblur</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
