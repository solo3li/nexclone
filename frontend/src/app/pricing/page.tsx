"use client";

import { useLanguageStore } from "../../store/useLanguageStore";

const plans = [
  {
    id: "free",
    nameAr: "المجانية",
    nameEn: "Free",
    price: "$0",
    periodAr: "/ شهر",
    periodEn: "/ month",
    descAr: "لتجربة المنصة والبدء.",
    descEn: "Get started, no commitment.",
    cta: { ar: "ابدأ مجاناً", en: "Get started" },
    highlighted: false,
    featuresAr: ["100 دقيقة صوت", "50 تحويل نص لصوت", "دعم فني عادي"],
    featuresEn: ["100 min voice", "50 text-to-voice", "Standard support"],
  },
  {
    id: "pro",
    nameAr: "المحترفين",
    nameEn: "Pro",
    price: "$29",
    periodAr: "/ شهر",
    periodEn: "/ month",
    descAr: "للمبدعين وصناع المحتوى.",
    descEn: "For serious creators.",
    cta: { ar: "ابدأ الآن", en: "Get Pro" },
    highlighted: true,
    featuresAr: [
      "دقائق غير محدودة",
      "أصوات ذكاء اصطناعي مميزة",
      "جودة 4K للصور",
      "أولوية في الدعم",
      "بلا علامة مائية",
    ],
    featuresEn: [
      "Unlimited minutes",
      "Premium AI voices",
      "4K image quality",
      "Priority support",
      "No watermark",
    ],
  },
  {
    id: "enterprise",
    nameAr: "الشركات",
    nameEn: "Enterprise",
    price: "$99",
    periodAr: "/ شهر",
    periodEn: "/ month",
    descAr: "للفرق والمؤسسات.",
    descEn: "For teams and orgs.",
    cta: { ar: "تواصل معنا", en: "Contact us" },
    highlighted: false,
    featuresAr: ["كل مميزات Pro", "وصول API كامل", "مساحة عمل مشتركة", "مدير حساب", "دعم 24/7"],
    featuresEn: ["All Pro features", "Full API access", "Team workspace", "Dedicated manager", "24/7 support"],
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)]">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PricingPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-16" dir={isAr ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-caption text-[var(--color-muted)] mb-3">
          {isAr ? "الأسعار" : "Pricing"}
        </p>
        <h1 className="text-h1 text-[var(--color-ink)] mb-4">
          {isAr ? "خطط بسيطة وشفافة" : "Simple, transparent pricing"}
        </h1>
        <p className="text-body text-[var(--color-muted)] max-w-md mx-auto">
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
            className={`card p-7 flex flex-col gap-6 relative
              ${p.highlighted
                ? "border-[var(--color-primary)] shadow-[0_4px_30px_rgba(37,99,235,0.12)] md:-translate-y-3"
                : ""
              }`}
          >
            {/* Popular badge */}
            {p.highlighted && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge badge-primary text-[10px] shadow-sm">
                {isAr ? "الأكثر طلباً" : "Most popular"}
              </span>
            )}

            {/* Plan name + desc */}
            <div>
              <p className="text-small font-semibold text-[var(--color-muted)] mb-1">
                {isAr ? p.nameAr : p.nameEn}
              </p>
              <p className="text-small text-[var(--color-subtle)]">
                {isAr ? p.descAr : p.descEn}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-display text-[var(--color-ink)]">{p.price}</span>
              <span className="text-small text-[var(--color-muted)]">
                {isAr ? p.periodAr : p.periodEn}
              </span>
            </div>

            {/* CTA */}
            <button
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all
                ${p.highlighted
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[0_4px_14px_rgba(37,99,235,0.28)] hover:-translate-y-px"
                  : "bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border border-[var(--color-border)]"
                }`}
            >
              {isAr ? p.cta.ar : p.cta.en}
            </button>

            {/* Features */}
            <ul className="space-y-3">
              {(isAr ? p.featuresAr : p.featuresEn).map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-small text-[var(--color-muted)]">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center mt-10 text-small text-[var(--color-subtle)]">
        {isAr
          ? "جميع الخطط تشمل تجديداً تلقائياً. يمكنك الإلغاء في أي وقت."
          : "All plans include auto-renewal. Cancel anytime."}
      </p>
    </div>
  );
}
