import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, UploadCloud, CheckCircle, Loader2, CreditCard, ShieldCheck, Lock } from 'lucide-react';
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
  clientId?: string | null;
}

interface CheckoutModalProps {
  plan: Plan | null;
  currency: 'USD' | 'EGP';
  onClose: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CheckoutModal({ plan, currency, onClose }: CheckoutModalProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // State
  const [activeTab, setActiveTab]             = useState<'card' | 'wallet' | 'manual'>('card');
  const [gateways, setGateways]               = useState<GatewayOption[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<GatewayOption | null>(null);
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethod[]>([]);
  const [file, setFile]                       = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [isLoadingGateways, setIsLoadingGateways] = useState(false);
  const [error, setError]                     = useState('');
  
  // PayPal Card Fields State
  const [isSdkLoaded, setIsSdkLoaded]         = useState(false);
  const [isCardFieldsReady, setIsCardFieldsReady] = useState(false);
  const [cardholderName, setCardholderName]   = useState('');
  const cardFieldsInstanceRef = useRef<any>(null);

  // ─── Fetch dynamic gateways for this plan+currency ───────────────────────
  const fetchGateways = useCallback(async () => {
    if (!plan) return;
    setIsLoadingGateways(true);
    try {
      const res = await api.get<GatewayOption[]>(`/api/checkout/gateways/${plan.id}`);
      const filtered = res.data.filter(
        (g) => g.currency === currency.toUpperCase()
      );
      setGateways(filtered);
      const def = filtered.find((g) => g.isDefault) ?? filtered[0] ?? null;
      setSelectedGateway(def);
    } catch {
      setGateways([]);
    } finally {
      setIsLoadingGateways(false);
    }
  }, [plan, currency]);

  useEffect(() => { fetchGateways(); }, [fetchGateways]);

  // ─── Fetch manual payment methods ────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'manual' && paymentMethods.length === 0) {
      api.get<PaymentMethod[]>('/api/ManualPayments/methods')
        .then((res) => setPaymentMethods(res.data))
        .catch(() => {});
    }
  }, [activeTab, paymentMethods.length]);

  // ─── Fetch Public Settings & Social Links ────────────────────────────────
  const [paymentStatuses, setPaymentStatuses] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.get('/api/settings/public')
      .then((res) => setPaymentStatuses(res.data.paymentStatuses))
      .catch(() => {});

    api.get('/api/platform/social-links')
      .then(res => setSocialLinks(res.data))
      .catch(() => {});
  }, []);

  // ─── Load PayPal SDK for USD Card Fields ─────────────────────────────────
  useEffect(() => {
    if (currency !== 'USD' || !selectedGateway || selectedGateway.providerName !== 'PayPal') {
      return;
    }

    const clientId = selectedGateway.clientId || 'ARjmGWCzZOQte5ev7zNvng8eTjtoHSdkWelVbPmI_fHqu3dXua5gtiM-udVH1AD0RP_5FhSUCfV-I7sO';
    const scriptId = 'paypal-sdk-script';

    const initCardFields = () => {
      if (!window.paypal || !window.paypal.CardFields) {
        setIsCardFieldsReady(false);
        return;
      }

      try {
        const cardFields = window.paypal.CardFields({
          createOrder: async () => {
            setError('');
            const res = await api.post('/api/checkout/create-paypal-order', {
              planId: plan?.id,
              gatewayConfigId: selectedGateway.gatewayConfigId,
              currency: 'USD',
              method: 'card'
            });
            if (!res.data?.orderId) {
              throw new Error(res.data?.error || 'Failed to create PayPal order');
            }
            return res.data.orderId;
          },
          onApprove: async (data: any) => {
            try {
              const res = await api.post('/api/checkout/capture-paypal-order', {
                orderId: data.orderID
              });
              if (res.data?.success) {
                window.location.href = `/${locale}/payment/success?planId=${plan?.id}&provider=PayPal`;
              } else {
                throw new Error(res.data?.error || 'Payment capture failed');
              }
            } catch (captureErr: any) {
              setError(captureErr?.response?.data?.error || captureErr?.message || (isRtl ? 'فشل تأكيد الدفع' : 'Payment capture failed'));
              setIsSubmitting(false);
            }
          },
          onError: (err: any) => {
            console.error('[PayPal CardFields Error]:', err);
            setError(err?.message || (isRtl ? 'حدث خطأ في معالجة البطاقة، يرجى مراجعة البيانات.' : 'Card processing error. Please verify card details.'));
            setIsSubmitting(false);
          },
          style: {
            'input': {
              'font-size': '15px',
              'font-family': 'inherit',
              'color': '#ffffff',
              'padding': '12px',
              'background': '#111111',
              'border-radius': '10px'
            },
            'input.invalid': {
              'color': '#f87171'
            }
          }
        });

        cardFieldsInstanceRef.current = cardFields;

        if (cardFields.isEligible()) {
          // Render hosted field containers
          setTimeout(() => {
            try {
              const numContainer = document.getElementById('paypal-card-number');
              const expContainer = document.getElementById('paypal-card-expiry');
              const cvvContainer = document.getElementById('paypal-card-cvv');

              if (numContainer && expContainer && cvvContainer) {
                numContainer.innerHTML = '';
                expContainer.innerHTML = '';
                cvvContainer.innerHTML = '';

                cardFields.NumberField({ placeholder: '•••• •••• •••• ••••' }).render('#paypal-card-number');
                cardFields.ExpiryField({ placeholder: 'MM / YY' }).render('#paypal-card-expiry');
                cardFields.CVVField({ placeholder: 'CVV' }).render('#paypal-card-cvv');
                setIsCardFieldsReady(true);
              }
            } catch (renderErr) {
              console.warn('[PayPal CardFields Render notice]:', renderErr);
            }
          }, 300);
        } else {
          setIsCardFieldsReady(false);
        }

        // Render PayPal buttons as alternative
        setTimeout(() => {
          const btnContainer = document.getElementById('paypal-button-container');
          if (btnContainer && window.paypal.Buttons) {
            btnContainer.innerHTML = '';
            window.paypal.Buttons({
              style: {
                layout: 'horizontal',
                color: 'gold',
                shape: 'pill',
                label: 'paypal',
                height: 44
              },
              createOrder: async () => {
                setError('');
                const res = await api.post('/api/checkout/create-paypal-order', {
                  planId: plan?.id,
                  gatewayConfigId: selectedGateway.gatewayConfigId,
                  currency: 'USD',
                  method: 'card'
                });
                return res.data.orderId;
              },
              onApprove: async (data: any) => {
                const res = await api.post('/api/checkout/capture-paypal-order', {
                  orderId: data.orderID
                });
                if (res.data?.success) {
                  window.location.href = `/${locale}/payment/success?planId=${plan?.id}&provider=PayPal`;
                }
              },
              onError: (err: any) => {
                setError(err?.message || 'PayPal error');
              }
            }).render('#paypal-button-container');
          }
        }, 300);

      } catch (err) {
        console.error('[PayPal Init Error]:', err);
        setIsCardFieldsReady(false);
      }
    };

    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=card-fields,buttons&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => {
        setIsSdkLoaded(true);
        initCardFields();
      };
      document.body.appendChild(script);
    } else {
      setIsSdkLoaded(true);
      initCardFields();
    }
  }, [currency, selectedGateway, plan, locale, isRtl]);

  if (!plan) return null;

  const price = currency === 'USD' ? plan.priceUsd : plan.priceEgp;
  const currencySymbol = currency === 'USD' ? '$' : 'EGP ';

  // ─── Direct Card Submission via PayPal Hosted Fields ───────────────────────
  const handleHostedCardSubmit = async () => {
    if (!cardFieldsInstanceRef.current) {
      handleStandardRedirectCheckout();
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await cardFieldsInstanceRef.current.submit({
        cardholderName: cardholderName.trim() || 'Cardholder'
      });
    } catch (err: any) {
      setError(err?.message || (isRtl ? 'حدث خطأ في معالجة البطاقة' : 'Card payment failed'));
      setIsSubmitting(false);
    }
  };

  // ─── Standard Gateway Fallback / Paymob Checkout ──────────────────────────
  const handleStandardRedirectCheckout = async () => {
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
        currency,
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
      window.location.href = `/${locale}/payment/success?method=manual`;
    } catch (err: any) {
      setError(err.response?.data?.message || (isRtl ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTabStatus = (tab: 'card' | 'wallet' | 'manual') => {
    if (!paymentStatuses) return 'active';
    
    if (tab === 'manual') {
      const status = paymentStatuses['manual'];
      if (status?.suspended) return 'suspended';
      if (status?.maintenance) return 'maintenance';
      if (status?.comingSoon) return 'coming_soon';
    } else if (tab === 'wallet') {
      const status = paymentStatuses['paymob'];
      if (status?.suspended) return 'suspended';
      if (status?.maintenance) return 'maintenance';
      if (status?.comingSoon) return 'coming_soon';
    } else if (tab === 'card') {
      const paymob = paymentStatuses['paymob'];
      const paypal = paymentStatuses['paypal'];
      
      const isPaymobActive = !paymob?.suspended && !paymob?.maintenance && !paymob?.comingSoon;
      const isPaypalActive = !paypal?.suspended && !paypal?.maintenance && !paypal?.comingSoon;
      
      if (isPaymobActive || isPaypalActive) return 'active';
      if (paymob?.maintenance || paypal?.maintenance) return 'maintenance';
      if (paymob?.comingSoon || paypal?.comingSoon) return 'coming_soon';
      if (paymob?.suspended && paypal?.suspended) return 'suspended';
    }
    return 'active';
  };

  const getGatewayStatus = (gatewayName: string) => {
    if (!paymentStatuses) return 'active';
    const status = paymentStatuses[gatewayName.toLowerCase()];
    if (status?.suspended) return 'suspended';
    if (status?.maintenance) return 'maintenance';
    if (status?.comingSoon) return 'coming_soon';
    return 'active';
  };

  const renderBadge = (status: string) => {
    if (status === 'maintenance') {
      return <span className="block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap mx-auto w-fit">{isRtl ? 'صيانة' : 'Maint.'}</span>;
    }
    if (status === 'coming_soon') {
      return <span className="block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 whitespace-nowrap mx-auto w-fit">{isRtl ? 'قريباً' : 'Soon'}</span>;
    }
    if (status === 'suspended') {
      return <span className="block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap mx-auto w-fit">{isRtl ? 'موقوف' : 'Suspended'}</span>;
    }
    return null;
  };

  const renderFallbackMessage = (status: string) => {
    let mainMsg = '';
    if (status === 'maintenance') mainMsg = isRtl ? 'بوابة الدفع هذه تحت الصيانة حالياً.' : 'This payment gateway is currently under maintenance.';
    else if (status === 'coming_soon') mainMsg = isRtl ? 'بوابة الدفع هذه ستتوفر قريباً.' : 'This payment gateway is coming soon.';
    else if (status === 'suspended') mainMsg = isRtl ? 'بوابة الدفع هذه موقوفة حالياً.' : 'This payment gateway is currently suspended.';
    
    if (!mainMsg) return null;

    const fbLink = socialLinks['facebook'] || socialLinks['Facebook'];
    const whatsappLink = socialLinks['whatsapp'] || socialLinks['WhatsApp'];
    const supportLink = `/${locale}/profile/tickets`;

    return (
      <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 text-center">
        <p className="text-orange-400 font-medium mb-3">{mainMsg}</p>
        <p className="text-sm text-gray-300 mb-4">
          {isRtl 
            ? 'لكن لا تقلق، يمكنك تفعيل اشتراكك الآن بكل سهولة من خلال التواصل معنا أو فتح تذكرة دعم فني وسنقوم بتفعيله لك فوراً.' 
            : 'But do not worry! You can easily activate your subscription by contacting us or opening a support ticket.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {fbLink && (
            <a href={fbLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
              {isRtl ? 'تواصل عبر فيسبوك' : 'Contact via Facebook'}
            </a>
          )}
          {whatsappLink && (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
              {isRtl ? 'واتساب' : 'WhatsApp'}
            </a>
          )}
          <a href={supportLink} className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
            {isRtl ? 'فتح تذكرة دعم فني' : 'Open Support Ticket'}
          </a>
        </div>
      </div>
    );
  };

  const isUsdCardDirect = currency === 'USD' && selectedGateway?.providerName === 'PayPal';

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 transition">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? 'إتمام الدفع' : 'Checkout'}
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <Lock className="w-3 h-3" />
              {isRtl ? 'دفع آمن ومشفّر' : '256-Bit Encrypted'}
            </span>
          </div>

          <p className="text-gray-400 mb-6 text-sm">
            {isRtl ? 'أنت على وشك الاشتراك في ' : 'Subscribing to '}
            <span className="text-white font-semibold">{isRtl ? plan.nameAr : plan.name}</span>
            <span className="mx-2 text-emerald-400 font-bold text-lg">{currencySymbol}{price}</span>
          </p>

          {/* ── Tab Switcher ── */}
          <div className="flex gap-2.5 mb-6">
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 py-2.5 rounded-xl border font-semibold transition-all text-xs md:text-sm flex flex-col items-center justify-center gap-1 ${
                activeTab === 'card'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm shadow-blue-500/20'
                  : 'border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>{isRtl ? 'بطاقة بنكية (فيزا/ماستر)' : 'Credit/Debit Card'}</span>
              </div>
              {renderBadge(getTabStatus('card'))}
            </button>

            {currency === 'EGP' && (
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex-1 py-2.5 rounded-xl border font-semibold transition-all text-xs md:text-sm flex flex-col items-center justify-center gap-1 ${
                  activeTab === 'wallet'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/20'
                    : 'border-white/10 text-gray-400 hover:bg-white/5'
                }`}
              >
                <span>{isRtl ? 'المحافظ الإلكترونية' : 'Mobile Wallets'}</span>
                {renderBadge(getTabStatus('wallet'))}
              </button>
            )}

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2.5 rounded-xl border font-semibold transition-all text-xs md:text-sm flex flex-col items-center justify-center gap-1 ${
                activeTab === 'manual'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-sm shadow-purple-500/20'
                  : 'border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              <span>{isRtl ? 'تحويل يدوي' : 'Manual Transfer'}</span>
              {renderBadge(getTabStatus('manual'))}
            </button>
          </div>

          {/* ── Card / Gateway Tab ── */}
          {(activeTab === 'card' || activeTab === 'wallet') && (
            <div className="space-y-4">
              {isLoadingGateways ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
                  <span className="text-xs text-gray-400">{isRtl ? 'جاري تجهيز بوابة الدفع...' : 'Initializing secure gateway...'}</span>
                </div>
              ) : gateways.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center text-gray-400 text-sm">
                  {isRtl
                    ? 'لا توجد بوابات دفع متاحة لهذه الباقة بالعملة المختارة حالياً.'
                    : 'No payment gateways available for this plan in the selected currency.'}
                </div>
              ) : isUsdCardDirect ? (
                /* ─── DIRECT ON-SITE CARD FIELDS (USD) ─── */
                <div className="space-y-3.5">
                  <div className="bg-[#111113] border border-white/10 rounded-2xl p-4.5 space-y-3.5 shadow-inner">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                        {isRtl ? 'بيانات البطاقة البنكية' : 'Card Details'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {isRtl ? 'المبلغ:' : 'Amount:'} <strong className="text-emerald-400">{currencySymbol}{price}</strong>
                      </span>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        {isRtl ? 'الاسم على البطاقة' : 'Cardholder Name'}
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder={isRtl ? 'مثال: أحمد محمد' : 'e.g. John Doe'}
                        className="w-full bg-[#1c1c1f] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-600 transition"
                      />
                    </div>

                    {/* Card Number Hosted Field */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        {isRtl ? 'رقم البطاقة' : 'Card Number'}
                      </label>
                      <div
                        id="paypal-card-number"
                        className="w-full h-11 bg-[#1c1c1f] border border-white/10 rounded-xl px-2 flex items-center focus-within:border-blue-500 transition"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-400 mb-1">
                          {isRtl ? 'تاريخ الانتهاء' : 'Expiration Date'}
                        </label>
                        <div
                          id="paypal-card-expiry"
                          className="w-full h-11 bg-[#1c1c1f] border border-white/10 rounded-xl px-2 flex items-center focus-within:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-400 mb-1">
                          {isRtl ? 'رمز الأمان (CVV)' : 'Security Code (CVV)'}
                        </label>
                        <div
                          id="paypal-card-cvv"
                          className="w-full h-11 bg-[#1c1c1f] border border-white/10 rounded-xl px-2 flex items-center focus-within:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{error}</p>}

                  {/* Pay Direct Card Button */}
                  <button
                    onClick={handleHostedCardSubmit}
                    disabled={isSubmitting || !isCardFieldsReady}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isRtl ? 'جاري معالجة الدفع...' : 'Processing Payment...'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>{isRtl ? `ادفع الآن (${currencySymbol}${price})` : `Pay Now (${currencySymbol}${price})`}</span>
                      </>
                    )}
                  </button>

                  {/* Alternative PayPal Wallet Button */}
                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-gray-500 mb-2">
                      {isRtl ? '— أو ادفع باستخدام حساب بايبال —' : '— Or pay using PayPal account —'}
                    </p>
                    <div id="paypal-button-container" className="max-w-xs mx-auto" />
                  </div>
                </div>
              ) : (
                /* ─── STANDARD CHECKOUT (EGP / Paymob) ─── */
                <>
                  {gateways.length > 1 && (
                    <div className="grid gap-2">
                      {gateways.map((g) => {
                        const status = getGatewayStatus(g.providerName);
                        return (
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
                            {status !== 'active' && (
                              <span className="ml-2 inline-block">
                                {renderBadge(status)}
                              </span>
                            )}
                            {g.isDefault && (
                              <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                {isRtl ? 'مقترح' : 'Recommended'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {isRtl ? 'البوابة المختارة' : 'Selected Gateway'}
                      </span>
                      <span className="text-white font-semibold flex items-center gap-2">
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
                  {selectedGateway && getGatewayStatus(selectedGateway.providerName) !== 'active' && (
                    renderFallbackMessage(getGatewayStatus(selectedGateway.providerName))
                  )}

                  <button
                    onClick={handleStandardRedirectCheckout}
                    disabled={isSubmitting || !selectedGateway || getGatewayStatus(selectedGateway.providerName) !== 'active'}
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
              {getTabStatus('manual') !== 'active' && (
                renderFallbackMessage(getTabStatus('manual'))
              )}

              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting || !file || getTabStatus('manual') !== 'active'}
                className="w-full bg-purple-500 text-white font-semibold py-4 rounded-xl hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? '...' : (isRtl ? 'تأكيد وإرسال' : 'Confirm & Submit')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
