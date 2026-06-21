"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProviderWrapper({
  children,
  clientId
}: {
  children: React.ReactNode;
  clientId: string | null;
}) {
  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
