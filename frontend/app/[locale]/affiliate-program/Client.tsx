"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useAppStore } from "@/store/useAppStore";
import { useAffiliateStore } from "@/store/useAffiliateStore";
import { DollarSign, Link as LinkIcon, Gift, ArrowRight, ArrowLeft, BarChart3, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AffiliateProgramClient() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const router = useRouter();
  
  const { isAuthenticated, isInitializing } = useAppStore();
  const { profile, fetchProfile, error } = useAffiliateStore();

  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      fetchProfile();
    }
  }, [isAuthenticated, isInitializing, fetchProfile]);

  useEffect(() => {
    // If the user has an active profile and it loaded without error, redirect them to the dashboard directly
    if (profile && !error) {
      router.push('/affiliate');
    }
  }, [profile, error, router]);

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col font-sans overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col">
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/90">
                {isRtl ? 'أفضل برنامج تسويق بالعمولة للذكاء الاصطناعي' : 'Best AI Affiliate Program'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              {isRtl ? 'سوّق لأدوات الذكاء الاصطناعي واربح ' : 'Promote AI Tools and Earn '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {isRtl ? 'عمولة 20% متكررة!' : '20% Recurring Commission!'}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {isRtl 
                ? 'انضم إلى شبكة المسوقين في NexMedia. احصل على رابطك الخاص واربح 20% على كل اشتراك شهري أو سنوي طوال فترة بقاء العميل.'
                : 'Join the NexMedia affiliate network. Get your unique link and earn 20% on every monthly or annual subscription for the lifetime of the customer.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/affiliate"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all duration-300 hover:-translate-y-1"
              >
                {isRtl ? 'انضم الآن مجاناً' : 'Join Now for Free'}
                <Arrow className={`w-5 h-5 transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features / How it works */}
        <section className="py-20 bg-white/5 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {isRtl ? 'لماذا تسوّق لمنصة NexMedia؟' : 'Why promote NexMedia?'}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: isRtl ? 'عمولة 20% متكررة' : '20% Recurring Commission',
                  desc: isRtl ? 'لا تربح مرة واحدة فقط! ستحصل على 20% كل شهر طالما أن العميل يجدد اشتراكه.' : 'Don\'t just earn once! You\'ll get 20% every month as long as the customer stays.'
                },
                {
                  icon: LinkIcon,
                  title: isRtl ? 'كوكيز لمدة 60 يوماً' : '60-Day Cookie Life',
                  desc: isRtl ? 'إذا زار العميل الموقع من رابطك واشترك خلال 60 يوماً، ستُحسب العمولة لك.' : 'If a user clicks your link and subscribes within 60 days, you get the commission.'
                },
                {
                  icon: BarChart3,
                  title: isRtl ? 'لوحة تحكم احترافية' : 'Professional Dashboard',
                  desc: isRtl ? 'تتبع نقراتك، تسجيلاتك، وعمولاتك بشكل لحظي عبر لوحة تحكم مخصصة وشفافة.' : 'Track your clicks, sign-ups, and commissions in real-time with our transparent dashboard.'
                }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
