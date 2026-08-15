"use client";

import { useLocale } from "next-intl";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col selection:bg-violet-500/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 relative z-10 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-pink-500" />
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          
          <div className="space-y-8 text-white/70 leading-relaxed">
            {isRtl ? (
              <>
                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">1. جمع المعلومات</h2>
                  <p>نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل في المنصة، مثل الاسم، وعنوان البريد الإلكتروني، ورقم الهاتف.</p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">2. استخدام المعلومات</h2>
                  <p>نستخدم معلوماتك لتقديم وتحسين خدماتنا، وتخصيص تجربتك، وإرسال تحديثات هامة حول حسابك أو خدماتنا.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">3. حماية البيانات</h2>
                  <p>نحن نتخذ إجراءات أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.</p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">4. التغييرات على هذه السياسة</h2>
                  <p>قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنعلمك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة.</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">1. Information Collection</h2>
                  <p>We collect information you provide directly to us when you register on the platform, such as your name, email address, and phone number.</p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">2. Use of Information</h2>
                  <p>We use your information to provide and improve our services, personalize your experience, and send you important updates about your account or our services.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">3. Data Protection</h2>
                  <p>We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-white mb-3">4. Changes to this Policy</h2>
                  <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
