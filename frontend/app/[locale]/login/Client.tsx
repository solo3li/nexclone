"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "../../../src/i18n/routing";
import Navbar from "../../../src/components/Navbar";
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle, XCircle, Eye, EyeOff, ShieldAlert, Timer } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

import { useAuthStore } from "../../../src/store/useAuthStore";
import { GoogleLoginButton } from "../../../components/GoogleLoginButton";
import { getCookie } from "../../../src/utils/getCookie";

// ── Validation ──────────────────────────────────────────────────
const validateEmail = (v: string) => {
  if (!v) return "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "invalid";
  return null;
};
const validatePassword = (v: string) => {
  if (!v) return "required";
  if (v.length < 6) return "minLength";
  return null;
};

const errorVariants = {
  hidden: { opacity: 0, y: -6, height: 0 },
  visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.18 } },
};

export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setError("");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: null as string | null, password: null as string | null });

  const getErrorMessage = (field: "email" | "password", errorKey: string | null) => {
    if (!errorKey) return null;
    const messages = {
      email: {
        required: isRtl ? "البريد الإلكتروني مطلوب" : "Email is required",
        invalid: isRtl ? "البريد الإلكتروني غير صالح" : "Invalid email address",
      },
      password: {
        required: isRtl ? "كلمة المرور مطلوبة" : "Password is required",
        minLength: isRtl ? "كلمة المرور قصيرة جداً" : "Password is too short",
      },
    };
    return (messages[field] as any)?.[errorKey] ?? null;
  };

  const handleBlur = useCallback(
    (field: "email" | "password") => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const validators = { email: validateEmail, password: validatePassword };
      const values = { email, password };
      setFieldErrors((prev) => ({ ...prev, [field]: validators[field](values[field]) }));
    },
    [email, password]
  );

  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value.toLowerCase());
    if (field === "password") setPassword(value);
    if (touched[field]) {
      const validators = { email: validateEmail, password: validatePassword };
      setFieldErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  const inputClass = (field: "email" | "password") => {
    const hasError = touched[field] && fieldErrors[field];
    const val = field === "email" ? email : password;
    const isValid = touched[field] && !fieldErrors[field] && val;
    const base = "w-full bg-white/5 border rounded-xl px-10 py-3 text-white placeholder-white/30 focus:outline-none transition-all duration-300";
    if (hasError) return `${base} border-red-500/60 focus:ring-2 focus:ring-red-500/40`;
    if (isValid) return `${base} border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/40`;
    return `${base} border-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50`;
  };

  const FieldStatusIcon = ({ field, icon: Icon }: { field: "email" | "password"; icon: any }) => {
    const val = field === "email" ? email : password;
    const isValid = touched[field] && !fieldErrors[field] && val;
    const hasError = touched[field] && fieldErrors[field];
    if (isValid) return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    if (hasError) return <XCircle className="h-5 w-5 text-red-400" />;
    return <Icon className="h-5 w-5 text-white/40 group-focus-within:text-violet-400 transition-colors" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setFieldErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;

    setLoading(true);
    setError("");
    try {
      let visitorId = "unknown";
      try {
        const fpPromise = import("@fingerprintjs/fingerprintjs").then((FingerprintJS) => FingerprintJS.load());
        const fp = await Promise.race([
          fpPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error("fp timeout")), 2000))
        ]) as any;
        
        const resultPromise = fp.get();
        const result = await Promise.race([
          resultPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error("fp get timeout")), 2000))
        ]) as any;
        
        visitorId = result.visitorId;
      } catch (e) {
        console.warn("Fingerprint blocked or timed out, using fallback");
      }

      await login({ email, password, deviceFingerprint: visitorId });
      router.push("/");
    } catch (err: any) {
      if (err.response?.data?.RequiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      if (err.response?.data?.IsLockedOut) {
        const secs = err.response.data.RemainingSeconds || 900;
        setLockoutSeconds(secs);
        setError(err.response.data.Message || (isRtl ? "تم قفل الحساب مؤقتاً بسبب تكرار المحاولات الخاطئة." : "Account temporarily locked."));
        return;
      }
      setError(err.response?.data?.Message || (isRtl ? "فشل تسجيل الدخول، يرجى المحاولة مرة أخرى" : "Login failed, please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-violet-600/10 blur-[120px] pointer-events-none z-0 rounded-full" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />

          <h1 className="text-3xl font-bold text-white mb-2 text-center">{t("login")}</h1>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {lockoutSeconds !== null && lockoutSeconds > 0 && (
                <motion.div
                  key="lockout-alert"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-sm overflow-hidden flex flex-col gap-2 items-center text-center shadow-lg shadow-amber-500/5"
                >
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span>{isRtl ? "الحساب مقفل مؤقتاً" : "Account Temporarily Locked"}</span>
                  </div>
                  <p className="text-xs text-amber-200/80">
                    {isRtl
                      ? "تم استنفاد عدد المحاولات الخاطئة. يرجى الانتظار حتى انتهاء الوقت للمحاولة مرة أخرى:"
                      : "Too many failed login attempts. Please wait until the timer expires:"}
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl font-mono text-xl font-bold text-amber-300 tracking-wider">
                    <Timer className="w-5 h-5 animate-spin text-amber-400" style={{ animationDuration: '4s' }} />
                    <span>{formatTimer(lockoutSeconds)}</span>
                  </div>
                </motion.div>
              )}

              {error && (!lockoutSeconds || lockoutSeconds <= 0) && (
                <motion.div
                  key="login-error"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("email")}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3 flex items-center pointer-events-none">
                    <FieldStatusIcon field="email" icon={Mail} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={inputClass("email")}
                    placeholder="user@example.com"
                  />
                </div>
                <AnimatePresence>
                  {touched.email && fieldErrors.email && (
                    <motion.p
                      key="email-err"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-red-400 text-xs mt-1 overflow-hidden"
                    >
                      {getErrorMessage("email", fieldErrors.email)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-white/70">{t("password")}</label>
                  <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300">
                    {t("forgotPassword")}
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3 flex items-center pointer-events-none">
                    <FieldStatusIcon field="password" icon={Lock} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`${inputClass("password")} ltr:pr-10 rtl:pl-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {touched.password && fieldErrors.password && (
                    <motion.p
                      key="pass-err"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-red-400 text-xs mt-1 overflow-hidden"
                    >
                      {getErrorMessage("password", fieldErrors.password)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || (lockoutSeconds !== null && lockoutSeconds > 0)}
              whileHover={!loading && (!lockoutSeconds || lockoutSeconds <= 0) ? { scale: 1.01, y: -1 } : {}}
              whileTap={!loading && (!lockoutSeconds || lockoutSeconds <= 0) ? { scale: 0.99 } : {}}
              className="group relative w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
              <span className="relative">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                    {isRtl ? "جاري الدخول..." : "Signing in..."}
                  </span>
                ) : lockoutSeconds !== null && lockoutSeconds > 0 ? (
                  <span className="flex items-center gap-2 font-mono">
                    <Timer className="w-5 h-5" />
                    {isRtl ? `انتظر (${formatTimer(lockoutSeconds)})` : `Wait (${formatTimer(lockoutSeconds)})`}
                  </span>
                ) : (
                  t("submitLogin")
                )}
              </span>
              {!loading && (!lockoutSeconds || lockoutSeconds <= 0) && (
                <ArrowIcon
                  className={`w-5 h-5 relative transition-transform duration-300 ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                />
              )}
            </motion.button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink-0 mx-4 text-white/40 text-sm">{isRtl ? "أو" : "or"}</span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <GoogleLoginButton refCode={getCookie("aff_session")} />
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              {t("noAccount")}{" "}
              <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium ltr:ml-1 rtl:mr-1">
                {t("register")}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
