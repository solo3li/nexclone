"use client";

import { useGoogleOAuth } from '@react-oauth/google';
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
            router.push('/');
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

export function GoogleLoginButton({ refCode }: { refCode?: string }) {
  // Only render if the GoogleOAuthProvider is active (clientId is configured)
  try {
    // This hook throws if GoogleOAuthProvider is not in the tree
    useGoogleOAuth();
    return <GoogleLoginInner refCode={refCode} />;
  } catch {
    return null;
  }
}
