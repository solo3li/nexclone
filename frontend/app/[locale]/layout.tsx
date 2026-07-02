import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Cairo, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../src/i18n/routing';

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { MaintenanceScreen } from "../../components/MaintenanceScreen";

export const metadata: Metadata = {
  title: "NexMedia - AI Tools Platform",
  description: "Advanced AI tools platform - Text to Voice, Voice to Text, and more powered by AI",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NexMedia",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0015" },
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

async function getPublicSettings() {
  try {
    // Determine internal URL for API fetch
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const res = await fetch(`${apiUrl}/api/settings/public`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch public settings:", error);
    return null;
  }
}

import { GoogleAuthProviderWrapper } from "../../components/GoogleAuthProviderWrapper";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getPublicSettings();
  const isMaintenanceMode = settings?.isMaintenanceMode === true;
  const maintenanceEndDate = settings?.maintenanceEndDate;
  const googleClientId = settings?.googleClientId;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${cairo.variable} ${inter.variable} scroll-smooth`}>
      <body className={`bg-[#0a0015] font-sans antialiased text-white overflow-x-hidden ${locale === 'ar' ? 'font-cairo' : 'font-inter'}`}>
        <NextIntlClientProvider messages={messages}>
          <GoogleAuthProviderWrapper clientId={googleClientId}>
            {isMaintenanceMode ? (
              <MaintenanceScreen endDate={maintenanceEndDate} />
            ) : (
              children
            )}
          </GoogleAuthProviderWrapper>
        </NextIntlClientProvider>
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(reg) {
                      reg.addEventListener('updatefound', function() {
                        var newWorker = reg.installing;
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                          }
                        });
                      });
                    })
                    .catch(function(err) { console.log('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
