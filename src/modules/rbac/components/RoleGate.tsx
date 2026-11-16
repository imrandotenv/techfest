import React from 'react';
import { CustomUserRole } from '../types';
import { hasRole } from '../guards';

interface RoleGateProps {
  currentRole?: CustomUserRole;
  allowedRoles: CustomUserRole | CustomUserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({
  currentRole = 'student',
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  const isAllowed = hasRole(currentRole, allowedRoles);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
