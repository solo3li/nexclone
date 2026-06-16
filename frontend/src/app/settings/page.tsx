"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Settings() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setCountry(user.country || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ fullName, country });
      alert("تم تحديث الملف الشخصي بنجاح!");
    } catch (err: any) {
      alert("فشل تحديث الملف الشخصي.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      alert("تم تغيير كلمة المرور بنجاح!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.message || "فشل تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in" dir="rtl">
      
      <div className="mb-8 text-center md:text-right">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">الإعدادات</h1>
        <p className="text-[var(--color-bento-muted)] mt-1 text-sm">إدارة حسابك، التفضيلات، ومفاتيح API.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav for Settings */}
        <div className="w-full md:w-64 space-y-1 ml-0 md:ml-8">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "profile" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-user w-6"></i> الملف الشخصي
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "billing" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-credit-card w-6"></i> الفوترة والباقات
          </button>
          <button 
            onClick={() => setActiveTab("api")}
            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "api" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-key w-6"></i> مفاتيح API
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "notifications" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-bell w-6"></i> الإشعارات
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">معلومات الملف الشخصي</h2>
              
              <div className="flex items-center space-x-6 space-x-reverse mb-8">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] overflow-hidden border-2 border-[var(--color-bento-border)]">
                  <img src={user?.imageUrl || "/static/img/avatar.jpg"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="bento-btn px-4 py-2 text-sm font-bold">تغيير الصورة</button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">الاسم الكامل</label>
                  <input 
                    type="text" 
                    className="bento-input w-full text-right" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    className="bento-input w-full opacity-50 cursor-not-allowed text-right text-left" 
                    value={user?.email || ""} 
                    disabled 
                    dir="ltr"
                  />
                  <p className="text-[10px] text-[var(--color-bento-muted)] mt-1">لا يمكن تغيير البريد الإلكتروني.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">البلد</label>
                  <input 
                    type="text" 
                    className="bento-input w-full text-right" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--color-bento-border)]">
                  <button type="submit" disabled={isLoading} className="bento-btn-primary px-6 py-2 text-sm disabled:opacity-50">
                    {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </button>
                </div>
              </form>

              {/* Password Change Section */}
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4 mt-12">الأمان</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">كلمة المرور الحالية</label>
                  <input 
                    type="password" 
                    className="bento-input w-full text-right text-left" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    className="bento-input w-full text-right text-left" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    dir="ltr"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="bento-btn px-6 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:border-red-500/50 transition-colors disabled:opacity-50">
                    {isLoading ? "جاري التحديث..." : "تغيير كلمة المرور"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">الباقة والفوترة</h2>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-2xl mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">باقة المحترفين</h3>
                    <p className="text-sm text-blue-400 mt-1">نشط حتى 24 نوفمبر 2024</p>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-extrabold text-white">29$<span className="text-sm text-[var(--color-bento-muted)]">/شهر</span></div>
                  </div>
                </div>
              </div>

              <button className="bento-btn px-6 py-2 text-sm">إدارة الاشتراك</button>
            </div>
          )}

          {activeTab === "api" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">مفاتيح API</h2>
              <p className="text-sm text-[var(--color-bento-muted)] mb-6">استخدم هذه المفاتيح لمصادقة طلبات API الخاصة بك. لا تشاركها علنًا.</p>
              
              <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)] flex justify-between items-center mb-6">
                <div>
                  <div className="text-xs text-[var(--color-bento-muted)] font-bold mb-1 uppercase tracking-wider">المفتاح السري</div>
                  <div className="font-mono text-sm text-white text-left" dir="ltr">sk_live_••••••••••••••••••••••••</div>
                </div>
                <button className="bento-btn px-4 py-2 text-sm text-white mr-4">نسخ</button>
              </div>

              <button className="bento-btn-primary px-6 py-2 text-sm">إنشاء مفتاح جديد</button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">تفضيلات الإشعارات</h2>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                  <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 rounded bg-[#1a1a1a] border-[var(--color-bento-border)] text-blue-500" />
                  <span className="text-sm font-bold text-white">أرسل لي بريدًا إلكترونيًا عند اكتمال عملية التوليد</span>
                </label>
                <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                  <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 rounded bg-[#1a1a1a] border-[var(--color-bento-border)] text-blue-500" />
                  <span className="text-sm font-bold text-white">أرسل لي تقارير الاستخدام الأسبوعية</span>
                </label>
                <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-5 w-5 rounded bg-[#1a1a1a] border-[var(--color-bento-border)] text-blue-500" />
                  <span className="text-sm font-bold text-white">تحديثات المنتج والنشرات الإخبارية</span>
                </label>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-bento-border)]">
                <button className="bento-btn-primary px-6 py-2 text-sm">حفظ التفضيلات</button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
