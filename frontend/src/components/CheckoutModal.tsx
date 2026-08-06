import React, { useState, useEffect, useCallback } from 'react';
import { X, UploadCloud, CheckCircle, Loader2 } from 'lucide-react';
import { Plan } from '@/store/usePlansStore';
import { useLocale } from 'next-intl';
import api from '@/utils/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PaymentMethod {
  id: number;
  name: string;
  accountDetails: string;
  instructions: string | null;
}

/** Gateway option returned by GET /api/checkout/gateways/{planId} */
interface GatewayOption {
  gatewayConfigId: number;
  providerName: string;    // "Paymob" | "PayPal"
  displayName: string;     // Label shown to user
  currency: string;        // "EGP" | "USD"
  isDefault: boolean;
  sortOrder: number;
}

interface CheckoutModalProps {
  plan: Plan | null;
  currency: 'USD' | 'EGP';
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CheckoutModal({ plan, currency, onClose }: CheckoutModalProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // State
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'EGP'>(currency);
  const [activeTab, setActiveTab]             = useState<'card' | 'wallet' | 'manual'>('card');
  const [gateways, setGateways]               = useState<GatewayOption[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<GatewayOption | null>(null);
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethod[]>([]);
  const [file, setFile]                       = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [isLoadingGateways, setIsLoadingGateways] = useState(false);
  const [success, setSuccess]                 = useState(false);
  const [error, setError]                     = useState('');

  // ─── Fetch dynamic gateways for this plan+currency ───────────────────────
  const fetchGateways = useCallback(async () => {
    if (!plan) return;
    setIsLoadingGateways(true);
    try {
      const res = await api.get<GatewayOption[]>(`/api/checkout/gateways/${plan.id}`);
      // Filter by selected currency
      const filtered = res.data.filter(
        (g) => g.currency === paymentCurrency.toUpperCase()
      );
      setGateways(filtered);
      // Auto-select the default gateway
      const def = filtered.find((g) => g.isDefault) ?? filtered[0] ?? null;
      setSelectedGateway(def);
    } catch {
      setGateways([]);
    } finally {
      setIsLoadingGateways(false);
    }
  }, [plan, paymentCurrency]);

  useEffect(() => { fetchGateways(); }, [fetchGateways]);

  // ─── Fetch manual payment methods ────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'manual' && paymentMethods.length === 0) {
      api.get<PaymentMethod[]>('/api/ManualPayments/methods')
        .then((res) => setPaymentMethods(res.data))
        .catch(() => {});
    }
  }, [activeTab, paymentMethods.length]);

  if (!plan) return null;

  const price = paymentCurrency === 'USD' ? plan.priceUsd : plan.priceEgp;
  const currencySymbol = paymentCurrency === 'USD' ? '$' : 'EGP ';

  // ─── Gateway Checkout ─────────────────────────────────────────────────────
  const handleGatewayCheckout = async () => {
    if (!selectedGateway) {
      setError(isRtl ? 'الرجاء اختيار طريقة دفع' : 'Please select a payment gateway');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const res = await api.post('/api/checkout/pay', {
        planId:          plan.id,
        gatewayConfigId: selectedGateway.gatewayConfigId,
        currency:        paymentCurrency,
        method:          activeTab === 'wallet' ? 'wallet' : 'card'
      });
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? 'حدث خطأ أثناء المعالجة' : 'An error occurred'));
      setIsSubmitting(false);
    }
  };

  // ─── Manual Checkout ──────────────────────────────────────────────────────
  const handleManualSubmit = async () => {
    if (!file) {
      setError(isRtl ? 'الرجاء إرفاق إيصال التحويل' : 'Please upload a receipt');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('PlanId', plan.id.toString());
      formData.append('ReceiptImage', file);
      await api.post('/api/ManualPayments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || (isRtl ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-white mb-1">
            {isRtl ? 'إتمام الدفع' : 'Checkout'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isRtl ? 'أنت على وشك الاشتراك في ' : 'Subscribing to '}
            <span className="text-white font-semibold">{isRtl ? plan.nameAr : plan.name}</span>
            <span className="ml-2 text-emerald-400 font-bold">{currencySymbol}{price}</span>
          </p>

          {!success && (
            <div className="flex gap-2 mb-6 p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => {
                  setPaymentCurrency('EGP');
                  if (activeTab === 'wallet' && paymentCurrency !== 'EGP') {
                    // Reset to card if switching to USD which doesn't have wallet, though this is EGP
                  }
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  paymentCurrency === 'EGP'
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isRtl ? 'جنيه مصري (EGP)' : 'Egyptian Pound (EGP)'}
              </button>
              <button
                onClick={() => {
                  setPaymentCurrency('USD');
                  if (activeTab === 'wallet') setActiveTab('card');
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  paymentCurrency === 'USD'
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isRtl ? 'دولار أمريكي (USD)' : 'US Dollar (USD)'}
              </button>
            </div>
          )}

          {success ? (
            /* ── Success State ── */
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {isRtl ? 'تم إرسال الطلب بنجاح' : 'Request Submitted Successfully'}
              </h3>
              <p className="text-gray-400 mb-6">
                {isRtl
                  ? 'سوف يقوم الإدارة بمراجعة الإيصال وتفعيل الباقة قريباً.'
                  : 'Admin will review your receipt and activate your plan shortly.'}
              </p>
              <button
                onClick={onClose}
                className="w-full bg-white text-black font-semibold py-3 rounded-xl"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              {/* ── Tab Switcher ── */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 py-3 rounded-xl border font-semibold transition-all text-sm ${
                    activeTab === 'card'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {isRtl ? 'دفع بالبطاقة (فيزا/ماستر)' : 'Card Payment'}
                </button>
                {paymentCurrency === 'EGP' && (
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`flex-1 py-3 rounded-xl border font-semibold transition-all text-sm ${
                      activeTab === 'wallet'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {isRtl ? 'المحافظ الإلكترونية' : 'Mobile Wallets'}
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-3 rounded-xl border font-semibold transition-all text-sm ${
                    activeTab === 'manual'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                      : 'border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {isRtl ? 'تحويل يدوي' : 'Manual Transfer'}
                </button>
              </div>

              {/* ── Gateway Tabs (Card / Wallet) ── */}
              {(activeTab === 'card' || activeTab === 'wallet') && (
                <div className="space-y-4">
                  {isLoadingGateways ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : gateways.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center text-gray-400 text-sm">
                      {isRtl
                        ? 'لا توجد بوابات دفع متاحة لهذه الباقة بالعملة المختارة حالياً.'
                        : 'No payment gateways available for this plan in the selected currency.'}
                    </div>
                  ) : (
                    <>
                      {/* Gateway selector — shows only if more than one option */}
                      {gateways.length > 1 && (
                        <div className="grid gap-2">
                          {gateways.map((g) => (
                            <button
                              key={g.gatewayConfigId}
                              onClick={() => setSelectedGateway(g)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${
                                selectedGateway?.gatewayConfigId === g.gatewayConfigId
                                  ? 'border-blue-500 bg-blue-600/10 text-white'
                                  : 'border-white/10 text-gray-400 hover:bg-white/5'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                selectedGateway?.gatewayConfigId === g.gatewayConfigId
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-500'
                              }`} />
                              {g.displayName}
                              {g.isDefault && (
                                <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                  {isRtl ? 'مقترح' : 'Recommended'}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Summary */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">
                            {isRtl ? 'البوابة المختارة' : 'Selected Gateway'}
                          </span>
                          <span className="text-white font-semibold">
                            {selectedGateway?.displayName ?? '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-400 text-sm">
                            {isRtl ? 'المبلغ المطلوب' : 'Total Amount'}
                          </span>
                          <span className="text-2xl font-bold text-white">
                            {currencySymbol}{price}
                          </span>
                        </div>
                      </div>

                      {error && <p className="text-red-400 text-sm">{error}</p>}

                      <button
                        onClick={handleGatewayCheckout}
                        disabled={isSubmitting || !selectedGateway}
                        className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting
                          ? (isRtl ? 'جاري التحويل...' : 'Redirecting...')
                          : (isRtl ? 'ادفع الآن' : 'Pay Now')}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ── Manual Tab ── */}
              {activeTab === 'manual' && (
                <div className="space-y-5">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300">
                    <p className="mb-2 font-semibold text-white">
                      {isRtl ? 'تفاصيل التحويل:' : 'Transfer Details:'}
                    </p>
                    {paymentMethods.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2">
                        {paymentMethods.map((pm) => (
                          <li key={pm.id}>
                            <span className="font-semibold text-white">{pm.name}:</span>{' '}
                            {pm.accountDetails}
                            {pm.instructions && (
                              <p className="text-xs text-gray-400 mt-1 mr-4 ml-4">
                                {pm.instructions}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isRtl ? 'جاري تحميل طرق الدفع...' : 'Loading payment methods...'}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-gray-400">{isRtl ? 'المبلغ المطلوب إرساله' : 'Amount to send'}</span>
                      <span className="text-xl font-bold text-white">{currencySymbol}{price}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {isRtl ? 'إرفاق إيصال التحويل (صورة)' : 'Upload Transfer Receipt (Image)'}
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400">
                          {file
                            ? <span className="text-emerald-400 font-semibold">{file.name}</span>
                            : (isRtl ? 'اضغط لرفع الصورة' : 'Click to upload image')}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                      />
                    </label>
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    onClick={handleManualSubmit}
                    disabled={isSubmitting || !file}
                    className="w-full bg-purple-500 text-white font-semibold py-4 rounded-xl hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? '...' : (isRtl ? 'تأكيد وإرسال' : 'Confirm & Submit')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
