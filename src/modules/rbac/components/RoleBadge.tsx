import React from 'react';
import { CustomUserRole } from '../types';
import { ShieldCheck, GraduationCap, User } from 'lucide-react';

interface RoleBadgeProps {
  role: CustomUserRole;
  isSuperAdmin?: boolean;
  className?: string;
  showIcon?: boolean;
}

export function RoleBadge({
  role,
  isSuperAdmin,
  className = '',
  showIcon = true,
}: RoleBadgeProps) {
  if (role === 'admin') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium border bg-indigo-50/80 text-indigo-700 border-indigo-200 ${className}`}
      >
        {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
        {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
      </span>
    );
  }

  if (role === 'college') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium border bg-sky-50/80 text-sky-700 border-sky-200 ${className}`}
      >
        {showIcon && <GraduationCap className="w-3.5 h-3.5 text-sky-600" />}
        COLLEGE FACULTY
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium border bg-zinc-100 text-zinc-700 border-zinc-200 ${className}`}
    >
      {showIcon && <User className="w-3.5 h-3.5 text-zinc-500" />}
      STUDENT
    </span>
  );
}
