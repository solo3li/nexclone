"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [billingCycle, setBillingCycle] = useState("month");

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-fade-in" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">نظرة عامة</h1>
          <p className="text-[var(--color-bento-muted)] mt-1 text-sm">مراقبة نشاط توليد الذكاء الاصطناعي ومساحة العمل الخاصة بك.</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="bento-btn w-10 h-10 flex items-center justify-center text-white">
            <i className="fas fa-bell"></i>
          </button>
          <button className="bento-btn-primary px-5 py-2 text-sm flex items-center">
            <i className="fas fa-plus ml-2 text-[10px]"></i> مشروع جديد
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* Welcome / Stats Card (Span 2 cols) */}
        <div className="bento-card col-span-1 md:col-span-2 p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          
          <div className="relative z-10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">مرحباً بعودتك.</h2>
            <p className="text-[var(--color-bento-muted)] text-sm max-w-md">مساحة العمل الخاصة بك تعمل بسلاسة. لقد استخدمت 25% من إجمالي رصيدك هذا الشهر.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-bento-muted)] font-bold mb-1">العمليات</p>
              <h3 className="text-2xl font-extrabold text-white">12,340</h3>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-bento-muted)] font-bold mb-1">الرصيد</p>
              <h3 className="text-2xl font-extrabold text-white">4,120 <span className="text-[10px] text-green-400 font-normal mr-1" dir="ltr">+12%</span></h3>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-bento-muted)] font-bold mb-1">الوقت الموفر</p>
              <h3 className="text-2xl font-extrabold text-white">45 س</h3>
            </div>
          </div>
        </div>

        {/* Quick Tools (Span 1 col) */}
        <div className="bento-card p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-10"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-bold text-white">أدوات الذكاء الاصطناعي</h3>
            <Link href="/dashboard" className="text-xs text-[var(--color-bento-muted)] hover:text-white">عرض الكل</Link>
          </div>
          
          <div className="space-y-3 flex-1 relative z-10">            <Link href="/voice-to-text" className="bento-btn p-3 flex items-center justify-between group">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 rounded-md bg-[#1a1a1a] flex items-center justify-center text-green-400 group-hover:bg-green-500/10">
                  <i className="fas fa-microphone text-xs"></i>
                </div>
                <span className="text-sm font-semibold text-white">تحويل الصوت إلى نص</span>
              </div>
              <i className="fas fa-arrow-left text-[10px] text-[var(--color-bento-muted)] group-hover:text-white transform group-hover:-translate-x-1 transition-all"></i>
            </Link>
            
            <Link href="/text-to-voice" className="bento-btn p-3 flex items-center justify-between group">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 rounded-md bg-[#1a1a1a] flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10">
                  <i className="fas fa-volume-up text-xs"></i>
                </div>
                <span className="text-sm font-semibold text-white">تحويل النص إلى صوت</span>
              </div>
              <i className="fas fa-arrow-left text-[10px] text-[var(--color-bento-muted)] group-hover:text-white transform group-hover:-translate-x-1 transition-all"></i>
            </Link>
          </div>
        </div>

        {/* Chart / Performance (Span 2 cols, row 2) */}
        <div className="bento-card col-span-1 md:col-span-2 p-6 flex flex-col relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white">رسم بياني للنشاط</h3>
            <select className="bg-transparent border border-[var(--color-bento-border)] rounded-md text-xs text-white p-1 outline-none mr-auto ml-0 text-left" dir="ltr">
              <option className="bg-[#0a0a0a]">هذا الأسبوع</option>
              <option className="bg-[#0a0a0a]">هذا الشهر</option>
            </select>
          </div>
          <div className="flex-1 w-full flex items-end justify-between px-2 pt-10 relative">
            {/* Fake grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-b border-r border-[var(--color-bento-border)] mr-6 pb-6">
              <div className="border-t border-[var(--color-bento-border)] opacity-30 w-full"></div>
              <div className="border-t border-[var(--color-bento-border)] opacity-30 w-full"></div>
              <div className="border-t border-[var(--color-bento-border)] opacity-30 w-full"></div>
            </div>
            
            {/* Fake Bars */}
            <div className="w-[10%] h-[40%] bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm z-10 mx-1"></div>
            <div className="w-[10%] h-[70%] bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm z-10 mx-1"></div>
            <div className="w-[10%] h-[50%] bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm z-10 mx-1"></div>
            <div className="w-[10%] h-[90%] bg-blue-500/80 border-t-2 border-blue-400 rounded-t-sm z-10 mx-1 relative shadow-[0_0_15px_rgba(59,130,246,0.3)]">
               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded">240</div>
            </div>
            <div className="w-[10%] h-[60%] bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm z-10 mx-1"></div>
            <div className="w-[10%] h-[30%] bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm z-10 mx-1"></div>
            <div className="w-[10%] h-[45%] bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm z-10 mx-1"></div>
          </div>
          <div className="flex justify-between w-full pl-2 pr-6 mt-3 text-[10px] font-bold text-[var(--color-bento-muted)] flex-row-reverse" dir="ltr">
            <span>الاثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span><span>السبت</span><span>الأحد</span>
          </div>
        </div>

        {/* Subscription/Mini Plan (Span 1 col) */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white">باقة المحترفين</h3>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded">نشط</span>
            </div>
            <p className="text-xs text-[var(--color-bento-muted)] mb-6">أنت على باقة المحترفين بنظام الدفع الشهري.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-[var(--color-bento-muted)] mb-1">
                <span>التخزين</span>
                <span className="text-white" dir="ltr">45 GB / 100 GB</span>
              </div>
              <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                <div className="h-full bg-white w-[45%]"></div>
              </div>
            </div>
            
            <Link href="/settings" className="bento-btn w-full py-2 text-xs font-bold flex items-center justify-center">
              إدارة الفوترة
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
