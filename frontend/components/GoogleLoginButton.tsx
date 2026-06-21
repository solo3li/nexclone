"use client";

import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function GoogleLoginButton() {
  const router = useRouter();
  const t = useTranslations('auth'); // assuming translations exist, or just use raw strings if not

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            
            // Post to our new backend endpoint
            const res = await axios.post(`${apiUrl}/api/auth/google-login`, {
              token: credentialResponse.credential
            });
            
            if (res.status === 200) {
              window.location.href = '/profile';
            }
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
        width="100%"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
