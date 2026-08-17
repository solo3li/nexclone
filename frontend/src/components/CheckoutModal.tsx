'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, UploadCloud, Loader2, ShieldCheck, Lock, RotateCcw, CheckCircle2 } from 'lucide-react';
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

interface FieldState {
  isEmpty: boolean;
  isValid: boolean;
  isFocused: boolean;
}

declare global {
  interface Window { paypal?: any; }
}

// ─── Mastercard-style Card Preview ──────────────────────────────────────────

function CardPreview({
  name, isFlipped, onFlip,
  numberState, expiryState, cvvState,
}: {
  name: string;
  isFlipped: boolean;
  onFlip: () => void;
  numberState: FieldState;
  expiryState: FieldState;
  cvvState: FieldState;
}) {
  const numberDisplay = numberState.isValid
    ? '•••• •••• •••• ●●●●'
    : numberState.isFocused
      ? '•••• •••• •••• ▌'
      : '•••• •••• •••• ••••';

  const expiryDisplay = expiryState.isValid
    ? '██ / ██'
    : expiryState.isFocused
      ? '▌▌ / ▌▌'
      : 'MM / YY';

  return (
    <div className="relative select-none" style={{ perspective: '1200px' }}>
      <div
        className="relative w-full transition-transform duration-700"
        style={{
          height: '175px',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ══ FRONT ══ */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
          }}
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 rounded-2xl opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* Glossy highlight */}
          <div className="absolute inset-0 rounded-2xl" style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 50%)',
          }} />

          {/* Glow from MC circles */}
          <div className="absolute top-3 right-3 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: '#eb001b' }} />
          <div className="absolute top-3 right-10 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: '#f79e1b' }} />

          {/* ── Row 1: Chip + MC Logo ── */}
          <div className="relative flex items-center justify-between">
            {/* EMV Chip */}
            <div className="relative">
              <div
                className="w-10 h-7 rounded-md"
                style={{
                  background: 'linear-gradient(145deg, #d4a843 0%, #c8961e 40%, #e8c060 60%, #c8961e 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)',
                }}
              />
              {/* Chip lines */}
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-px opacity-40">
                <div className="w-5 h-px bg-amber-900 rounded" />
                <div className="w-5 h-px bg-amber-900 rounded" />
                <div className="w-5 h-px bg-amber-900 rounded" />
              </div>
              {/* Chip center contact */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-4 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)' }} />
            </div>

            {/* Mastercard Logo */}
            <div className="relative flex items-center">
              <div
                className="w-9 h-9 rounded-full"
                style={{
                  background: '#eb001b',
                  boxShadow: '0 2px 8px rgba(235,0,27,0.4)',
                }}
              />
              <div
                className="w-9 h-9 rounded-full -ml-4"
                style={{
                  background: '#f79e1b',
                  mixBlendMode: 'screen',
                  boxShadow: '0 2px 8px rgba(247,158,27,0.4)',
                }}
              />
              {/* Mastercard text */}
              <span
                className="absolute left-1/2 -translate-x-1/2 text-white font-extrabold"
                style={{ fontSize: '7px', letterSpacing: '0.03em', top: '50%', transform: 'translate(-50%,-50%)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                mastercard
              </span>
            </div>
          </div>

          {/* ── Row 2: Card Number ── */}
          <div className="relative">
            <div
              className="font-mono tracking-[0.2em] transition-all duration-300"
              style={{
                fontSize: '15px',
                color: numberState.isValid ? '#a5b4fc' : numberState.isFocused ? '#fff' : 'rgba(255,255,255,0.5)',
                textShadow: numberState.isFocused ? '0 0 20px rgba(165,180,252,0.5)' : 'none',
              }}
            >
              {numberDisplay}
            </div>
            {numberState.isValid && (
              <CheckCircle2 className="absolute -right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>

          {/* ── Row 3: Expiry + Name ── */}
          <div className="relative flex justify-between items-end">
            <div>
              <div className="text-white/30 text-[8px] uppercase tracking-widest mb-0.5">Expires</div>
              <div
                className="font-mono text-xs transition-all duration-300"
                style={{
                  color: expiryState.isValid ? '#a5b4fc' : expiryState.isFocused ? '#fff' : 'rgba(255,255,255,0.45)',
                }}
              >
                {expiryDisplay}
                {expiryState.isValid && <CheckCircle2 className="inline ml-1 w-3 h-3 text-emerald-400" />}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/30 text-[8px] uppercase tracking-widest mb-0.5">Card Holder</div>
              <div
                className="text-xs font-semibold uppercase tracking-wide transition-all duration-200 max-w-[120px] truncate"
                style={{ color: name ? '#fff' : 'rgba(255,255,255,0.3)' }}
              >
                {name || 'YOUR NAME'}
              </div>
            </div>
          </div>
        </div>

        {/* ══ BACK ══ */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
          }}
        >
          {/* Magnetic strip */}
          <div className="absolute top-7 left-0 right-0 h-10" style={{ background: 'linear-gradient(180deg, #1a1a1a, #111, #1a1a1a)' }} />

          {/* Signature + CVV area */}
          <div className="absolute bottom-7 left-4 right-4 flex items-center gap-3">
            {/* Signature strip */}
            <div
              className="flex-1 h-9 rounded-md flex items-center px-2"
              style={{
                background: 'repeating-linear-gradient(45deg, #e8e8e8 0px, #e8e8e8 2px, #d0d0d0 2px, #d0d0d0 4px)',
              }}
            >
              <span className="text-[10px] italic text-gray-500 font-serif opacity-60">Authorized Signature</span>
            </div>
            {/* CVV box */}
            <div
              className="w-12 h-9 rounded-md flex flex-col items-center justify-center"
              style={{ background: '#fff', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)' }}
            >
              <span className="text-[7px] text-gray-500 font-semibold">CVV</span>
              <span
                className="font-mono text-sm font-bold transition-all duration-300"
                style={{ color: cvvState.isValid ? '#4f46e5' : '#374151' }}
              >
                {cvvState.isValid ? '●●●' : '•••'}
              </span>
            </div>
          </div>

          {/* MC logo small on back */}
          <div className="absolute top-2 right-4 flex items-center">
            <div className="w-5 h-5 rounded-full" style={{ background: '#eb001b', opacity: 0.7 }} />
            <div className="w-5 h-5 rounded-full -ml-2" style={{ background: '#f79e1b', opacity: 0.7 }} />
          </div>
        </div>
      </div>

      {/* Flip button */}
      <button
        type="button"
        onClick={onFlip}
        className="mt-2 w-full flex items-center justify-center gap-1.5 text-[11px] text-indigo-400/70 hover:text-indigo-300 transition py-0.5"
      >
        <RotateCcw className="w-3 h-3" />
        {isFlipped ? 'الوجه الأمامي' : 'عرض CVV'}
      </button>
    </div>
  );
}

// ─── Hosted Field Box ─────────────────────────────────────────────────────────

function HostedFieldBox({ id, label, isValid, isFocused }: {
  id: string;
  label: string;
  isValid?: boolean;
  isFocused?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <div
        className="relative w-full h-11 rounded-xl px-3 flex items-center transition-all duration-200"
        style={{
          background: '#0a0a10',
          border: isValid
            ? '1px solid rgba(52,211,153,0.4)'
            : isFocused
              ? '1px solid rgba(99,102,241,0.6)'
              : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isFocused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
        }}
      >
        <div id={id} className="w-full h-full flex items-center" />
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FIELD: FieldState = { isEmpty: true, isValid: false, isFocused: false };

export default function CheckoutModal({ plan, currency, onClose }: CheckoutModalProps) {
  const locale = useLocale();
  const isRtl  = locale === 'ar';

  const [activeTab, setActiveTab]         = useState<'card' | 'wallet' | 'manual'>('card');
  const [gateways, setGateways]           = useState<GatewayOption[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<GatewayOption | null>(null);
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethod[]>([]);
  const [file, setFile]                   = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [isLoadingGateways, setIsLoadingGateways] = useState(false);
  const [error, setError]                 = useState('');

  // Card UI
  const [cardholderName, setCardholderName] = useState('');
  const [isCardFlipped, setIsCardFlipped]   = useState(false);
  const [numberState, setNumberState]       = useState<FieldState>(DEFAULT_FIELD);
  const [expiryState, setExpiryState]       = useState<FieldState>(DEFAULT_FIELD);
  const [cvvState, setCvvState]             = useState<FieldState>(DEFAULT_FIELD);

  // PayPal
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

  // ─── Manual ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'manual' && paymentMethods.length === 0) {
      api.get<PaymentMethod[]>('/api/ManualPayments/methods').then((r) => setPaymentMethods(r.data)).catch(() => {});
    }
  }, [activeTab, paymentMethods.length]);

  // ─── Public settings ───────────────────────────────────────────────────────
  const [paymentStatuses, setPaymentStatuses] = useState<any>(null);
  const [socialLinks, setSocialLinks]         = useState<{ [k: string]: string }>({});

  useEffect(() => {
    api.get('/api/settings/public').then((r) => setPaymentStatuses(r.data.paymentStatuses)).catch(() => {});
    api.get('/api/platform/social-links').then((r) => setSocialLinks(r.data)).catch(() => {});
  }, []);

  // ─── PayPal SDK ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (currency !== 'USD' || !selectedGateway || selectedGateway.providerName !== 'PayPal') return;

    const clientId = selectedGateway.clientId ||
      'ARjmGWCzZOQte5ev7zNvng8eTjtoHSdkWelVbPmI_fHqu3dXua5gtiM-udVH1AD0RP_5FhSUCfV-I7sO';

    const initFields = () => {
      if (!window.paypal?.CardFields) { setIsCardFieldsReady(false); return; }
      if (cardFieldsInstanceRef.current) return; // guard — only init once

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

        setTimeout(() => {
          try {
            const numEl = document.getElementById('ppf-number');
            const expEl = document.getElementById('ppf-expiry');
            const cvvEl = document.getElementById('ppf-cvv');
            if (!numEl || !expEl || !cvvEl) return;

            numEl.innerHTML = ''; expEl.innerHTML = ''; cvvEl.innerHTML = '';

            const numField = cf.NumberField({
              placeholder: '1234  5678  9012  3456',
              onChange: (evt: any) => setNumberState({ isEmpty: evt.isEmpty, isValid: evt.isValid, isFocused: false }),
              onFocus: () => setNumberState((s) => ({ ...s, isFocused: true })),
              onBlur: () => setNumberState((s) => ({ ...s, isFocused: false })),
            });
            const expField = cf.ExpiryField({
              placeholder: 'MM / YY',
              onChange: (evt: any) => setExpiryState({ isEmpty: evt.isEmpty, isValid: evt.isValid, isFocused: false }),
              onFocus: () => setExpiryState((s) => ({ ...s, isFocused: true })),
              onBlur: () => setExpiryState((s) => ({ ...s, isFocused: false })),
            });
            const cvvField = cf.CVVField({
              placeholder: '•••',
              onChange: (evt: any) => setCvvState({ isEmpty: evt.isEmpty, isValid: evt.isValid, isFocused: false }),
              onFocus: () => setCvvState((s) => ({ ...s, isFocused: true })),
              onBlur: () => setCvvState((s) => ({ ...s, isFocused: false })),
            });

            numField.render('#ppf-number');
            expField.render('#ppf-expiry');
            cvvField.render('#ppf-cvv');

            setIsCardFieldsReady(true);
          } catch (e) { console.warn('[PayPal render]', e); }
        }, 400);
      } catch (e) {
        console.error('[PayPal init]', e);
        setIsCardFieldsReady(false);
      }
    };

    const scriptId = 'paypal-sdk-script';
    const existing = document.getElementById(scriptId);
    if (!existing) {
      const s = document.createElement('script');
      s.id  = scriptId;
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=card-fields&currency=USD&intent=capture`;
      s.async = true;
      s.onload = initFields;
      document.body.appendChild(s);
    } else {
      initFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGateway?.gatewayConfigId]);

  if (!plan) return null;

  const price          = currency === 'USD' ? plan.priceUsd : plan.priceEgp;
  const currencySymbol = currency === 'USD' ? '$' : 'EGP ';
  const isUsdPayPal    = currency === 'USD' && selectedGateway?.providerName === 'PayPal';

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCardPay = async () => {
    if (!cardFieldsInstanceRef.current) return;
    setIsSubmitting(true); setError('');
    try {
      await cardFieldsInstanceRef.current.submit({ cardholderName: cardholderName.trim() || 'Cardholder' });
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
        planId: plan.id, gatewayConfigId: selectedGateway.gatewayConfigId,
        currency, method: activeTab === 'wallet' ? 'wallet' : 'card',
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
      return (a === 'active' || b === 'active') ? 'active' : a;
    }
    if (tab === 'wallet') return gwStatus('paymob');
    if (tab === 'manual') return gwStatus('manual');
    return 'active';
  };

  const Badge = ({ s }: { s: string }) => {
    if (s === 'maintenance') return <span className="text-[8px] font-bold px-1 py-px rounded bg-orange-500/20 text-orange-400">{isRtl ? 'صيانة' : 'Maint'}</span>;
    if (s === 'coming_soon') return <span className="text-[8px] font-bold px-1 py-px rounded bg-cyan-500/20 text-cyan-400">{isRtl ? 'قريباً' : 'Soon'}</span>;
    if (s === 'suspended')   return <span className="text-[8px] font-bold px-1 py-px rounded bg-red-500/20 text-red-400">{isRtl ? 'موقوف' : 'Off'}</span>;
    return null;
  };

  const FallbackMsg = ({ s }: { s: string }) => {
    if (s === 'active') return null;
    const msgs: Record<string, string> = {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ background: 'radial-gradient(circle,#6366f1,transparent)' }} />
      </div>

      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          maxWidth: '700px',
          maxHeight: '95vh',
          overflowY: 'auto',
          background: 'linear-gradient(170deg,#13131a 0%,#0f0f14 100%)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition">
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

          {/* Tabs */}
          <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['card', ...(currency === 'EGP' ? ['wallet'] : []), 'manual']).map((tab) => {
              const t = tab as 'card' | 'wallet' | 'manual';
              const st = tabStatus(t);
              const active = activeTab === t;
              const labels: Record<string, string> = {
                card:   isRtl ? '💳 بطاقة' : '💳 Card',
                wallet: isRtl ? '📱 محافظ' : '📱 Wallets',
                manual: isRtl ? '🏦 تحويل' : '🏦 Transfer',
              };
              return (
                <button key={tab} onClick={() => setActiveTab(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-0.5"
                  style={{
                    background: active ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'transparent',
                    color:      active ? '#fff' : '#64748b',
                    boxShadow:  active ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  <span>{labels[t]}</span>
                  <Badge s={st} />
                </button>
              );
            })}
          </div>

          {/* ── CARD TAB ── */}
          {activeTab === 'card' && (
            <div>
              {isLoadingGateways ? (
                <div className="flex flex-col items-center py-14 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <span className="text-slate-500 text-xs">{isRtl ? 'جاري تجهيز البوابة...' : 'Initializing gateway...'}</span>
                </div>
              ) : gateways.length === 0 ? (
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center text-slate-500 text-sm">
                  {isRtl ? 'لا توجد بوابات دفع متاحة.' : 'No payment gateways available.'}
                </div>
              ) : isUsdPayPal ? (
                /* ── USD PayPal — two columns ── */
                <div className="space-y-4">
                  <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* Card Preview */}
                    <CardPreview
                      name={cardholderName}
                      isFlipped={isCardFlipped}
                      onFlip={() => setIsCardFlipped((v) => !v)}
                      numberState={numberState}
                      expiryState={expiryState}
                      cvvState={cvvState}
                    />

                    {/* Fields — no React events on PayPal iframes */}
                    <div className="flex flex-col gap-3">
                      {/* Cardholder name */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                          {isRtl ? 'الاسم على البطاقة' : 'Cardholder Name'}
                        </label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full h-11 px-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                          style={{
                            background: '#0a0a10',
                            border: cardholderName ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          }}
                        />
                      </div>

                      <HostedFieldBox
                        id="ppf-number"
                        label={isRtl ? 'رقم البطاقة' : 'Card Number'}
                        isValid={numberState.isValid}
                        isFocused={numberState.isFocused}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <HostedFieldBox
                          id="ppf-expiry"
                          label={isRtl ? 'الانتهاء' : 'Expiry'}
                          isValid={expiryState.isValid}
                          isFocused={expiryState.isFocused}
                        />
                        <HostedFieldBox
                          id="ppf-cvv"
                          label="CVV"
                          isValid={cvvState.isValid}
                          isFocused={cvvState.isFocused}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Pay button */}
                  <button
                    onClick={handleCardPay}
                    disabled={isSubmitting || !isCardFieldsReady}
                    className="relative w-full py-4 rounded-2xl font-bold text-white text-base overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
                      boxShadow: isSubmitting ? 'none' : '0 8px 28px rgba(99,102,241,0.5)',
                    }}
                  >
                    {!isSubmitting && isCardFieldsReady && (
                      <span className="absolute inset-0 rounded-2xl animate-pulse opacity-15" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }} />
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
                    <div className="flex items-center gap-2 opacity-30">
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
                /* ── EGP Redirect ── */
                <div className="space-y-4">
                  {gateways.length > 1 && (
                    <div className="grid gap-2">
                      {gateways.map((g) => (
                        <button key={g.gatewayConfigId} onClick={() => setSelectedGateway(g)}
                          className="flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all"
                          style={{
                            background:  selectedGateway?.gatewayConfigId === g.gatewayConfigId ? 'rgba(99,102,241,0.1)' : 'transparent',
                            borderColor: selectedGateway?.gatewayConfigId === g.gatewayConfigId ? '#6366f1' : 'rgba(255,255,255,0.08)',
                            color:       selectedGateway?.gatewayConfigId === g.gatewayConfigId ? '#fff' : '#64748b',
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
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">{isRtl ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-2xl font-bold text-white">{currencySymbol}{price}</span>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <FallbackMsg s={tabStatus('wallet')} />
              <button onClick={handleRedirectPay} disabled={isSubmitting || !selectedGateway}
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
                  <p className="text-slate-500 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />{isRtl ? 'جاري...' : 'Loading...'}</p>
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
                    background: file ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `2px dashed ${file ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <UploadCloud className={`w-7 h-7 mb-2 ${file ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <p className="text-xs text-slate-500">
                    {file ? <span className="text-indigo-400 font-semibold">{file.name}</span> : (isRtl ? 'اضغط لرفع الصورة' : 'Click to upload')}
                  </p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
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
