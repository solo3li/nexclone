"use client";

import { useLanguageStore } from "../../store/useLanguageStore";

export default function PricingPage() {
  const { language } = useLanguageStore();

  const plans = [
    {
      id: "free",
      nameAr: "الباقة المجانية",
      nameEn: "Free Plan",
      price: "$0",
      periodAr: "/ شهرياً",
      periodEn: "/ month",
      descAr: "للتجربة والاستخدام الخفيف.",
      descEn: "For testing and light usage.",
      featuresAr: [
        "100 دقيقة تحويل صوت",
        "50 تحويل نص إلى صوت",
        "توليد 10 صور",
        "دعم فني عادي"
      ],
      featuresEn: [
        "100 min Voice to Text",
        "50 Text to Voice",
        "10 Image Generations",
        "Standard Support"
      ],
      buttonAr: "ابدأ مجاناً",
      buttonEn: "Start for Free",
      isPopular: false,
      btnClass: "bento-btn"
    },
    {
      id: "pro",
      nameAr: "باقة المحترفين",
      nameEn: "Pro Plan",
      price: "$29",
      periodAr: "/ شهرياً",
      periodEn: "/ month",
      descAr: "للمبدعين وصناع المحتوى المحترفين.",
      descEn: "For professional creators and content makers.",
      featuresAr: [
        "دقائق غير محدودة للصوت",
        "أصوات ذكاء اصطناعي مميزة",
        "توليد صور بجودة 4K",
        "أولوية في الدعم الفني",
        "إزالة العلامة المائية"
      ],
      featuresEn: [
        "Unlimited Voice mins",
        "Premium AI Voices",
        "4K Image Generation",
        "Priority Support",
        "Remove Watermark"
      ],
      buttonAr: "اشترك الآن",
      buttonEn: "Subscribe Now",
      isPopular: true,
      btnClass: "bento-btn-accent"
    },
    {
      id: "enterprise",
      nameAr: "باقة الشركات",
      nameEn: "Enterprise",
      price: "$99",
      periodAr: "/ شهرياً",
      periodEn: "/ month",
      descAr: "للفرق والمؤسسات الكبيرة.",
      descEn: "For teams and large organizations.",
      featuresAr: [
        "كل ميزات باقة المحترفين",
        "وصول API كامل",
        "مساحة عمل مشتركة للفرق",
        "مدير حساب مخصص",
        "دعم فني 24/7"
      ],
      featuresEn: [
        "All Pro Features",
        "Full API Access",
        "Team Workspace",
        "Dedicated Manager",
        "24/7 Support"
      ],
      buttonAr: "تواصل معنا",
      buttonEn: "Contact Us",
      isPopular: false,
      btnClass: "bento-btn"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header Section */}
      <div className="mb-16 text-center relative mt-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-bento-accent)] rounded-full blur-[150px] opacity-[0.1] pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-bento-text)] tracking-tight mb-4 relative z-10">
          {language === 'ar' ? 'خطط مرنة تناسب طموحك' : 'Flexible Plans for Your Ambition'}
        </h1>
        <p className="text-[var(--color-bento-muted)] text-lg max-w-2xl mx-auto relative z-10">
          {language === 'ar' 
            ? 'اختر الباقة الأنسب لاحتياجاتك واستفد من القوة الكاملة للذكاء الاصطناعي.' 
            : 'Choose the best plan for your needs and unleash the full power of AI.'}
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4 md:px-0">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`bento-card p-8 flex flex-col relative ${plan.isPopular ? 'border-[var(--color-bento-accent)] transform md:-translate-y-4 shadow-[0_10px_40px_rgba(100,100,250,0.15)]' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bento-accent)] text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg">
                {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
              </div>
            )}
            
            <h3 className="text-xl font-bold text-[var(--color-bento-text)] mb-2">
              {language === 'ar' ? plan.nameAr : plan.nameEn}
            </h3>
            <p className="text-sm text-[var(--color-bento-muted)] mb-6 h-10">
              {language === 'ar' ? plan.descAr : plan.descEn}
            </p>
            
            <div className="mb-8 flex items-baseline">
              <span className="text-4xl font-extrabold text-[var(--color-bento-text)]">{plan.price}</span>
              <span className="text-sm text-[var(--color-bento-muted)] ml-2">{language === 'ar' ? plan.periodAr : plan.periodEn}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {(language === 'ar' ? plan.featuresAr : plan.featuresEn).map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-[var(--color-bento-muted)]">
                  <i className="fas fa-check-circle text-[var(--color-bento-accent)] mt-1 ml-3 mr-3"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${plan.btnClass}`}>
              {language === 'ar' ? plan.buttonAr : plan.buttonEn}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
