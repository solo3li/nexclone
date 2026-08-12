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
  FileText,
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
      name: isRtl ? "تذاكر الدعم" : "Support Tickets",
      href: `/profile/tickets`,
      icon: LifeBuoy,
      exact: false
    },
    {
      name: isRtl ? "الاشتراكات والفواتير" : "Subscriptions & Invoices",
      href: `/profile/invoices`,
      icon: FileText, // Can use FileText if imported, but History is already imported. Let's add FileText import.
      exact: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col selection:bg-fuchsia-500/30">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
