"use client";

import { useEffect } from "react";
import api from "../utils/api";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import LogoutModal from "./modals/LogoutModal";

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isMounted = true;

    const initAuthSession = async () => {
      try {
        // api has withCredentials: true, so browser sends the HttpOnly 'jwt' cookie automatically
        const res = await api.get('/api/auth/me');
        if (isMounted && res.data) {
          useAppStore.getState().setUser(res.data);
          useAuthStore.getState().setUser(res.data);
        }
      } catch (err: any) {
        if (isMounted) {
          useAppStore.getState().setUser(null);
          useAuthStore.getState().setUser(null);
        }
      } finally {
        if (isMounted) {
          useAppStore.getState().setInitializing(false);
          useAuthStore.getState().setInitializing(false);
        }
      }
    };

    initAuthSession();

    const handleUnauthorized = () => {
      useAppStore.getState().logout();
      useAuthStore.getState().setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <>
      {children}
      <LogoutModal />
    </>
  );
}
