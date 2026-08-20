"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from '../src/i18n/routing';
import { useAuthStore } from '../src/store/useAuthStore';

function GoogleLoginInner({ refCode }: { refCode?: string }) {
  const router = useRouter();
  const { googleLogin } = useAuthStore();

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;
          try {
            await googleLogin({ 
              token: credentialResponse.credential,
              refCode: refCode
            });
            window.location.href = '/';
          } catch (error) {
            console.error("Login failed", error);
            alert("Google login failed. Please try again.");
          }
        }}
        onError={() => {
          console.error('Google Login Failed');
          alert("Google login failed. Please try again.");
        }}
        theme="outline"
        size="large"
        width="320"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}

import { useContext } from 'react';
import { GoogleAuthContext } from './GoogleAuthProviderWrapper';

export function GoogleLoginButton({ refCode }: { refCode?: string }) {
  const clientId = useContext(GoogleAuthContext);
  
  if (!clientId) {
    return null;
  }
  
  return <GoogleLoginInner refCode={refCode} />;
}
