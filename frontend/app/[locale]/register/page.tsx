"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "../../../src/i18n/routing";
import Navbar from "../../../src/components/Navbar";
import { Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useState, useCallback } from "react";
import api from "../../../src/utils/api";
import { useRouter } from "../../../src/i18n/routing";
import { GoogleLoginButton } from "../../../components/GoogleLoginButton";
import { useSearchParams } from "next/navigation";

// ── Validation helpers ──────────────────────────────────────────
const validateName = (v: string) => {
  if (!v) return "required";
  if (v.trim().length < 2) return "minLength";
  return null;
};
const validateEmail = (v: string) => {
  if (!v) return "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "invalid";
  return null;
};
const validatePassword = (v: string) => {
  if (!v) return "required";
  if (v.length < 8) return "minLength";
  if (!/\d/.test(v)) return "noNumber";
  return null;
};
const getPasswordStrength = (v: string): number => {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return score; // 0-4
};

const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
const strengthLabels = {
  ar: ["ضعيفة جداً", "ضعيفة", "متوسطة", "قوية"],
  en: ["Very weak", "Weak", "Fair", "Strong"],
};

// ── Framer Motion Variants ──────────────────────────────────────
const errorVariants = {
  hidden: { opacity: 0, y: -6, height: 0 },
  visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.18 } },
};

interface FieldError {
  name: string | null;
  email: string | null;
  password: string | null;
}

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Track which fields have been touched (blurred at least once)
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState<FieldError>({ name: null, email: null, password: null });

  const passwordStrength = getPasswordStrength(password);

  const getErrorMessage = (field: string, errorKey: string | null) => {
    if (!errorKey) return null;
    const messages: Record<string, Record<string, string>> = {
      name: {
        required: isRtl ? "الاسم مطلوب" : "Name is required",
        minLength: isRtl ? "الاسم يجب أن يكون حرفين على الأقل" : "Name must be at least 2 characters",
      },
      email: {
        required: isRtl ? "البريد الإلكتروني مطلوب" : "Email is required",
        invalid: isRtl ? "البريد الإلكتروني غير صالح" : "Invalid email address",
      },
      password: {
        required: isRtl ? "كلمة المرور مطلوبة" : "Password is required",
        minLength: isRtl ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters",
        noNumber: isRtl ? "يجب أن تحتوي على رقم واحد على الأقل" : "Must contain at least one number",
      },
    };
    return messages[field]?.[errorKey] ?? null;
  };

  const handleBlur = useCallback((field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validators = { name: validateName, email: validateEmail, password: validatePassword };
    const values = { name, email, password };
    setFieldErrors((prev) => ({ ...prev, [field]: validators[field](values[field]) }));
  }, [name, email, password]);

  const handleChange = (field: keyof typeof touched, value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value.toLowerCase());
    if (field === "password") setPassword(value);

    if (touched[field]) {
      const validators = { name: validateName, email: validateEmail, password: validatePassword };
      const updatedValue = value;
      setFieldErrors((prev) => ({ ...prev, [field]: validators[field](updatedValue) }));
    }
  };

  const isFormValid =
    !validateName(name) && !validateEmail(email) && !validatePassword(password) && acceptedPolicy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all fields to show errors
    setTouched({ name: true, email: true, password: true });
    setFieldErrors({
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    });
    if (!acceptedPolicy) {
      setError(isRtl ? "يجب الموافقة على سياسة الخصوصية أولاً" : "You must agree to the privacy policy first");
      return;
    }
    if (!isFormValid) return;

    setLoading(true);
    setError("");
    try {
      const fpPromise = import("@fingerprintjs/fingerprintjs").then((FingerprintJS) => FingerprintJS.load());
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;

      const res = await api.post("/api/auth/register", {
        fullName: name,
        email,
        password,
        country: "Unknown",
        deviceFingerprint: visitorId,
        refCode: refCode,
      });

      const freeTrialAssigned = res.data?.FreeTrialAssigned ?? false;

      if (freeTrialAssigned) {
        // Got free trial → show free-trial page (router.push handles locale automatically)
        router.push("/free-trial");
      } else {
        // No free trial (already used or plan doesn't exist) → show email verification screen
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.Message || err.response?.data?.Errors?.[0] || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Reusable field status indicator ──
  const FieldIcon = ({ field, icon: Icon }: { field: keyof typeof touched; icon: any }) => {
    const hasError = touched[field] && fieldErrors[field];
    const isValid = touched[field] && !fieldErrors[field] && (field === "name" ? name : field === "email" ? email : password);
    if (isValid) return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    if (hasError) return <XCircle className="h-5 w-5 text-red-400" />;
    return <Icon className="h-5 w-5 text-white/40 group-focus-within:text-pink-400 transition-colors" />;
  };

  const inputClass = (field: keyof typeof touched) => {
    const hasError = touched[field] && fieldErrors[field];
    const isValid = touched[field] && !fieldErrors[field] && (field === "name" ? name : field === "email" ? email : password);
    const base = "w-full bg-white/5 border rounded-xl px-10 py-3 text-white placeholder-white/30 focus:outline-none transition-all duration-300";
    if (hasError) return `${base} border-red-500/60 focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60`;
    if (isValid) return `${base} border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50`;
    return `${base} border-white/10 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50`;
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-pink-500" />

          <h1 className="text-3xl font-bold text-white mb-2 text-center">{t("register")}</h1>

          {isSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50">
                <Mail className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isRtl ? "تم إنشاء الحساب بنجاح!" : "Account Created Successfully!"}
              </h2>
              <p className="text-white/70 leading-relaxed text-sm">
                {isRtl
                  ? "لقد أرسلنا رابط تفعيل إلى بريدك الإلكتروني. يرجى التحقق من البريد الوارد (أو مجلد الرسائل المزعجة) والضغط على الرابط لتفعيل حسابك."
                  : "We have sent an activation link to your email. Please check your inbox (or spam folder) and click the link to activate your account."}
              </p>
              <button
                onClick={() => router.push(`/${locale}/login`)}
                className="w-full py-4 mt-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20"
              >
                {t("login")}
              </button>
            </motion.div>
          ) : (
            <>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="global-error"
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
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">{t("name")}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3 flex items-center pointer-events-none">
                        <FieldIcon field="name" icon={User} />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className={inputClass("name")}
                        placeholder={isRtl ? "الاسم الكامل" : "Full Name"}
                      />
                    </div>
                    <AnimatePresence>
                      {touched.name && fieldErrors.name && (
                        <motion.p
                          key="name-error"
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-red-400 text-xs mt-1 overflow-hidden"
                        >
                          {getErrorMessage("name", fieldErrors.name)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">{t("email")}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3 flex items-center pointer-events-none">
                        <FieldIcon field="email" icon={Mail} />
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
                          key="email-error"
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
                    <label className="block text-sm font-medium text-white/70 mb-2">{t("password")}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3 flex items-center pointer-events-none">
                        <FieldIcon field="password" icon={Lock} />
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

                    {/* Password strength bar */}
                    <AnimatePresence>
                      {password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 overflow-hidden"
                        >
                          <div className="flex gap-1 mb-1">
                            {[0, 1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className="h-1 flex-1 rounded-full overflow-hidden bg-white/10"
                              >
                                <motion.div
                                  className={`h-full rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-transparent"}`}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: i < passwordStrength ? 1 : 0 }}
                                  style={{ transformOrigin: "left" }}
                                  transition={{ duration: 0.3, delay: i * 0.05 }}
                                />
                              </motion.div>
                            ))}
                          </div>
                          {passwordStrength > 0 && (
                            <p className={`text-xs ${["text-red-400", "text-orange-400", "text-yellow-400", "text-emerald-400"][passwordStrength - 1]}`}>
                              {strengthLabels[isRtl ? "ar" : "en"][passwordStrength - 1]}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {touched.password && fieldErrors.password && (
                        <motion.p
                          key="password-error"
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

                  {/* Privacy checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={acceptedPolicy}
                      onChange={(e) => setAcceptedPolicy(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/50 cursor-pointer"
                    />
                    <label htmlFor="privacy" className="text-sm text-white/70 leading-relaxed cursor-pointer">
                      {isRtl ? "لقد قرأت وأوافق على " : "I have read and agree to the "}
                      <Link href="/privacy" target="_blank" className="text-pink-400 hover:text-pink-300 underline font-medium">
                        {isRtl ? "سياسة الخصوصية" : "Privacy Policy"}
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  className="group relative w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
                  <span className="relative">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        />
                        {isRtl ? "جاري الإنشاء..." : "Creating..."}
                      </span>
                    ) : (
                      t("submitRegister")
                    )}
                  </span>
                  {!loading && <ArrowIcon className={`w-5 h-5 relative transition-transform duration-300 ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />}
                </motion.button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink-0 mx-4 text-white/40 text-sm">{isRtl ? "أو" : "or"}</span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                <GoogleLoginButton refCode={refCode} />
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/50 text-sm">
                  {t("haveAccount")}{" "}
                  <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium ltr:ml-1 rtl:mr-1">
                    {t("login")}
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
