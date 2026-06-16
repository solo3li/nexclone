"use client";

import { useLanguageStore } from "../../store/useLanguageStore";

const plans = [
  {
    id: "free",
    nameAr: "المجانية",
    nameEn: "Free",
    price: "$0",
    period: { ar: "/ شهر", en: "/ month" },
    desc: { ar: "لتجربة المنصة والبدء.", en: "Get started, no commitment." },
    cta: { ar: "ابدأ مجاناً", en: "Get started" },
    highlighted: false,
    features: {
      ar: ["100 دقيقة صوت", "50 تحويل نص لصوت", "دعم فني عادي"],
      en: ["100 min voice", "50 text-to-voice", "Standard support"],
    },
  },
  {
    id: "pro",
    nameAr: "المحترفين",
    nameEn: "Pro",
    price: "$29",
    period: { ar: "/ شهر", en: "/ month" },
    desc: { ar: "للمبدعين وصناع المحتوى.", en: "For serious creators." },
    cta: { ar: "ابدأ الآن", en: "Get Pro" },
    highlighted: true,
    features: {
      ar: ["دقائق غير محدودة", "أصوات ذكاء اصطناعي مميزة", "جودة 4K للصور", "أولوية في الدعم", "بلا علامة مائية"],
      en: ["Unlimited minutes", "Premium AI voices", "4K image quality", "Priority support", "No watermark"],
    },
  },
  {
    id: "enterprise",
    nameAr: "الشركات",
    nameEn: "Enterprise",
    price: "$99",
    period: { ar: "/ شهر", en: "/ month" },
    desc: { ar: "للفرق والمؤسسات.", en: "For teams and orgs." },
    cta: { ar: "تواصل معنا", en: "Contact us" },
    highlighted: false,
    features: {
      ar: ["كل مميزات Pro", "وصول API كامل", "مساحة عمل مشتركة", "مدير حساب", "دعم 24/7"],
      en: ["All Pro features", "Full API access", "Team workspace", "Dedicated manager", "24/7 support"],
    },
  },
];

export default function PricingPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-14 animate-fade-up" dir={isAr ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="text-center mb-14 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full bg-[var(--brand)] blur-[120px] opacity-10 pointer-events-none" />
        <p className="text-xs font-semibold text-[var(--brand-bright)] uppercase tracking-widest mb-3">
          {isAr ? "الأسعار" : "Pricing"}
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          {isAr ? "خطط بسيطة وشفافة" : "Simple, transparent pricing"}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          {isAr
            ? "اختر الخطة المناسبة. لا رسوم خفية، لا مفاجآت."
            : "Choose your plan. No hidden fees, no surprises."}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative flex flex-col gap-6 p-7
              ${p.highlighted
                ? "glass-card-brand md:-translate-y-4"
                : "glass-card"
              }`}
          >
            {/* Glow blob for Pro */}
            {p.highlighted && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full bg-[var(--brand)] blur-[50px] opacity-30 pointer-events-none" />
            )}

            {p.highlighted && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge badge-brand text-[9px] shadow-lg">
                {isAr ? "الأكثر طلباً" : "Most popular"}
              </span>
            )}

            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-0.5">
                {isAr ? p.nameAr : p.nameEn}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {isAr ? p.desc.ar : p.desc.en}
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[var(--text-primary)]">{p.price}</span>
              <span className="text-xs text-[var(--text-tertiary)]">{isAr ? p.period.ar : p.period.en}</span>
            </div>

            <button
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                ${p.highlighted
                  ? "bg-[var(--brand)] text-white border border-[var(--brand)] hover:bg-[var(--brand-bright)] hover:border-[var(--brand-bright)] hover:-translate-y-px"
                  : "btn w-full justify-center"
                }`}
              style={p.highlighted ? { boxShadow: "0 4px 24px var(--brand-glow)" } : {}}
            >
              {isAr ? p.cta.ar : p.cta.en}
            </button>

            <ul className="space-y-3">
              {(isAr ? p.features.ar : p.features.en).map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5 text-[var(--brand-bright)]">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center mt-10 text-xs text-[var(--text-tertiary)]">
        {isAr
          ? "جميع الخطط تشمل تجديداً تلقائياً. يمكنك الإلغاء في أي وقت."
          : "All plans auto-renew. Cancel anytime."}
      </p>
    </div>
  );
}
