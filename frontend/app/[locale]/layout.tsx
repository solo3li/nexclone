import "../globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../src/i18n/routing';

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { MaintenanceScreen } from "../../components/MaintenanceScreen";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
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
    alternates: {
      languages: {
        'ar': `https://nexclone.com/ar`,
        'en': `https://nexclone.com/en`,
      },
    },
  };
}

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
    const apiUrl = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:8080';
    console.log("Fetching public settings from:", apiUrl);
    const res = await fetch(`${apiUrl}/api/settings/public`, { next: { revalidate: 60 } });
    console.log("Fetch public settings response status:", res.status);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch public settings:", error);
    return null;
  }
}

import { GoogleAuthProviderWrapper } from "../../components/GoogleAuthProviderWrapper";
import { AuthSessionProvider } from "../../src/components/AuthSessionProvider";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M3QMV7SP');`
          }}
        />
      </head>
      <body className={`bg-[#0a0015] font-sans antialiased text-white overflow-x-hidden ${locale === 'ar' ? 'font-cairo' : 'font-inter'}`}>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M3QMV7SP" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <GoogleAuthProviderWrapper clientId={googleClientId}>
              {isMaintenanceMode ? (
                <MaintenanceScreen endDate={maintenanceEndDate} />
              ) : (
                children
              )}
            </GoogleAuthProviderWrapper>
          </AuthSessionProvider>
        </NextIntlClientProvider>
        {/* Unregister Service Worker and Clear Cache */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) caches.delete(name);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
