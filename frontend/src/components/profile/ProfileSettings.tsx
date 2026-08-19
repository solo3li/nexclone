'use client';

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Lock, Upload, Save, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppStore } from "../../../store/useAppStore";

interface Props {
  user: any;
  isRtl: boolean;
  updateProfile: (data: FormData) => Promise<any>;
  changePassword: (data: any) => Promise<any>;
}

export default function ProfileSettings({ user, isRtl, updateProfile, changePassword }: Props) {
  const t = useTranslations("Profile");
  const { logoutAll } = useAppStore();

  // Settings State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.imageUrl || null);
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && !fullName) {
      setFullName(user.fullName || "");
      setImagePreview(user.imageUrl || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setProfileMessage(null);
    }
  };

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const formData = new FormData();
      formData.append("FullName", fullName);
      if (profileImage) {
        formData.append("ProfileImage", profileImage);
      }

      const res = await updateProfile(formData);
      
      if (res) {
         setFullName(res.fullName);
         setImagePreview(res.imageUrl);
      }
      setProfileMessage({ type: 'success', text: isRtl ? "تم التحديث بنجاح" : "Profile updated successfully." });
    } catch (err) {
      console.error(err);
      setProfileMessage({ type: 'error', text: isRtl ? "حدث خطأ أثناء التحديث" : "An error occurred while updating the profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return;
    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: isRtl ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setPasswordMessage({ type: 'error', text: isRtl ? "كلمة المرور الحالية غير صحيحة" : "Incorrect current password." });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <UserIcon className="w-6 h-6 text-fuchsia-400" />
          {isRtl ? "إعدادات الحساب" : "Account Settings"}
        </h2>

        <div className="space-y-6">
          {/* Profile Picture Upload */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-white/70 mb-3">
              {isRtl ? "الصورة الشخصية" : "Profile Picture"}
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button 
                type="button"
                aria-label={isRtl ? "تغيير الصورة الشخصية" : "Change profile picture"}
                className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#0a0015]" 
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-white/30" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </button>
              <div className="flex-1">
                <p className="text-sm text-white/50 mb-3">
                  {isRtl ? "الصور المدعومة: JPG, PNG. أقصى حجم 2MB." : "Supported formats: JPG, PNG. Max size 2MB."}
                </p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/30">
                  {isRtl ? "اختر صورة" : "Choose Image"}
                </button>
                <input 
                  id="profileImage"
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-white/70 mb-2">
              {isRtl ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0a0015] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
              placeholder={isRtl ? "أدخل اسمك" : "Enter your name"}
            />
          </div>

          {/* Profile Message Feedback */}
          {profileMessage && (
            <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${profileMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`} role="alert">
              {profileMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={savingProfile || (!fullName.trim() && !profileImage)}
              className="px-6 py-3 bg-white text-[#0a0015] font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0a0015]"
            >
              {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isRtl ? "حفظ التغييرات" : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Password Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Lock className="w-6 h-6 text-violet-400" />
          {isRtl ? "تغيير كلمة المرور" : "Change Password"}
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-white/70 mb-2">
              {isRtl ? "كلمة المرور الحالية" : "Current Password"}
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#0a0015] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-white/70 mb-2">
              {isRtl ? "كلمة المرور الجديدة" : "New Password"}
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0a0015] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          {/* Password Message Feedback */}
          {passwordMessage && (
            <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`} role="alert">
              {passwordMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={savingPassword || !currentPassword || !newPassword}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {savingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isRtl ? "تحديث كلمة المرور" : "Update Password"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Session Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <LogOut className="w-6 h-6 text-rose-400" />
          {isRtl ? "إدارة الجلسات" : "Session Management"}
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
             <p className="text-white/70 text-sm">
               {isRtl ? "في حالة فقدان هاتفك المحمول أو الشك في وجود نشاط غير مصرح به، يمكنك تسجيل الخروج من جميع الأجهزة المتصلة بحسابك فوراً." : "If you lost your phone or suspect unauthorized access, you can immediately log out from all connected devices."}
             </p>
          </div>
          <button
             onClick={() => {
                if (confirm(isRtl ? "هل أنت متأكد من رغبتك في تسجيل الخروج من جميع الأجهزة؟" : "Are you sure you want to log out from all devices?")) {
                  logoutAll();
                }
             }}
             className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold rounded-xl hover:bg-rose-500/20 transition-colors flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
             <LogOut className="w-5 h-5" />
             {isRtl ? "الخروج من جميع الأجهزة" : "Logout from all devices"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
