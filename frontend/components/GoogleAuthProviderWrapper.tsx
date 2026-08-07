"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProviderWrapper({
  children,
  clientId
}: {
  children: React.ReactNode;
  clientId: string | null;
}) {
  // If no Google Client ID is configured, render children without the provider
  // This avoids "missing-client-id" console errors
  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
