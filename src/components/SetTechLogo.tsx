import React from 'react';

export interface SetTechLogoProps {
  variant?: 'icon' | 'full' | 'tile' | 'badge';
  size?: number;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  subtitle?: string;
  showSubtitle?: boolean;
}

/**
 * Raw geometric SVG mark of SETTech.
 * Preserves the exact 100% faithful polygon and path coordinates.
 * Tightly cropped to viewBox="270 185 460 445" for zero-padding scale.
 */
export function SetTechMark({
  size = 24,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="270 185 460 445"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <g id="settech-mark">
        <path
          d="M 358 206 L 564 206 L 500 271 L 357 271 L 357 375 L 500 375 L 500 440 L 358 440 L 293 375 L 293 271 Z"
          fill="#000000"
        />
        <path
          d="M 293 464 L 357 464 L 357 541 L 500 541 L 500 606 L 358 606 L 293 541 Z"
          fill="#000000"
        />
        <path
          d="M 564 375 L 583 375 L 647 439 L 647 542 L 583 606 L 583 440 L 564 440 Z"
          fill="#000000"
        />
        <path
          d="M 564 206 L 708 206 L 708 356 L 644 356 L 644 271 L 564 271 L 564 606 L 500 606 L 500 356 L 376 356 L 376 290 L 500 290 L 500 271 Z"
          fill="#383838"
        />
        <rect x="583" y="290" width="42" height="66" fill="#383838" />
        <rect x="357" y="464" width="124" height="58" fill="#383838" />
      </g>
    </svg>
  );
}

/**
 * Official SETTech Logo Component
 * Available in icon, full wordmark, tile, and institutional badge variants.
 */
export function SetTechLogo({
  variant = 'full',
  size = 22,
  className = '',
  iconClassName = '',
  textClassName = '',
  subtitle,
  showSubtitle = false,
}: SetTechLogoProps) {
  if (variant === 'icon') {
    return <SetTechMark size={size} className={`${iconClassName} ${className}`} />;
  }

  if (variant === 'tile') {
    return (
      <div
        className={`inline-flex items-center justify-center p-1.5 bg-white border border-zinc-200/90 rounded-xl shadow-2xs shrink-0 ${className}`}
      >
        <SetTechMark size={size} className={iconClassName} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Precision Geometric Mark Tile or Icon */}
      <div className="shrink-0 flex items-center justify-center">
        <SetTechMark size={size} className={iconClassName} />
      </div>

      {/* Wordmark: SET (#09090B) + Tech (#2563EB) */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-display font-semibold tracking-[-0.03em] text-zinc-900 leading-none ${textClassName || 'text-base'}`}
        >
          <span className="text-[#09090B]">SET</span>
          <span className="text-[#2563EB]">Tech</span>
        </span>

        {(showSubtitle || subtitle) && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80 font-medium">
            {subtitle || 'SETGOI'}
          </span>
        )}
      </div>
    </div>
  );
}

export default SetTechLogo;
