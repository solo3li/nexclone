'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useAffiliateStore } from '@/store/useAffiliateStore';

export default function AffiliateOnboardingForm() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const { onboardProfile } = useAffiliateStore();

  const [mobileNumber, setMobileNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [facebookAccount, setFacebookAccount] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mobileNumber) {
      setError(isRtl ? 'رقم الهاتف مطلوب.' : 'Mobile number is required.');
      return;
    }
    if (!telegramUsername && !whatsappNumber && !facebookAccount) {
      setError(isRtl ? 'يجب إدخال وسيلة تواصل إضافية واحدة على الأقل (تليجرام، واتساب، أو فيسبوك).' : 'At least one additional contact method (Telegram, WhatsApp, or Facebook) is required.');
      return;
    }
    if (!policyAccepted) {
      setError(isRtl ? 'يجب الموافقة على سياسة الانضمام.' : 'You must accept the affiliate policy.');
      return;
    }

    setIsSubmitting(true);
    const res = await onboardProfile({
      mobileNumber,
      telegramUsername: telegramUsername || undefined,
      whatsappNumber: whatsappNumber || undefined,
      facebookAccount: facebookAccount || undefined,
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
      className="max-w-xl mx-auto mt-10 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          {isRtl ? 'انضم لبرنامج التسويق بالعمولة' : 'Join the Affiliate Program'}
        </h2>
        <p className="text-white/60 mt-2 text-sm">
          {isRtl ? 'يرجى إكمال البيانات التالية للبدء في ربح العمولات.' : 'Please complete the following details to start earning commissions.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            {isRtl ? 'رقم الهاتف (مطلوب)' : 'Mobile Number (Required)'}
          </label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder={isRtl ? '01xxxxxxxxx' : '+1xxxxxxxxx'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            {isRtl ? 'اسم المستخدم على تليجرام' : 'Telegram Username'}
          </label>
          <input
            type="text"
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="@username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            {isRtl ? 'رقم الواتساب' : 'WhatsApp Number'}
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder={isRtl ? '01xxxxxxxxx' : '+1xxxxxxxxx'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            {isRtl ? 'رابط حساب الفيسبوك' : 'Facebook Account Link'}
          </label>
          <input
            type="text"
            value={facebookAccount}
            onChange={(e) => setFacebookAccount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="flex items-start gap-3 mt-4">
          <input
            type="checkbox"
            id="policy"
            checked={policyAccepted}
            onChange={(e) => setPolicyAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-white/10 bg-black/40 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
          />
          <label htmlFor="policy" className="text-sm text-white/60 cursor-pointer select-none">
            {isRtl 
              ? 'أوافق على سياسة التسويق بالعمولة والشروط والأحكام الخاصة بالمنصة.' 
              : 'I agree to the affiliate marketing policy and the platform terms and conditions.'}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting 
            ? (isRtl ? 'جاري الانضمام...' : 'Joining...') 
            : (isRtl ? 'انضمام الآن' : 'Join Now')}
        </button>
      </form>
    </motion.div>
  );
}
