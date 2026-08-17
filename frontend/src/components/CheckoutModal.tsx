'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, UploadCloud, Loader2, CreditCard, ShieldCheck, Lock, RotateCcw } from 'lucide-react';
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

function CardPreview({ name, isFlipped, onFlip }: {
  name: string;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="relative select-none" style={{ perspective: '1000px' }}>
      {/* Card flip container */}
      <div
        className="relative w-full transition-transform duration-700"
        style={{
          height: '160px',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
            boxShadow: '0 16px 40px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Shine */}
          <div className="absolute inset-0 rounded-2xl" style={{
            background: 'radial-gradient(ellipse at 15% 15%, rgba(255,255,255,0.18) 0%, transparent 65%)',
          }} />
          {/* Circles */}
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full" style={{ background: 'rgba(139,92,246,0.15)' }} />
          <div className="absolute -right-2 top-10 w-24 h-24 rounded-full" style={{ background: 'rgba(99,102,241,0.12)' }} />

          <div className="relative flex justify-between items-start">
            {/* Chip */}
            <div className="w-9 h-6 rounded" style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
            }} />
            {/* Card type icon */}
            <CreditCard className="w-6 h-6 text-white/30" />
          </div>

          <div className="relative space-y-2">
            <div className="text-white/70 text-base font-mono tracking-[0.22em]">
              •••• •••• •••• ••••
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/35 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</div>
                <div className="text-white text-xs font-semibold uppercase tracking-wide truncate max-w-[110px]">
                  {name || 'YOUR NAME'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/35 text-[9px] uppercase tracking-widest mb-0.5">Expires</div>
                <div className="text-white text-xs font-mono">MM / YY</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
            boxShadow: '0 16px 40px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Magnetic strip */}
          <div className="w-full h-8 absolute top-6" style={{ background: 'rgba(0,0,0,0.75)' }} />
          <div className="absolute bottom-6 left-0 right-0 px-4 flex items-center gap-2">
            <div className="flex-1 h-8 rounded" style={{ background: 'rgba(255,255,255,0.85)' }} />
            <div className="text-right">
              <div className="text-white/40 text-[9px] mb-0.5">CVV</div>
              <div className="text-white text-xs font-mono font-bold">•••</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flip button */}
      <button
        type="button"
        onClick={onFlip}
        className="mt-2 w-full flex items-center justify-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 transition"
      >
        <RotateCcw className="w-3 h-3" />
        {isFlipped ? 'عرض الوجه الأمامي' : 'عرض خانة CVV'}
      </button>
    </div>
  );
}

// ─── Hosted Field Box (no event handlers to avoid iframe focus loss) ──────────

function HostedFieldBox({ id, label }: { id: string; label: string }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <div
        id={id}
        className="w-full h-11 rounded-xl px-3 flex items-center"
        style={{
          background: '#0d0d12',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 0 0 transparent',
          transition: 'box-shadow 0.2s',
        }}
      />
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

  // Card UI state (no iframes involved)
  const [cardholderName, setCardholderName]   = useState('');
  const [isCardFlipped, setIsCardFlipped]     = useState(false);

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
  const [socialLinks, setSocialLinks]         = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.get('/api/settings/public').then((r) => setPaymentStatuses(r.data.paymentStatuses)).catch(() => {});
    api.get('/api/platform/social-links').then((r) => setSocialLinks(r.data)).catch(() => {});
  }, []);

  // ─── PayPal SDK – load ONCE, no state triggers inside ────────────────────
  useEffect(() => {
    if (currency !== 'USD' || !selectedGateway || selectedGateway.providerName !== 'PayPal') return;

    const clientId = selectedGateway.clientId ||
      'ARjmGWCzZOQte5ev7zNvng8eTjtoHSdkWelVbPmI_fHqu3dXua5gtiM-udVH1AD0RP_5FhSUCfV-I7sO';
    const scriptId = 'paypal-sdk-script';

    const initFields = () => {
      if (!window.paypal?.CardFields) { setIsCardFieldsReady(false); return; }

      // Build instance once
      if (cardFieldsInstanceRef.current) return; // already initialized

      try {
        const cf = window.paypal.CardFields({
          createOrder: async () => {
            setError('');
            const res = await api.post('/api/checkout/create-paypal-order', {
              planId: plan?.id,
              gatewayConfigId: selectedGateway.gatewayConfigId,
              currency: 'USD',
              method: 'card',
            });
            if (!res.data?.orderId) throw new Error(res.data?.error || 'Order creation failed');
            return res.data.orderId;
          },
          onApprove: async (data: any) => {
            try {
              const res = await api.post('/api/checkout/capture-paypal-order', { orderId: data.orderID });
              if (res.data?.success) {
                window.location.href = `/${locale}/payment/success?planId=${plan?.id}&provider=PayPal`;
              } else throw new Error(res.data?.error || 'Capture failed');
            } catch (e: any) {
              setError(e?.response?.data?.error || e?.message || (isRtl ? 'فشل تأكيد الدفع' : 'Capture failed'));
              setIsSubmitting(false);
            }
          },
          onError: (e: any) => {
            setError(e?.message || (isRtl ? 'خطأ في معالجة البطاقة' : 'Card error'));
            setIsSubmitting(false);
          },
          // Minimal style – no background so it inherits the container
          style: {
            input: {
              'font-size': '14px',
              'font-family': 'inherit',
              color: '#e2e8f0',
              padding: '0',
              background: 'transparent',
            },
            'input::placeholder': { color: '#374151' },
            'input.invalid': { color: '#f87171' },
          },
        });

        cardFieldsInstanceRef.current = cf;

        if (!cf.isEligible()) { setIsCardFieldsReady(false); return; }

        // Render into our divs (plain divs, no React events on them)
        setTimeout(() => {
          try {
            const num = document.getElementById('ppf-number');
            const exp = document.getElementById('ppf-expiry');
            const cvv = document.getElementById('ppf-cvv');
            if (num && exp && cvv) {
              num.innerHTML = ''; exp.innerHTML = ''; cvv.innerHTML = '';
              cf.NumberField({ placeholder: '1234  5678  9012  3456' }).render('#ppf-number');
              cf.ExpiryField({ placeholder: 'MM / YY' }).render('#ppf-expiry');
              cf.CVVField({ placeholder: '•••' }).render('#ppf-cvv');
              setIsCardFieldsReady(true);
            }
          } catch (err) { console.warn('[PayPal render]', err); }
        }, 400);
      } catch (err) {
        console.error('[PayPal init]', err);
        setIsCardFieldsReady(false);
      }
    };

    const existing = document.getElementById(scriptId);
    if (!existing) {
      const s = document.createElement('script');
      s.id = scriptId;
      // Only card-fields component – no buttons
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=card-fields&currency=USD&intent=capture`;
      s.async = true;
      s.onload = initFields;
      document.body.appendChild(s);
    } else {
      initFields();
    }

    // Cleanup – do NOT destroy on re-render to avoid focus loss
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGateway?.gatewayConfigId]);

  if (!plan) return null;

  const price         = currency === 'USD' ? plan.priceUsd : plan.priceEgp;
  const currencySymbol = currency === 'USD' ? '$' : 'EGP ';
  const isUsdPayPal   = currency === 'USD' && selectedGateway?.providerName === 'PayPal';

  // ─── Submit handlers ───────────────────────────────────────────────────────
  const handleCardPay = async () => {
    if (!cardFieldsInstanceRef.current) return;
    setIsSubmitting(true); setError('');
    try {
      await cardFieldsInstanceRef.current.submit({
        cardholderName: cardholderName.trim() || 'Cardholder',
      });
    } catch (e: any) {
      setError(e?.message || (isRtl ? 'خطأ في الدفع' : 'Payment error'));
      setIsSubmitting(false);
    }
  };

  const handleRedirectPay = async () => {
    if (!selectedGateway) return;
    setIsSubmitting(true); setError('');
    try {
      const res = await api.post('/api/checkout/pay', {
        planId: plan.id,
        gatewayConfigId: selectedGateway.gatewayConfigId,
        currency,
        method: activeTab === 'wallet' ? 'wallet' : 'card',
      });
      if (res.data?.checkoutUrl) window.location.href = res.data.checkoutUrl;
      else throw new Error('No URL');
    } catch (e: any) {
      setError(e.response?.data?.error || (isRtl ? 'حدث خطأ' : 'Error'));
      setIsSubmitting(false);
    }
  };

  const handleManualPay = async () => {
    if (!file) { setError(isRtl ? 'يرجى إرفاق الإيصال' : 'Please upload receipt'); return; }
    setIsSubmitting(true); setError('');
    try {
      const fd = new FormData();
      fd.append('PlanId', plan.id.toString());
      fd.append('ReceiptImage', file);
      await api.post('/api/ManualPayments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      window.location.href = `/${locale}/payment/success?method=manual`;
    } catch (e: any) {
      setError(e.response?.data?.message || (isRtl ? 'حدث خطأ' : 'Error'));
    } finally { setIsSubmitting(false); }
  };

  // ─── Status helpers ────────────────────────────────────────────────────────
  const gwStatus = (name: string) => {
    const s = paymentStatuses?.[name.toLowerCase()];
    if (s?.suspended) return 'suspended';
    if (s?.maintenance) return 'maintenance';
    if (s?.comingSoon) return 'coming_soon';
    return 'active';
  };

  const tabStatus = (tab: string) => {
    if (tab === 'card') {
      const a = gwStatus('paypal'); const b = gwStatus('paymob');
      if (a === 'active' || b === 'active') return 'active';
      return a;
    }
    if (tab === 'wallet') return gwStatus('paymob');
    if (tab === 'manual') return gwStatus('manual');
    return 'active';
  };

  const Badge = ({ s }: { s: string }) => {
    if (s === 'maintenance') return <span className="text-[9px] font-bold px-1 py-px rounded bg-orange-500/20 text-orange-400">{isRtl ? 'صيانة' : 'Maint'}</span>;
    if (s === 'coming_soon') return <span className="text-[9px] font-bold px-1 py-px rounded bg-cyan-500/20 text-cyan-400">{isRtl ? 'قريباً' : 'Soon'}</span>;
    if (s === 'suspended')   return <span className="text-[9px] font-bold px-1 py-px rounded bg-red-500/20 text-red-400">{isRtl ? 'موقوف' : 'Off'}</span>;
    return null;
  };

  const FallbackMsg = ({ s }: { s: string }) => {
    if (s === 'active') return null;
    const msgs: Record<string,string> = {
      maintenance: isRtl ? 'البوابة تحت الصيانة.' : 'Gateway under maintenance.',
      coming_soon: isRtl ? 'ستتوفر قريباً.' : 'Coming soon.',
      suspended:   isRtl ? 'البوابة موقوفة.' : 'Gateway suspended.',
    };
    return (
      <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl p-3 text-sm text-orange-400 text-center">
        <p className="mb-2">{msgs[s]}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-xs bg-blue-600/80 text-white px-3 py-1 rounded-lg">Facebook</a>}
          {socialLinks.whatsapp && <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="text-xs bg-green-600/80 text-white px-3 py-1 rounded-lg">WhatsApp</a>}
          <a href={`/${locale}/profile/tickets`} className="text-xs bg-white/10 text-white px-3 py-1 rounded-lg">{isRtl ? 'تذكرة دعم' : 'Support'}</a>
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      </div>

      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          maxWidth: '680px',
          maxHeight: '95vh',
          overflowY: 'auto',
          background: 'linear-gradient(170deg, #13131a 0%, #0f0f14 100%)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-0.5">
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
          <div className="flex gap-2 mb-5 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['card', ...(currency === 'EGP' ? ['wallet'] : []), 'manual']).map((tab) => {
              const t = tab as 'card' | 'wallet' | 'manual';
              const st = tabStatus(t);
              const active = activeTab === t;
              const labels: Record<string,string> = {
                card:   isRtl ? '💳 بطاقة' : '💳 Card',
                wallet: isRtl ? '📱 محافظ' : '📱 Wallets',
                manual: isRtl ? '🏦 تحويل' : '🏦 Transfer',
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-0.5"
                  style={{
                    background: active ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'transparent',
                    color:      active ? '#fff' : '#64748b',
                    boxShadow:  active ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  <span>{labels[tab]}</span>
                  <Badge s={st} />
                </button>
              );
            })}
          </div>

          {/* ──────────────────────── CARD TAB ──────────────────────── */}
          {activeTab === 'card' && (
            <div>
              {isLoadingGateways ? (
                <div className="flex flex-col items-center py-14 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <span className="text-slate-500 text-xs">{isRtl ? 'جاري تجهيز بوابة الدفع...' : 'Initializing gateway...'}</span>
                </div>
              ) : gateways.length === 0 ? (
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center text-slate-500 text-sm">
                  {isRtl ? 'لا توجد بوابات دفع متاحة لهذه الباقة.' : 'No payment gateways available.'}
                </div>
              ) : isUsdPayPal ? (
                /* ── USD: Side-by-side layout ── */
                <div className="space-y-4">
                  {/* Two-column grid */}
                  <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* LEFT — Card preview */}
                    <div className="flex flex-col gap-0">
                      <CardPreview
                        name={cardholderName}
                        isFlipped={isCardFlipped}
                        onFlip={() => setIsCardFlipped((v) => !v)}
                      />
                    </div>

                    {/* RIGHT — Hosted fields (plain divs, no React event handlers) */}
                    <div className="flex flex-col gap-3">
                      {/* Cardholder name — normal React input, safe */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                          {isRtl ? 'الاسم على البطاقة' : 'Cardholder Name'}
                        </label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder={isRtl ? 'مثال: Ahmed Mohamed' : 'e.g. John Doe'}
                          className="w-full h-11 px-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
                          style={{
                            background: '#0d0d12',
                            border: '1px solid rgba(99,102,241,0.25)',
                          }}
                        />
                      </div>

                      {/* PayPal hosted field: number */}
                      <HostedFieldBox id="ppf-number" label={isRtl ? 'رقم البطاقة' : 'Card Number'} />

                      {/* Expiry + CVV side by side */}
                      <div className="grid grid-cols-2 gap-2">
                        <HostedFieldBox id="ppf-expiry" label={isRtl ? 'الانتهاء' : 'Expiry'} />
                        <HostedFieldBox id="ppf-cvv" label="CVV" />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Pay button — full width below the two columns */}
                  <button
                    onClick={handleCardPay}
                    disabled={isSubmitting || !isCardFieldsReady}
                    className="relative w-full py-4 rounded-2xl font-bold text-white text-base overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
                      boxShadow:  isSubmitting ? 'none' : '0 8px 28px rgba(99,102,241,0.5)',
                    }}
                  >
                    {!isSubmitting && isCardFieldsReady && (
                      <span className="absolute inset-0 rounded-2xl animate-pulse opacity-20"
                        style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }} />
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting
                        ? <><Loader2 className="w-5 h-5 animate-spin" />{isRtl ? 'جاري المعالجة...' : 'Processing...'}</>
                        : <><ShieldCheck className="w-5 h-5" />{isRtl ? `ادفع الآن · ${currencySymbol}${price}` : `Pay Now · ${currencySymbol}${price}`}</>
                      }
                    </span>
                  </button>

                  {/* Trust bar */}
                  <div className="flex items-center justify-center gap-3">
                    <Lock className="w-3 h-3 text-slate-700" />
                    <span className="text-slate-600 text-[11px]">{isRtl ? 'مدعوم بـ' : 'Secured by'}</span>
                    <div className="flex items-center gap-2 opacity-35">
                      <span className="text-[11px] font-black text-slate-400 italic">VISA</span>
                      <div className="flex -space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <div className="w-4 h-4 rounded-full bg-yellow-400" />
                      </div>
                      <span className="text-[11px] font-bold text-blue-400">PayPal</span>
                    </div>
                    <span className="text-slate-600 text-[11px]">256-bit SSL</span>
                  </div>
                </div>
              ) : (
                /* ── EGP: Standard redirect ── */
                <div className="space-y-4">
                  {gateways.length > 1 && (
                    <div className="grid gap-2">
                      {gateways.map((g) => (
                        <button key={g.gatewayConfigId} onClick={() => setSelectedGateway(g)}
                          className="flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all"
                          style={{
                            background:   selectedGateway?.gatewayConfigId === g.gatewayConfigId ? 'rgba(99,102,241,0.1)' : 'transparent',
                            borderColor:  selectedGateway?.gatewayConfigId === g.gatewayConfigId ? '#6366f1' : 'rgba(255,255,255,0.08)',
                            color:        selectedGateway?.gatewayConfigId === g.gatewayConfigId ? '#fff' : '#64748b',
                          }}
                        >
                          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedGateway?.gatewayConfigId === g.gatewayConfigId ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`} />
                          {g.displayName}
                          {g.isDefault && <span className="ml-auto text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{isRtl ? 'مقترح' : 'Recommended'}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">{isRtl ? 'البوابة' : 'Gateway'}</span>
                      <span className="text-white font-medium">{selectedGateway?.displayName ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">{isRtl ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-2xl font-bold text-white">{currencySymbol}{price}</span>
                    </div>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  {selectedGateway && <FallbackMsg s={gwStatus(selectedGateway.providerName)} />}
                  <button onClick={handleRedirectPay}
                    disabled={isSubmitting || !selectedGateway || gwStatus(selectedGateway?.providerName ?? '') !== 'active'}
                    className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 8px 28px rgba(99,102,241,0.4)' }}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? (isRtl ? 'جاري...' : 'Redirecting...') : (isRtl ? 'ادفع الآن' : 'Pay Now')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── WALLET TAB ── */}
          {activeTab === 'wallet' && currency === 'EGP' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">{isRtl ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-2xl font-bold text-white">{currencySymbol}{price}</span>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <FallbackMsg s={tabStatus('wallet')} />
              <button onClick={handleRedirectPay}
                disabled={isSubmitting || !selectedGateway}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 8px 28px rgba(16,185,129,0.4)' }}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? '...' : (isRtl ? 'ادفع بالمحفظة' : 'Pay via Wallet')}
              </button>
            </div>
          )}

          {/* ── MANUAL TAB ── */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-4 text-sm text-slate-400"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
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
                  <p className="text-slate-500 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {isRtl ? 'جاري التحميل...' : 'Loading...'}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-slate-500">{isRtl ? 'المبلغ' : 'Amount'}</span>
                  <span className="text-xl font-bold text-white">{currencySymbol}{price}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  {isRtl ? 'إرفاق إيصال التحويل' : 'Upload Transfer Receipt'}
                </label>
                <label
                  className="flex flex-col items-center justify-center w-full h-28 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background:  file ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
                    border:      `2px dashed ${file ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <UploadCloud className={`w-7 h-7 mb-2 ${file ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <p className="text-xs text-slate-500">
                    {file
                      ? <span className="text-indigo-400 font-semibold">{file.name}</span>
                      : (isRtl ? 'اضغط لرفع الصورة' : 'Click to upload')}
                  </p>
                  <input type="file" className="hidden" accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                </label>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              <FallbackMsg s={tabStatus('manual')} />

              <button onClick={handleManualPay}
                disabled={isSubmitting || !file || tabStatus('manual') !== 'active'}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)', boxShadow: '0 8px 28px rgba(124,58,237,0.4)' }}
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
