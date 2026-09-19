import React from 'react';

interface NutanixLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'mark' | 'full';
  showBadge?: boolean;
}

/**
 * Authentic Nutanix vector logo with official chevron dual-arc geometry
 * Simple-Icons standard viewBox="0 0 24 24"
 * Subpath 1: Left primary chevron bracket
 * Subpath 2: Right interlocking bracket
 */
export const NutanixLogo: React.FC<NutanixLogoProps> = ({
  className = 'w-6 h-6',
  variant = 'mark',
  showBadge = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Nutanix Logo"
      >
        {/* Left primary chevron bracket (Nutanix vibrant emerald/green) */}
        <path
          d="M.394 3.617a.395.395 0 0 0-.393.395c0 .12.054.225.14.297l8.506 7.404a.39.39 0 0 1-.013.588l-8.52 7.412a.393.393 0 0 0 .28.67h4.86a.4.4 0 0 0 .265-.104l9.17-7.98a.396.396 0 0 0 0-.596L5.52 3.721a.4.4 0 0 0-.264-.104z"
          fill="currentColor"
          className="text-emerald-400 drop-shadow-sm"
        />
        {/* Right interlocking chevron bracket (Nutanix cyan/teal contrast) */}
        <path
          d="M18.752 3.617a.4.4 0 0 0-.273.113l-4.72 4.098a.397.397 0 0 1 0 .584l4.72 4.1a.4.4 0 0 0 .273.113h4.852a.394.394 0 0 0 .394-.395c0-.12-.054-.225-.14-.297l-4.71-4.103a.39.39 0 0 1 .013-.589l4.722-4.106a.394.394 0 0 0-.28-.67h-4.85a.4.4 0 0 0-.265.105z"
          fill="currentColor"
          className="text-teal-300 drop-shadow-sm"
        />
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-extrabold tracking-wider text-sm text-white font-mono uppercase">
              NUTANIX
            </span>
            {showBadge && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                NCP-CN 7.5
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 font-medium tracking-normal mt-0.5">
            Kubernetes Platform (NKP)
          </span>
        </div>
      )}
    </div>
  );
};
