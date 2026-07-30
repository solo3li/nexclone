import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  signIn: (token: string, email: string, isVerified: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  user: { email: string; isVerified: boolean } | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)/');
    }
  }, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; isVerified: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on app start
    SecureStore.getItemAsync('userToken').then((token) => {
      if (token) {
        SecureStore.getItemAsync('userEmail').then((email) => {
          SecureStore.getItemAsync('userVerified').then((verified) => {
            if (email) {
              setUser({ email, isVerified: verified === 'true' });
            }
            setIsLoading(false);
          });
        });
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  useProtectedRoute(user);

  const signIn = async (token: string, email: string, isVerified: boolean) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userEmail', email);
    await SecureStore.setItemAsync('userVerified', isVerified.toString());
    setUser({ email, isVerified });
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userEmail');
    await SecureStore.deleteItemAsync('userVerified');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
