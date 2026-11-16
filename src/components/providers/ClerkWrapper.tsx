'use client';

import React from 'react';
import { ClerkProvider, useUser } from '@clerk/nextjs';

/**
 * ClerkWrapper provides backwards-compatible wrapping for legacy references.
 * RootLayout in src/app/layout.tsx uses official <ClerkProvider> directly.
 */
export function ClerkWrapper({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

export function useCampusAuth() {
  const { user, isLoaded } = useUser();
  return {
    isLoaded,
    user: user ?? null,
  };
}
