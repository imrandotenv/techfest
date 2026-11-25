'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getResolvedRole } from '@/lib/auth-client';

export type PreviewRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

interface RolePreviewContextValue {
  previewRole: PreviewRole;
  setPreviewRole: (role: PreviewRole) => void;
  resetToAdmin: () => void;
  isRealAdmin: boolean;
  isPreviewMode: boolean;
}

const STORAGE_KEY = 'settech_admin_preview_role';

const RolePreviewContext = createContext<RolePreviewContextValue>({
  previewRole: 'ADMIN',
  setPreviewRole: () => {},
  resetToAdmin: () => {},
  isRealAdmin: false,
  isPreviewMode: false,
});

export function RolePreviewProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const realRole = getResolvedRole(user);
  const isRealAdmin = isLoaded && realRole === 'admin';

  const [previewRole, setPreviewRoleState] = useState<PreviewRole>('ADMIN');

  // Hydrate from sessionStorage only when real user has ADMIN clearance
  useEffect(() => {
    if (!isLoaded) return;
    if (!isRealAdmin) {
      setPreviewRoleState('ADMIN');
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      return;
    }

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved === 'ADMIN' || saved === 'FACULTY' || saved === 'STUDENT') {
        setPreviewRoleState(saved);
      }
    } catch {}
  }, [isLoaded, isRealAdmin]);

  const setPreviewRole = useCallback(
    (role: PreviewRole) => {
      if (!isRealAdmin) return;
      setPreviewRoleState(role);
      try {
        sessionStorage.setItem(STORAGE_KEY, role);
      } catch {}
    },
    [isRealAdmin]
  );

  const resetToAdmin = useCallback(() => {
    setPreviewRole('ADMIN');
  }, [setPreviewRole]);

  const isPreviewMode = isRealAdmin && previewRole !== 'ADMIN';

  return (
    <RolePreviewContext.Provider
      value={{
        previewRole: isRealAdmin ? previewRole : 'ADMIN',
        setPreviewRole,
        resetToAdmin,
        isRealAdmin,
        isPreviewMode,
      }}
    >
      {children}
    </RolePreviewContext.Provider>
  );
}

export function useRolePreview() {
  return useContext(RolePreviewContext);
}
