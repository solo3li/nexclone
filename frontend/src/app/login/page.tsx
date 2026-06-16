"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  // Get state and actions from Zustand
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login({ email, password });
      router.push("/dashboard"); // Redirect on success
    } catch (err: any) {
      // Error is handled by Zustand and displayed below
    }
  };
  return (
    <main className="min-h-screen bg-[var(--color-bento-bg)] flex flex-col items-center justify-center p-6 selection:bg-blue-500/30 relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
               <img src="/static/home/img/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-extrabold tracking-tight text-2xl text-white">NexMedia AI</span>
          </div>
        </div>

        <div className="bento-card p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[var(--color-bento-muted)] text-sm">Sign in to your NexMedia AI account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bento-input w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bento-input w-full"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bento-btn-accent w-full py-3.5 mt-4 text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-[var(--color-bento-muted)] text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
