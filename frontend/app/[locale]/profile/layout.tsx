"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard,
  History,
  LifeBuoy,
  Share2,
  Settings,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAppStore();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    logout();
    router.push(`/${locale}`);
  };

  const navItems = [
    {
      name: isRtl ? "نظرة عامة" : "Overview",
      href: `/profile`,
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: isRtl ? "سجل العمليات" : "History",
      href: `/history`,
      icon: History,
      exact: false
    },
    {
      name: isRtl ? "برنامج الشركاء" : "Affiliate",
      href: `/profile/affiliate`,
      icon: Share2,
      exact: false
    },
    {
      name: isRtl ? "تذاكر الدعم" : "Support Tickets",
      href: `/profile/tickets`,
      icon: LifeBuoy,
      exact: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col selection:bg-fuchsia-500/30">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 flex flex-col gap-6 shrink-0">
          {/* User Profile Summary */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/10 mb-4 overflow-hidden border-2 border-white/20 flex items-center justify-center">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-8 h-8 text-white/50" />
              )}
            </div>
            <h2 className="text-lg font-bold text-white truncate">{user?.fullName || (isRtl ? "مستخدم" : "User")}</h2>
            <p className="text-white/50 text-sm truncate mt-1">{user?.email}</p>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl flex flex-col gap-2">
            {navItems.map((item) => {
              // Note: using strict path matching since href includes locale in Link components often, but here href is used in Link without locale prefix because next-intl Link handles it.
              // We'll check if pathname ends with the route or matches it.
              const isActive = item.exact 
                ? pathname === `/${locale}${item.href}`
                : pathname.startsWith(`/${locale}${item.href}`);

              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/60"}`} />
                  {item.name}
                </Link>
              );
            })}

            <div className="h-px bg-white/10 my-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-rose-400 hover:bg-rose-500/10 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              {isRtl ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 min-w-0">
          {children}
        </section>

      </main>

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
