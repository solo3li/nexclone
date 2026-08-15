'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useAffiliateStore } from '@/store/useAffiliateStore';

export default function AffiliateOnboardingForm() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const { onboardProfile } = useAffiliateStore();

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!policyAccepted) {
      setError(isRtl ? 'يجب الموافقة على سياسة الانضمام.' : 'You must accept the affiliate policy.');
      return;
    }

    setIsSubmitting(true);
    const res = await onboardProfile({
      mobileNumber: whatsappNumber, // Using whatsapp as mobile for now
      telegramUsername: "",
      whatsappNumber: whatsappNumber,
      facebookAccount: "",
    });

    if (!res.success) {
      setError(res.error || (isRtl ? 'حدث خطأ أثناء الانضمام' : 'Error occurred while onboarding.'));
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mt-16 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md text-center"
    >
      <div className="mb-10">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4">
          {isRtl ? 'انضم إلينا واربح' : 'Join Us and Earn'}
        </h2>
        <p className="text-white/70 text-lg leading-relaxed max-w-lg mx-auto">
          {isRtl 
            ? 'كن جزءاً من قصة نجاحنا. شارك المنصة مع أصدقائك وجمهورك واحصل على عمولات مجزية ومتكررة عن كل شخص يشترك من خلالك.' 
            : 'Be part of our success story. Share the platform with your friends and audience to earn rewarding recurring commissions for every subscriber.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        
        <div className="flex flex-col gap-2 text-left rtl:text-right">
          <label htmlFor="whatsapp" className="text-sm text-white/80 font-medium">
            {isRtl ? 'Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ù„Ù„ØªÙˆØ§ØµÙ„' : 'WhatsApp Number for Contact'}
          </label>
          <input
            type="text"
            id="whatsapp"
            required
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            dir="ltr"
            placeholder="+201012345678"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        <div className="flex items-start gap-3 text-left rtl:text-right bg-black/20 p-4 rounded-xl border border-white/5">
          <input
            type="checkbox"
            id="policy"
            checked={policyAccepted}
            onChange={(e) => setPolicyAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-white/10 bg-black/40 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 shrink-0"
          />
          <label htmlFor="policy" className="text-sm text-white/80 cursor-pointer select-none leading-tight">
            {isRtl 
              ? 'أوافق على سياسة التسويق بالعمولة والشروط والأحكام الخاصة بالمنصة للبدء في جني الأرباح.' 
              : 'I agree to the affiliate marketing policy and the platform terms and conditions to start earning.'}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !policyAccepted}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
        >
          {isSubmitting 
            ? (isRtl ? 'جاري الانضمام...' : 'Joining...') 
            : (isRtl ? 'انضم الآن وابدأ الربح' : 'Join Now and Start Earning')}
        </button>
      </form>
    </motion.div>
  );
}
