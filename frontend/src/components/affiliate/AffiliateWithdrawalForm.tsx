'use client';

import { useState } from 'react';
import { useAffiliateStore, AffiliateCurrencyBalance } from '@/store/useAffiliateStore';

interface Props {
  balances: AffiliateCurrencyBalance[];
  isRtl: boolean;
}

const PAYOUT_METHODS = [
  { id: 'PayPal', labelEn: 'PayPal', labelAr: 'باي بال (PayPal)' },
  { id: 'Bank Transfer', labelEn: 'Bank Transfer', labelAr: 'تحويل بنكي' },
  { id: 'Vodafone Cash', labelEn: 'Vodafone Cash (Egypt Only)', labelAr: 'فودافون كاش (مصر فقط)' }
];

export default function AffiliateWithdrawalForm({ balances, isRtl }: Props) {
  const { requestPayout } = useAffiliateStore();
  const availableBalances = balances.filter(b => b.available > 0);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(availableBalances[0]?.currency || 'USD');
  const [method, setMethod] = useState(PAYOUT_METHODS[0].id);
  const [account, setAccount] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError(isRtl ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }

    const currentBalance = availableBalances.find(b => b.currency === currency)?.available || 0;
    if (Number(amount) > currentBalance) {
      setError(isRtl ? 'المبلغ المطلوب يتجاوز الرصيد المتاح' : 'Requested amount exceeds available balance');
      return;
    }

    if (!account.trim()) {
      setError(isRtl ? 'يرجى إدخال بيانات الحساب' : 'Please enter your account details');
      return;
    }

    setLoading(true);
    const res = await requestPayout({
      amount: Number(amount),
      currency,
      payoutMethod: method,
      payoutAccount: account.trim()
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setAmount('');
      setAccount('');
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(res.error || (isRtl ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'));
    }
  };

  if (availableBalances.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="text-3xl mb-4">💸</div>
        <h3 className="text-xl font-bold text-white mb-2">
          {isRtl ? 'لا يوجد رصيد متاح للسحب' : 'No available balance for withdrawal'}
        </h3>
        <p className="text-white/40">
          {isRtl
            ? 'تصبح العمولات متاحة للسحب بعد انتهاء فترة التجميد.'
            : 'Commissions become available for withdrawal after the hold period.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">
        {isRtl ? 'طلب سحب أرباح' : 'Request Payout'}
      </h2>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {isRtl ? 'تم إرسال طلب السحب بنجاح. سنقوم بمراجعته قريباً.' : 'Payout request submitted successfully. We will review it shortly.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Currency & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">
              {isRtl ? 'العملة' : 'Currency'}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            >
              {availableBalances.map(b => (
                <option key={b.currency} value={b.currency}>
                  {b.currency} (Max: {b.available.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">
              {isRtl ? 'المبلغ' : 'Amount'}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Payout Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            {isRtl ? 'طريقة السحب' : 'Payout Method'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYOUT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`px-4 py-3 border rounded-xl text-sm transition-all duration-200 text-left ${
                  method === m.id
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {isRtl ? m.labelAr : m.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">
            {isRtl ? 'بيانات الحساب (الإيميل، الآيبان، رقم الهاتف...)' : 'Account Details (Email, IBAN, Phone...)'}
          </label>
          <textarea
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            rows={2}
            placeholder={isRtl ? 'أدخل تفاصيل حسابك لاستلام الأرباح' : 'Enter your account details to receive the payout'}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading 
            ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') 
            : (isRtl ? 'تقديم طلب السحب' : 'Submit Payout Request')}
        </button>
      </form>
    </div>
  );
}
