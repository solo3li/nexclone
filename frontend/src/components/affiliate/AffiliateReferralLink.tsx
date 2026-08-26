'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Link } from 'lucide-react';
import { AffiliateProfile } from '@/store/useAffiliateStore';

interface Props {
  profile: AffiliateProfile;
  isRtl: boolean;
}

export default function AffiliateReferralLink({ profile, isRtl }: Props) {
  const [copied, setCopied] = useState(false);
  const [dynamicLink, setDynamicLink] = useState(profile.referralLink);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDynamicLink(`${window.location.origin}/register?ref=${profile.referralCode}`);
    }
  }, [profile.referralCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile ID */}
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
        <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xl font-bold">
          🤝
        </div>
        <div>
          <div className="text-xs text-white/40">{isRtl ? 'معرف الإحالة' : 'Affiliate ID'}</div>
          <div className="text-white font-bold text-lg font-mono">{profile.affiliateDisplayId}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-white/40">{isRtl ? 'رمز الإحالة' : 'Referral Code'}</div>
          <div className="text-violet-400 font-black font-mono text-xl">{profile.referralCode}</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-semibold">
            {isRtl ? 'رابط الإحالة الخاص بك' : 'Your Referral Link'}
          </h3>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-violet-300 overflow-hidden text-ellipsis whitespace-nowrap">
            {dynamicLink}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
              copied
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
            }`}
          >
            {copied ? (
              <><Check className="w-4 h-4" />{isRtl ? 'تم النسخ!' : 'Copied!'}</>
            ) : (
              <><Copy className="w-4 h-4" />{isRtl ? 'نسخ الرابط' : 'Copy Link'}</>
            )}
          </button>
        </div>

        <p className="text-white/30 text-xs mt-4">
          {isRtl
            ? 'شارك هذا الرابط مع أصدقائك. عندما يشتركون، ستحصل على عمولة.'
            : 'Share this link with your audience. When they subscribe, you earn a commission.'}
        </p>
      </div>

      {/* Stats quick view */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-violet-400">
            {new Date(profile.createdAt).getFullYear()}
          </div>
          <div className="text-xs text-white/40 mt-1">{isRtl ? 'عضو منذ' : 'Member Since'}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-fuchsia-400">
            {profile.isActive ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'غير نشط' : 'Inactive')}
          </div>
          <div className="text-xs text-white/40 mt-1">{isRtl ? 'حالة الحساب' : 'Account Status'}</div>
        </div>
      </div>
    </div>
  );
}
