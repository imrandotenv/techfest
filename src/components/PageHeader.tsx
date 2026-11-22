import React from 'react';

interface PageHeaderProps {
  badge: string;
  badgeCode?: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  badge,
  badgeCode,
  title,
  subtitle,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-zinc-200/80 ${className}`}>
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            {badge}
          </span>
          {badgeCode && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-zinc-700 border border-zinc-200 font-mono text-[10px] sm:text-[11px] font-semibold">
              {badgeCode}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-[-0.035em] text-[#09090B] leading-[1.08] truncate sm:whitespace-normal">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed max-w-2xl font-sans">
          {subtitle}
        </p>
      </div>

      {action && (
        <div className="flex items-center gap-2 shrink-0 sm:self-center">
          {action}
        </div>
      )}
    </div>
  );
}
