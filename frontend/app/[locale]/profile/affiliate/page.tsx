"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { AlertCircle } from "lucide-react";

export default function AffiliateDashboard() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [stats, setStats] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [payoutDetails, setPayoutDetails] = useState("");
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { isAuthenticated, user } = useAppStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [statsRes, refsRes, transRes] = await Promise.all([
        api.get("/api/affiliate/stats"),
        api.get("/api/affiliate/referrals"),
        api.get("/api/affiliate/transactions")
      ]);
      setStats(statsRes.data);
      setReferrals(refsRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (user?.id) {
      const link = `${window.location.origin}/register?ref=${user.id}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestingPayout(true);
    setMessage(null);
    try {
      const res = await api.post("/api/affiliate/payout", {
        amount: parseFloat(payoutAmount),
        method: payoutMethod,
        details: payoutDetails
      });
      setMessage({ type: "success", text: res.data.message || "Payout requested successfully." });
      setPayoutAmount("");
      setPayoutMethod("");
      setPayoutDetails("");
      fetchData(); // Refresh balance and history
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to request payout." });
    } finally {
      setRequestingPayout(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h3 className="text-white/60 font-medium mb-2">Total Referrals</h3>
          <p className="text-4xl font-bold text-white">{stats?.totalReferrals || 0}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h3 className="text-white/60 font-medium mb-2">Credits Earned</h3>
          <p className="text-4xl font-bold text-white">{stats?.estimatedCreditsEarned || 0}</p>
          <p className="text-xs text-white/40 mt-1">Estimated total credits from referrals.</p>
        </div>
        {stats?.isCashAffiliate && (
          <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 p-6 rounded-3xl relative overflow-hidden">
            <h3 className="text-white/80 font-medium mb-2">Cash Balance</h3>
            <p className="text-4xl font-bold text-white">{stats?.cashBalance?.toFixed(2) || "0.00"} EGP</p>
            <p className="text-xs text-violet-300 mt-1">Available for payout.</p>
          </div>
        )}
      </div>

      {/* Referral Link */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-white mb-2">Your Referral Link</h2>
        <p className="text-white/60 mb-6">Share this link with your friends to earn credits when they sign up!</p>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            readOnly
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user?.id}`}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`px-6 py-4 rounded-xl transition-colors font-semibold text-white whitespace-nowrap ${
              copied ? "bg-green-600 hover:bg-green-700" : "bg-violet-600 hover:bg-violet-700"
            }`}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-blue-900/20 border border-blue-500/20 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-semibold mb-1">
              {isRtl ? "ملاحظة هامة حول نظام الدعوات" : "Important Note on Referrals"}
            </h4>
            <p className="text-white/60 text-sm">
              {isRtl 
                ? "لحماية النظام من الاحتيال، لن يتم احتساب الإحالة إذا قام الشخص بالتسجيل من نفس جهازك أو من نفس شبكة الإنترنت (IP) التي تستخدمها."
                : "To protect the system from fraud, referrals will not be counted if the person registers from the same device or IP address you are using."}
            </p>
          </div>
        </div>

        {!stats?.isCashAffiliate && (
          <div className="mt-6 p-4 rounded-xl bg-violet-900/20 border border-violet-500/20">
            <h4 className="text-violet-300 font-semibold mb-1">Are you a content creator?</h4>
            <p className="text-white/60 text-sm">Contact our support to upgrade your account to a Cash Affiliate and earn real money from your referrals' payments!</p>
          </div>
        )}
      </div>

      {/* Cash Affiliate Section */}
      {stats?.isCashAffiliate && (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-6">Request Payout</h2>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleRequestPayout} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Amount (EGP)</label>
              <input
                type="number"
                required
                min="50"
                step="0.01"
                max={stats?.cashBalance}
                value={payoutAmount}
                onChange={e => setPayoutAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Method</label>
              <select
                required
                value={payoutMethod}
                onChange={e => setPayoutMethod(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="">Select Method...</option>
                <option value="Vodafone Cash">Vodafone Cash</option>
                <option value="InstaPay">InstaPay</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Account Details</label>
              <input
                type="text"
                required
                placeholder="Phone number, email, or IBAN"
                value={payoutDetails}
                onChange={e => setPayoutDetails(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                disabled={requestingPayout || stats?.cashBalance <= 0}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold"
              >
                {requestingPayout ? "Requesting..." : "Submit Payout Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lists (Transactions & Referrals) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {stats?.isCashAffiliate && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Payout History</h3>
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              {transactions.length === 0 ? (
                <p className="p-6 text-center text-white/40">No transactions yet.</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {transactions.map((t, i) => (
                    <div key={i} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{t.type}</p>
                        <p className="text-xs text-white/40">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${t.type === 'Commission' ? 'text-green-400' : 'text-white'}`}>
                          {t.type === 'Commission' ? '+' : '-'}{t.amount.toFixed(2)}
                        </p>
                        <p className={`text-xs ${
                          t.status === 'Completed' ? 'text-green-400' : 
                          t.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{t.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={stats?.isCashAffiliate ? "" : "lg:col-span-2"}>
          <h3 className="text-xl font-bold text-white mb-4">Referred Users</h3>
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            {referrals.length === 0 ? (
              <p className="p-6 text-center text-white/40">You haven't referred anyone yet.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {referrals.map((r, i) => (
                  <div key={i} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {r.fullName || 'User'}
                        {r.status === "Rejected" && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                            {isRtl ? "غير محتسب" : "Not Counted"}
                          </span>
                        )}
                        {r.status === "Active" && (
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                            {isRtl ? "محتسب" : "Counted"}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-white/40">{r.email}</p>
                      {r.reason && (
                        <p className="text-[10px] text-red-400/80 mt-1">{isRtl && r.reason.includes("same device") ? "تم التسجيل من نفس الجهاز أو الشبكة" : r.reason}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-white/40">
                      Joined: {new Date(r.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
