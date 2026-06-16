import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "NEX MEDIA AI - الإبداع المدعوم بالذكاء الاصطناعي صار أسهل",
  description: "منصة نكس ميديا للذكاء الاصطناعي - الإبداع صار أسهل",
};

import AuthProvider from "@/components/AuthProvider";
import LanguageWrapper from "@/components/LanguageWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="/static/home/css/lang-switcher.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={`${cairo.className}`}>
        <AuthProvider>
          <LanguageWrapper>
          <AppShell>
              {children}
          </AppShell>
          </LanguageWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
