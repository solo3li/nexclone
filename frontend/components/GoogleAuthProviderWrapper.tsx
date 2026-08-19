"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { createContext } from 'react';

export const GoogleAuthContext = createContext<string | null>(null);

export function GoogleAuthProviderWrapper({
  children,
  clientId
}: {
  children: React.ReactNode;
  clientId: string | null;
}) {
  return (
    <GoogleAuthContext.Provider value={clientId}>
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
          {children}
        </GoogleOAuthProvider>
      ) : (
        <>{children}</>
      )}
    </GoogleAuthContext.Provider>
  );
}
