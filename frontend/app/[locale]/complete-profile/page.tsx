"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../src/utils/api";
import { useRouter } from "../../../src/i18n/routing";
import { useAppStore } from "../../../src/store/useAppStore";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";

export default function CompleteProfilePage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;
  const router = useRouter();
  
  const { user, isAuthenticated, hasPhoneNumber, setUser } = useAppStore();

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not authenticated, go to login
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (hasPhoneNumber) {
      // If already has phone number, go to tools
      router.replace("/tools");
    }
  }, [isAuthenticated, hasPhoneNumber, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (phone.length < 8) {
      setError(locale === 'ar' ? "رقم الهاتف قصير جداً" : "Phone number is too short");
      setLoading(false);
      return;
    }

    try {
      // Generate Fingerprint
      const fpPromise = import('@fingerprintjs/fingerprintjs').then(FingerprintJS => FingerprintJS.load());
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;

      const res = await api.post("/api/auth/add-phone", {
        phoneNumber: `${countryCode}${phone}`,
        deviceFingerprint: visitorId
      });

      // Update store
      setUser({ ...user, hasPhoneNumber: true });
      
      // Navigate to tools
      router.push("/tools");
    } catch (err: any) {
      setError(err.response?.data?.Message || err.response?.data?.Errors?.[0] || "Failed to add phone number");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || hasPhoneNumber) {
    return null; // Avoid flashing content while redirecting
  }

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-violet-600/10 blur-[120px] pointer-events-none z-0 rounded-full" />
      
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-pink-500" />
          
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {locale === 'ar' ? 'إكمال البيانات' : 'Complete Profile'}
          </h1>
          <p className="text-center text-white/60 text-sm mb-6">
            {locale === 'ar' ? 'يرجى إدخال رقم هاتفك للمتابعة والحصول على الباقة المجانية.' : 'Please enter your phone number to continue and claim your free trial.'}
          </p>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <div className="flex gap-2" dir="ltr">
                  <div className="relative group w-[35%]">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="+20" className="bg-[#0a0015] text-white">🇪🇬 +20</option>
                      <option value="+966" className="bg-[#0a0015] text-white">🇸🇦 +966</option>
                      <option value="+971" className="bg-[#0a0015] text-white">🇦🇪 +971</option>
                      <option value="+965" className="bg-[#0a0015] text-white">🇰🇼 +965</option>
                      <option value="+974" className="bg-[#0a0015] text-white">🇶🇦 +974</option>
                      <option value="+968" className="bg-[#0a0015] text-white">🇴🇲 +968</option>
                      <option value="+973" className="bg-[#0a0015] text-white">🇧🇭 +973</option>
                      <option value="+212" className="bg-[#0a0015] text-white">🇲🇦 +212</option>
                      <option value="+213" className="bg-[#0a0015] text-white">🇩🇿 +213</option>
                      <option value="+216" className="bg-[#0a0015] text-white">🇹🇳 +216</option>
                      <option value="+962" className="bg-[#0a0015] text-white">🇯🇴 +962</option>
                      <option value="+961" className="bg-[#0a0015] text-white">🇱🇧 +961</option>
                      <option value="+963" className="bg-[#0a0015] text-white">🇸🇾 +963</option>
                      <option value="+964" className="bg-[#0a0015] text-white">🇮🇶 +964</option>
                      <option value="+970" className="bg-[#0a0015] text-white">🇵🇸 +970</option>
                      <option value="+249" className="bg-[#0a0015] text-white">🇸🇩 +249</option>
                      <option value="+218" className="bg-[#0a0015] text-white">🇱🇾 +218</option>
                      <option value="+967" className="bg-[#0a0015] text-white">🇾🇪 +967</option>
                    </select>
                  </div>
                  <div className="relative group w-[65%]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-white/40 group-focus-within:text-pink-400 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                      placeholder="1001234567"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 8}
              className="group relative w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
              <span className="relative">{loading ? "..." : (locale === 'ar' ? 'تأكيد' : 'Confirm')}</span>
              <ArrowIcon className={`w-5 h-5 relative transition-transform duration-300 ${locale === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
