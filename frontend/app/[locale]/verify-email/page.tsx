"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "../../../src/i18n/routing";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useAuthStore } from "../../../src/store/useAuthStore";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";

function VerifyEmailContent() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  // Status can be: 'loading', 'success', 'error', 'timer'
  const [status, setStatus] = useState<"loading" | "success" | "error" | "timer">("loading");
  const [message, setMessage] = useState("");
  const { verifyEmail, checkCooldown, resendVerification } = useAuthStore();
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setMessage(locale === 'ar' ? "البريد الإلكتروني مفقود." : "Email is missing.");
      return;
    }

    // SCENARIO 1: Token exists => Verify the email
    if (token) {
      const verify = async () => {
        try {
          const res = await verifyEmail(email, token);
          setStatus("success");
          setMessage(res.Message || (locale === 'ar' ? "تم تفعيل حسابك بنجاح!" : "Account verified successfully!"));
        } catch (err: any) {
          setStatus("error");
          setMessage(err.response?.data?.Message || (locale === 'ar' ? "حدث خطأ أثناء التفعيل." : "Verification failed."));
        }
      };
      verify();
      return;
    }

    // SCENARIO 2: No Token => Show Timer / Resend Screen
    const fetchCooldown = async () => {
      try {
        const res = await checkCooldown(email);
        
        if (res.Allowed === false && res.Message === "تم تفعيل الحساب مسبقاً.") {
           // User is already verified
           setStatus("success");
           setMessage(locale === 'ar' ? "حسابك مفعل مسبقاً." : "Your account is already verified.");
           return;
        }

        setStatus("timer");
        setRemainingSeconds(res.RemainingSeconds || 0);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.Message || (locale === 'ar' ? "حدث خطأ أثناء فحص حالة الحساب." : "Failed to check account status."));
      }
    };

    fetchCooldown();
  }, [email, token, locale]);

  // Handle Local Timer
  useEffect(() => {
    if (status !== "timer" || remainingSeconds <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, remainingSeconds]);

  const handleResend = async () => {
    if (!email || remainingSeconds > 0) return;
    
    setStatus("loading");
    try {
      const res = await resendVerification(email);
      setMessage(res.Message || (locale === 'ar' ? "تم إرسال رسالة التفعيل بنجاح." : "Verification email sent successfully."));
      setRemainingSeconds(300); // 5 minutes
      setStatus("timer");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.Message || (locale === 'ar' ? "فشل إرسال رسالة التفعيل." : "Failed to send verification email."));
      // Restore timer if it was a rate limit error (e.g. from a different tab)
      if (err.response?.status === 429) {
          checkCooldown(email).then(res => {
              setRemainingSeconds(res.RemainingSeconds || 0);
              setStatus("timer");
          });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
                {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
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

          {status === "timer" && (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <Mail className="w-16 h-16 text-fuchsia-400 mb-2" />
              <p className="text-lg text-white font-semibold">
                 {locale === 'ar' ? 'الرجاء فحص صندوق الوارد الخاص بك' : 'Please check your inbox'}
              </p>
              <p className="text-sm text-white/60 mb-6">
                 {locale === 'ar' 
                    ? `لقد أرسلنا رسالة تفعيل إلى ${email}` 
                    : `We sent a verification email to ${email}`}
              </p>

              {message && <p className="text-emerald-400 text-sm mb-4">{message}</p>}
              
              <div className="flex flex-col items-center w-full bg-black/20 p-6 rounded-2xl border border-white/5">
                 {remainingSeconds > 0 ? (
                    <>
                      <p className="text-white/70 mb-2">{locale === 'ar' ? 'يمكنك إعادة الإرسال بعد' : 'You can resend in'}</p>
                      <div className="text-4xl font-bold font-mono text-fuchsia-400 mb-2">
                        {formatTime(remainingSeconds)}
                      </div>
                      <button disabled className="mt-2 px-6 py-2 rounded-lg bg-white/5 text-white/40 cursor-not-allowed">
                        {locale === 'ar' ? 'إعادة إرسال الرابط' : 'Resend Link'}
                      </button>
                    </>
                 ) : (
                    <>
                      <p className="text-white/70 mb-2">{locale === 'ar' ? 'لم تصلك الرسالة؟' : 'Didn\'t receive the email?'}</p>
                      <button 
                        onClick={handleResend}
                        className="mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all"
                      >
                        {locale === 'ar' ? 'إعادة إرسال الرابط' : 'Resend Link'}
                      </button>
                    </>
                 )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <XCircle className="w-16 h-16 text-red-500" />
              <p className="text-lg text-red-300">{message}</p>
              {email ? (
                  <button
                    onClick={() => {
                        setMessage("");
                        setStatus("loading");
                        // Refresh cooldown logic
                        checkCooldown(email)
                           .then(res => {
                              setStatus("timer");
                              setRemainingSeconds(res.RemainingSeconds || 0);
                           }).catch(() => setStatus("error"));
                    }}
                    className="mt-6 px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                  >
                    {locale === 'ar' ? 'تحديث الحالة' : 'Refresh Status'}
                  </button>
              ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="mt-6 px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                  >
                    {locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                  </button>
              )}
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
