"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "../../../src/i18n/routing";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../../../src/utils/api";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";

function VerifyEmailContent() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage(locale === 'ar' ? "رابط التفعيل غير صالح." : "Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post("/api/auth/verify-email", { email, token });
        setStatus("success");
        setMessage(res.data.Message || (locale === 'ar' ? "تم تفعيل حسابك بنجاح!" : "Account verified successfully!"));
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.Message || (locale === 'ar' ? "حدث خطأ أثناء التفعيل." : "Verification failed."));
      }
    };

    verify();
  }, [email, token, locale]);

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-violet-600/10 blur-[120px] pointer-events-none z-0 rounded-full" />
      
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-pink-500" />
          
          <h1 className="text-3xl font-bold text-white mb-6">
            {locale === 'ar' ? 'تفعيل الحساب' : 'Account Verification'}
          </h1>

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin" />
              <p className="text-white/70">
                {locale === 'ar' ? 'جاري التحقق من الرابط...' : 'Verifying link...'}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
              <p className="text-lg text-emerald-200">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <XCircle className="w-16 h-16 text-red-500" />
              <p className="text-lg text-red-300">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
              >
                {locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0015] flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-fuchsia-500" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
