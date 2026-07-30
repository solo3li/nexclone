import React, { createContext, useContext, useState, useEffect } from 'react';
import { setItemAsync, getItemAsync, deleteItemAsync } from '../utils/storage';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

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


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; isVerified: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on app start
    getItemAsync('userToken').then((token) => {
      if (token) {
        getItemAsync('userEmail').then((email) => {
          getItemAsync('userVerified').then((verified) => {
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


  const signIn = async (token: string, email: string, isVerified: boolean) => {
    await setItemAsync('userToken', token);
    await setItemAsync('userEmail', email);
    await setItemAsync('userVerified', isVerified.toString());
    setUser({ email, isVerified });
  };

  const signOut = async () => {
    await deleteItemAsync('userToken');
    await deleteItemAsync('userEmail');
    await deleteItemAsync('userVerified');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
