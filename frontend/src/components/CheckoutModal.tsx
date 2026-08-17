'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, UploadCloud, Loader2, CreditCard, ShieldCheck, Lock } from 'lucide-react';
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

interface GatewayOption {
  gatewayConfigId: number;
  providerName: string;
  displayName: string;
  currency: string;
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
  interface Window { paypal?: any; }
}

// ─── Animated Card Preview ────────────────────────────────────────────────────

function CardPreview({ name, number, expiry, isFlipped }: {
  name: string;
  number: string;
  expiry: string;
  isFlipped: boolean;
}) {
  const formatted = number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() || '•••• •••• •••• ••••';
  const displayExp = expiry || 'MM/YY';

  const cardType = (() => {
    const n = number.replace(/\s/g, '');
    if (n.startsWith('4')) return 'visa';
    if (n.startsWith('5') || n.startsWith('2')) return 'mastercard';
    if (n.startsWith('34') || n.startsWith('37')) return 'amex';
    return 'generic';
  })();

  return (
    <div className="relative w-full h-44 mb-6" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
            boxShadow: '0 20px 60px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.08)'
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl opacity-30" style={{
            background: 'radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 70%)'
          }} />
          {/* Circles decoration */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: 'rgba(139,92,246,0.5)' }} />
          <div className="absolute -right-4 top-12 w-28 h-28 rounded-full opacity-10" style={{ background: 'rgba(99,102,241,0.5)' }} />

          <div className="relative flex justify-between items-start">
            {/* Chip */}
            <div className="w-10 h-7 rounded-md" style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)'
            }} />
            {/* Card Type Logo */}
            <div className="text-right">
              {cardType === 'visa' && (
                <span className="text-white font-extrabold text-xl italic tracking-wider" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>VISA</span>
              )}
              {cardType === 'mastercard' && (
                <div className="flex items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                  <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 -ml-3.5" />
                </div>
              )}
              {cardType === 'generic' && (
                <CreditCard className="w-7 h-7 text-white/50" />
              )}
            </div>
          </div>

          <div className="relative space-y-3">
            <div className="text-white/90 text-lg font-mono tracking-widest font-semibold">
              {formatted}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</div>
                <div className="text-white text-sm font-medium uppercase tracking-wide truncate max-w-[150px]">
                  {name || 'YOUR NAME'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</div>
                <div className="text-white text-sm font-mono">{displayExp}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
            boxShadow: '0 20px 60px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.08)'
          }}
        >
          {/* Magnetic strip */}
          <div className="w-full h-10 bg-black/70 absolute top-8" />
          <div className="absolute bottom-8 left-0 right-0 px-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/90 h-10 rounded-lg" />
              <div className="text-white/80 text-right">
                <div className="text-[10px] text-white/40 mb-0.5">CVV</div>
                <div className="text-sm font-mono text-white">•••</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutModal({ plan, currency, onClose }: CheckoutModalProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [activeTab, setActiveTab]             = useState<'card' | 'wallet' | 'manual'>('card');
  const [gateways, setGateways]               = useState<GatewayOption[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<GatewayOption | null>(null);
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethod[]>([]);
  const [file, setFile]                       = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [isLoadingGateways, setIsLoadingGateways] = useState(false);
  const [error, setError]                     = useState('');

  // Card preview state
  const [cardholderName, setCardholderName]   = useState('');
  const [cardNumber]                          = useState('');
  const [cardExpiry]                          = useState('');
  const [focusedField, setFocusedField]       = useState<string | null>(null);

  // PayPal SDK
  const [isCardFieldsReady, setIsCardFieldsReady] = useState(false);
  const cardFieldsInstanceRef = useRef<any>(null);

  // ─── Gateways ──────────────────────────────────────────────────────────────
  const fetchGateways = useCallback(async () => {
    if (!plan) return;
    setIsLoadingGateways(true);
    try {
      const res = await api.get<GatewayOption[]>(`/api/checkout/gateways/${plan.id}`);
      const filtered = res.data.filter((g) => g.currency === currency.toUpperCase());
      setGateways(filtered);
      setSelectedGateway(filtered.find((g) => g.isDefault) ?? filtered[0] ?? null);
    } catch { setGateways([]); }
    finally { setIsLoadingGateways(false); }
  }, [plan, currency]);

  useEffect(() => { fetchGateways(); }, [fetchGateways]);

  // ─── Manual methods ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'manual' && paymentMethods.length === 0) {
      api.get<PaymentMethod[]>('/api/ManualPayments/methods')
        .then((res) => setPaymentMethods(res.data))
        .catch(() => {});
    }
  }, [activeTab, paymentMethods.length]);

  // ─── Public settings ───────────────────────────────────────────────────────
  const [paymentStatuses, setPaymentStatuses] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.get('/api/settings/public').then((res) => setPaymentStatuses(res.data.paymentStatuses)).catch(() => {});
    api.get('/api/platform/social-links').then(res => setSocialLinks(res.data)).catch(() => {});
  }, []);

  // ─── PayPal SDK loader ─────────────────────────────────────────────────────
  useEffect(() => {
    if (currency !== 'USD' || !selectedGateway || selectedGateway.providerName !== 'PayPal') return;

    const clientId = selectedGateway.clientId || 'ARjmGWCzZOQte5ev7zNvng8eTjtoHSdkWelVbPmI_fHqu3dXua5gtiM-udVH1AD0RP_5FhSUCfV-I7sO';
    const scriptId = 'paypal-sdk-script';

    const initCardFields = () => {
      if (!window.paypal?.CardFields) { setIsCardFieldsReady(false); return; }
      try {
        const cardFields = window.paypal.CardFields({
          createOrder: async () => {
            setError('');
            const res = await api.post('/api/checkout/create-paypal-order', {
              planId: plan?.id, gatewayConfigId: selectedGateway.gatewayConfigId, currency: 'USD', method: 'card'
            });
            if (!res.data?.orderId) throw new Error(res.data?.error || 'Failed to create PayPal order');
            return res.data.orderId;
          },
          onApprove: async (data: any) => {
            try {
              const res = await api.post('/api/checkout/capture-paypal-order', { orderId: data.orderID });
              if (res.data?.success) {
                window.location.href = `/${locale}/payment/success?planId=${plan?.id}&provider=PayPal`;
              } else throw new Error(res.data?.error || 'Payment capture failed');
            } catch (err: any) {
              setError(err?.response?.data?.error || err?.message || (isRtl ? 'فشل تأكيد الدفع' : 'Payment capture failed'));
              setIsSubmitting(false);
            }
          },
          onError: (err: any) => {
            setError(err?.message || (isRtl ? 'خطأ في معالجة البطاقة' : 'Card processing error'));
            setIsSubmitting(false);
          },
          style: {
            'input': { 'font-size': '15px', 'font-family': 'inherit', 'color': '#e2e8f0', 'padding': '0px', 'background': 'transparent' },
            'input::placeholder': { 'color': '#4b5563' },
            'input.invalid': { 'color': '#f87171' }
          }
        });

        cardFieldsInstanceRef.current = cardFields;

        if (cardFields.isEligible()) {
          setTimeout(() => {
            try {
              const numEl  = document.getElementById('paypal-card-number');
              const expEl  = document.getElementById('paypal-card-expiry');
              const cvvEl  = document.getElementById('paypal-card-cvv');
              if (numEl && expEl && cvvEl) {
                numEl.innerHTML = ''; expEl.innerHTML = ''; cvvEl.innerHTML = '';
                cardFields.NumberField({ placeholder: '1234  5678  9012  3456' }).render('#paypal-card-number');
                cardFields.ExpiryField({ placeholder: 'MM / YY' }).render('#paypal-card-expiry');
                cardFields.CVVField({ placeholder: '•••' }).render('#paypal-card-cvv');
                setIsCardFieldsReady(true);
              }
            } catch (e) { console.warn('[CardFields Render]:', e); }
          }, 400);
        } else { setIsCardFieldsReady(false); }

      } catch (e) { console.error('[PayPal Init]:', e); setIsCardFieldsReady(false); }
    };

    const existing = document.getElementById(scriptId);
    if (!existing) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=card-fields&currency=USD&intent=capture`;
      s.async = true;
      s.onload = () => initCardFields();
      document.body.appendChild(s);
    } else { initCardFields(); }
  }, [currency, selectedGateway, plan, locale, isRtl]);

  if (!plan) return null;

  const price = currency === 'USD' ? plan.priceUsd : plan.priceEgp;
  const currencySymbol = currency === 'USD' ? '$' : 'EGP ';
  const isUsdPayPal = currency === 'USD' && selectedGateway?.providerName === 'PayPal';

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleHostedCardSubmit = async () => {
    if (!cardFieldsInstanceRef.current) { handleStandardRedirect(); return; }
    setIsSubmitting(true); setError('');
    try {
      await cardFieldsInstanceRef.current.submit({ cardholderName: cardholderName.trim() || 'Cardholder' });
    } catch (err: any) {
      setError(err?.message || (isRtl ? 'حدث خطأ في معالجة البطاقة' : 'Card payment failed'));
      setIsSubmitting(false);
    }
  };

  const handleStandardRedirect = async () => {
    if (!selectedGateway) return;
    setIsSubmitting(true); setError('');
    try {
      const res = await api.post('/api/checkout/pay', {
        planId: plan.id, gatewayConfigId: selectedGateway.gatewayConfigId,
        currency, method: activeTab === 'wallet' ? 'wallet' : 'card'
      });
      if (res.data?.checkoutUrl) window.location.href = res.data.checkoutUrl;
      else throw new Error('No checkout URL returned');
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? 'حدث خطأ' : 'An error occurred'));
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!file) { setError(isRtl ? 'الرجاء إرفاق إيصال التحويل' : 'Please upload a receipt'); return; }
    setIsSubmitting(true); setError('');
    try {
      const fd = new FormData();
      fd.append('PlanId', plan.id.toString());
      fd.append('ReceiptImage', file);
      await api.post('/api/ManualPayments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      window.location.href = `/${locale}/payment/success?method=manual`;
    } catch (err: any) {
      setError(err.response?.data?.message || (isRtl ? 'حدث خطأ' : 'An error occurred'));
    } finally { setIsSubmitting(false); }
  };

  const getGatewayStatus = (name: string) => {
    if (!paymentStatuses) return 'active';
    const s = paymentStatuses[name.toLowerCase()];
    if (s?.suspended) return 'suspended';
    if (s?.maintenance) return 'maintenance';
    if (s?.comingSoon) return 'coming_soon';
    return 'active';
  };

  const getTabStatus = (tab: 'card' | 'wallet' | 'manual') => {
    if (!paymentStatuses) return 'active';
    if (tab === 'manual') return getGatewayStatus('manual');
    if (tab === 'wallet') return getGatewayStatus('paymob');
    if (tab === 'card') {
      const pp = getGatewayStatus('paypal');
      const pm = getGatewayStatus('paymob');
      if (pp === 'active' || pm === 'active') return 'active';
      if (pp === 'maintenance' || pm === 'maintenance') return 'maintenance';
      return 'suspended';
    }
    return 'active';
  };

  const renderBadge = (status: string) => {
    if (status === 'maintenance') return <span className="block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 w-fit mx-auto">{isRtl ? 'صيانة' : 'Maint.'}</span>;
    if (status === 'coming_soon')  return <span className="block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 w-fit mx-auto">{isRtl ? 'قريباً' : 'Soon'}</span>;
    if (status === 'suspended')    return <span className="block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 w-fit mx-auto">{isRtl ? 'موقوف' : 'Off'}</span>;
    return null;
  };

  const renderFallback = (status: string) => {
    const msgs: Record<string, string> = {
      maintenance: isRtl ? 'بوابة الدفع تحت الصيانة حالياً.' : 'Payment gateway under maintenance.',
      coming_soon: isRtl ? 'ستتوفر قريباً.' : 'Coming soon.',
      suspended: isRtl ? 'بوابة الدفع موقوفة.' : 'Payment gateway suspended.',
    };
    if (!msgs[status]) return null;
    const supportLink = `/${locale}/profile/tickets`;
    return (
      <div className="bg-orange-500/8 p-4 rounded-2xl border border-orange-500/20 text-center">
        <p className="text-orange-400 font-medium mb-3 text-sm">{msgs[status]}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {socialLinks['facebook'] && <a href={socialLinks['facebook']} target="_blank" rel="noreferrer" className="text-xs font-semibold bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition">{isRtl ? 'فيسبوك' : 'Facebook'}</a>}
          {socialLinks['whatsapp'] && <a href={socialLinks['whatsapp']} target="_blank" rel="noreferrer" className="text-xs font-semibold bg-green-600/80 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition">WhatsApp</a>}
          <a href={supportLink} className="text-xs font-semibold bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg transition">{isRtl ? 'تذكرة دعم' : 'Support Ticket'}</a>
        </div>
      </div>
    );
  };

  // ─── Styled Input Container ────────────────────────────────────────────────
  const FieldWrapper = ({ id, label, children, isFocused }: { id: string; label: string; children: React.ReactNode; isFocused?: boolean }) => (
    <div>
      <label htmlFor={id} className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: '#0d0d12',
          boxShadow: isFocused
            ? '0 0 0 2px #6366f1, inset 0 0 0 1px rgba(99,102,241,0.3)'
            : '0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        {children}
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Glow behind modal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      </div>

      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #13131a 0%, #0f0f14 100%)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-500 hover:text-white transition p-1.5 rounded-full hover:bg-white/5">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{isRtl ? 'إتمام الدفع' : 'Secure Checkout'}</h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" /> SSL
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              {isRtl ? 'الاشتراك في ' : 'Subscribing to '}
              <span className="text-slate-300 font-medium">{isRtl ? plan.nameAr : plan.name}</span>
              {' · '}
              <span className="text-indigo-400 font-bold">{currencySymbol}{price}</span>
            </p>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {['card', ...(currency === 'EGP' ? ['wallet'] : []), 'manual'].map((tab) => {
              const status = getTabStatus(tab as any);
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-0.5"
                  style={{
                    background: active ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                    color: active ? '#fff' : '#64748b',
                    boxShadow: active ? '0 4px 15px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  <span>
                    {tab === 'card' ? (isRtl ? '💳 بطاقة بنكية' : '💳 Card') : ''}
                    {tab === 'wallet' ? (isRtl ? '📱 محافظ' : '📱 Wallet') : ''}
                    {tab === 'manual' ? (isRtl ? '🏦 تحويل' : '🏦 Transfer') : ''}
                  </span>
                  {renderBadge(status)}
                </button>
              );
            })}
          </div>

          {/* ── CARD TAB ── */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              {isLoadingGateways ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  </div>
                  <span className="text-slate-500 text-xs">{isRtl ? 'جاري تجهيز بوابة الدفع...' : 'Initializing secure gateway...'}</span>
                </div>
              ) : gateways.length === 0 ? (
                <div className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center text-slate-500 text-sm">
                  {isRtl ? 'لا توجد بوابات دفع متاحة لهذه الباقة.' : 'No payment gateways available for this plan.'}
                </div>
              ) : isUsdPayPal ? (
                /* ── USD PayPal Hosted Card Fields ── */
                <>
                  {/* Animated card */}
                  <CardPreview
                    name={cardholderName}
                    number={cardNumber}
                    expiry={cardExpiry}
                    isFlipped={focusedField === 'cvv' || focusedField === 'cvv'}
                  />

                  {/* Card form */}
                  <div className="space-y-3">
                    {/* Cardholder Name */}
                    <FieldWrapper id="name-field" label={isRtl ? 'الاسم على البطاقة' : 'Cardholder Name'} isFocused={focusedField === 'name'}>
                      <input
                        id="name-field"
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder={isRtl ? 'مثال: Ahmed Mohamed' : 'e.g. John Doe'}
                        className="w-full px-4 py-3 text-sm text-white bg-transparent outline-none placeholder-slate-600"
                      />
                    </FieldWrapper>

                    {/* Card Number */}
                    <FieldWrapper id="paypal-card-number" label={isRtl ? 'رقم البطاقة' : 'Card Number'} isFocused={focusedField === 'number'}>
                      <div
                        id="paypal-card-number"
                        className="px-4 py-3 h-12 flex items-center"
                        onFocus={() => setFocusedField('number')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </FieldWrapper>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <FieldWrapper id="paypal-card-expiry" label={isRtl ? 'تاريخ الانتهاء' : 'Expiry Date'} isFocused={focusedField === 'expiry'}>
                        <div
                          id="paypal-card-expiry"
                          className="px-4 py-3 h-12 flex items-center"
                          onFocus={() => setFocusedField('expiry')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </FieldWrapper>
                      <FieldWrapper id="paypal-card-cvv" label="CVV / CVC" isFocused={focusedField === 'cvv'}>
                        <div
                        id="paypal-card-cvv"
                        className="px-4 py-3 h-12 flex items-center"
                        onFocus={() => setFocusedField('cvv')}
                        onBlur={() => setFocusedField(null)}
                      />
                      </FieldWrapper>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <span className="text-red-400 text-sm flex-1">{error}</span>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handleHostedCardSubmit}
                    disabled={isSubmitting || !isCardFieldsReady}
                    className="relative w-full py-4 rounded-2xl font-bold text-white text-base overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isSubmitting ? '#3730a3' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: isSubmitting ? 'none' : '0 8px 30px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Pulse ring */}
                    {!isSubmitting && isCardFieldsReady && (
                      <span className="absolute inset-0 rounded-2xl animate-ping opacity-10" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} />
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /><span>{isRtl ? 'جاري معالجة الدفع...' : 'Processing Payment...'}</span></>
                      ) : (
                        <><ShieldCheck className="w-5 h-5" /><span>{isRtl ? `ادفع الآن · ${currencySymbol}${price}` : `Pay Now · ${currencySymbol}${price}`}</span></>
                      )}
                    </span>
                  </button>

                  {/* Trust bar */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-600 text-[11px]">{isRtl ? 'مدعوم بـ' : 'Powered by'}</span>
                    <div className="flex items-center gap-2 opacity-40">
                      <span className="text-xs font-bold text-slate-400 italic">VISA</span>
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <div className="w-4 h-4 rounded-full bg-yellow-400" />
                      </div>
                      <span className="text-xs font-bold text-blue-400">PayPal</span>
                    </div>
                    <span className="text-slate-600 text-[11px]">256-bit SSL</span>
                  </div>
                </>
              ) : (
                /* ── Standard Redirect (Paymob / EGP) ── */
                <>
                  {gateways.length > 1 && (
                    <div className="grid gap-2">
                      {gateways.map((g) => (
                        <button
                          key={g.gatewayConfigId}
                          onClick={() => setSelectedGateway(g)}
                          className="flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all"
                          style={{
                            background: selectedGateway?.gatewayConfigId === g.gatewayConfigId ? 'rgba(99,102,241,0.1)' : 'transparent',
                            borderColor: selectedGateway?.gatewayConfigId === g.gatewayConfigId ? '#6366f1' : 'rgba(255,255,255,0.08)',
                            color: selectedGateway?.gatewayConfigId === g.gatewayConfigId ? '#fff' : '#64748b'
                          }}
                        >
                          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedGateway?.gatewayConfigId === g.gatewayConfigId ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`} />
                          {g.displayName}
                          {g.isDefault && <span className="ml-auto text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{isRtl ? 'مقترح' : 'Recommended'}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">{isRtl ? 'البوابة' : 'Gateway'}</span>
                      <span className="text-white font-medium">{selectedGateway?.displayName ?? '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">{isRtl ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-2xl font-bold text-white">{currencySymbol}{price}</span>
                    </div>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  {selectedGateway && getGatewayStatus(selectedGateway.providerName) !== 'active' && renderFallback(getGatewayStatus(selectedGateway.providerName))}
                  <button
                    onClick={handleStandardRedirect}
                    disabled={isSubmitting || !selectedGateway || getGatewayStatus(selectedGateway.providerName) !== 'active'}
                    className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? (isRtl ? 'جاري التحويل...' : 'Redirecting...') : (isRtl ? 'ادفع الآن' : 'Pay Now')}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── WALLET TAB ── */}
          {activeTab === 'wallet' && currency === 'EGP' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">{isRtl ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-2xl font-bold text-white">{currencySymbol}{price}</span>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {selectedGateway && getGatewayStatus(selectedGateway.providerName) !== 'active' && renderFallback(getGatewayStatus(selectedGateway.providerName))}
              <button
                onClick={handleStandardRedirect}
                disabled={isSubmitting || !selectedGateway}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? (isRtl ? 'جاري...' : 'Loading...') : (isRtl ? 'ادفع بالمحفظة' : 'Pay via Wallet')}
              </button>
            </div>
          )}

          {/* ── MANUAL TAB ── */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-4 text-sm text-slate-400" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-semibold text-white mb-3">{isRtl ? 'تفاصيل التحويل:' : 'Transfer Details:'}</p>
                {paymentMethods.length > 0 ? (
                  <ul className="space-y-2">
                    {paymentMethods.map((pm) => (
                      <li key={pm.id}>
                        <span className="font-semibold text-white">{pm.name}: </span>{pm.accountDetails}
                        {pm.instructions && <p className="text-xs text-slate-500 mt-1 ml-3">{pm.instructions}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> {isRtl ? 'جاري التحميل...' : 'Loading...'}</p>
                )}
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-slate-500">{isRtl ? 'المبلغ المطلوب' : 'Amount to send'}</span>
                  <span className="text-xl font-bold text-white">{currencySymbol}{price}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{isRtl ? 'إرفاق إيصال التحويل' : 'Upload Transfer Receipt'}</label>
                <label
                  className="flex flex-col items-center justify-center w-full h-28 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: file ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `2px dashed ${file ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <UploadCloud className={`w-7 h-7 mb-2 ${file ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <p className="text-xs text-slate-500">{file ? <span className="text-indigo-400 font-semibold">{file.name}</span> : (isRtl ? 'اضغط لرفع الصورة' : 'Click to upload image')}</p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                </label>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {getTabStatus('manual') !== 'active' && renderFallback(getTabStatus('manual'))}

              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting || !file || getTabStatus('manual') !== 'active'}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? '...' : (isRtl ? 'تأكيد وإرسال' : 'Confirm & Submit')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes ping { 75%, 100% { transform: scale(1.15); opacity: 0; } }
        .animate-ping { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
}
