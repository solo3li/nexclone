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
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-[var(--color-bento-muted)] mt-1 text-sm">Manage your account, preferences, and API keys.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav for Settings */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "profile" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-user w-6"></i> Profile
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "billing" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-credit-card w-6"></i> Billing & Plan
          </button>
          <button 
            onClick={() => setActiveTab("api")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "api" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-key w-6"></i> API Keys
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === "notifications" ? "bg-white text-black" : "text-[var(--color-bento-muted)] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            <i className="fas fa-bell w-6"></i> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">Profile Information</h2>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] overflow-hidden border-2 border-[var(--color-bento-border)]">
                  <img src={user?.imageUrl || "/static/img/avatar.jpg"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="bento-btn px-4 py-2 text-sm font-bold">Change Avatar</button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="bento-input w-full" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="bento-input w-full opacity-50 cursor-not-allowed" 
                    value={user?.email || ""} 
                    disabled 
                  />
                  <p className="text-[10px] text-[var(--color-bento-muted)] mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Country</label>
                  <input 
                    type="text" 
                    className="bento-input w-full" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--color-bento-border)]">
                  <button type="submit" disabled={isLoading} className="bento-btn-primary px-6 py-2 text-sm disabled:opacity-50">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>

              {/* Password Change Section */}
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4 mt-12">Security</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    className="bento-input w-full" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    className="bento-input w-full" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="bento-btn px-6 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:border-red-500/50 transition-colors disabled:opacity-50">
                    {isLoading ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">Plan & Billing</h2>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-2xl mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">Pro Plan</h3>
                    <p className="text-sm text-blue-400 mt-1">Active until Nov 24, 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-white">$29<span className="text-sm text-[var(--color-bento-muted)]">/mo</span></div>
                  </div>
                </div>
              </div>

              <button className="bento-btn px-6 py-2 text-sm">Manage Subscription</button>
            </div>
          )}

          {activeTab === "api" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">API Keys</h2>
              <p className="text-sm text-[var(--color-bento-muted)] mb-6">Use these keys to authenticate your API requests. Do not share them publicly.</p>
              
              <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)] flex justify-between items-center mb-6">
                <div>
                  <div className="text-xs text-[var(--color-bento-muted)] font-bold mb-1 uppercase tracking-wider">Secret Key</div>
                  <div className="font-mono text-sm text-white">sk_live_••••••••••••••••••••••••</div>
                </div>
                <button className="bento-btn px-4 py-2 text-sm text-white">Copy</button>
              </div>

              <button className="bento-btn-primary px-6 py-2 text-sm">Generate New Key</button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bento-card p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-bento-border)] pb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 rounded bg-[#1a1a1a] border-[var(--color-bento-border)] text-blue-500" />
                  <span className="text-sm font-bold text-white">Email me when a generation is complete</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 rounded bg-[#1a1a1a] border-[var(--color-bento-border)] text-blue-500" />
                  <span className="text-sm font-bold text-white">Send me weekly usage reports</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-5 w-5 rounded bg-[#1a1a1a] border-[var(--color-bento-border)] text-blue-500" />
                  <span className="text-sm font-bold text-white">Product updates and newsletters</span>
                </label>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-bento-border)]">
                <button className="bento-btn-primary px-6 py-2 text-sm">Save Preferences</button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
