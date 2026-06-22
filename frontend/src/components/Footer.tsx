"use client";
import { Zap } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Link } from "../i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.get('/api/platform/social-links')
      .then(res => setSocialLinks(res.data))
      .catch(console.error);
  }, []);

  const footerLinks = {
    [t('products.title')]: [
      { label: t.raw('products.links')[0], href: "/tools#voice-to-text" },
      { label: t.raw('products.links')[1], href: "/tools#text-to-voice" }
    ],
    [t('company.title')]: [
      { label: t.raw('company.links')[0], href: "/pages/about-us" },
      { label: t.raw('company.links')[1], href: "/#blog" },
      { label: t.raw('company.links')[2], href: "/#contact" }
    ],
    [t('legal.title')]: [
      { label: t.raw('legal.links')[0], href: "/pages/privacy-policy" }
    ],
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'twitter': return '𝕏';
      case 'linkedin': return 'in';
      case 'youtube': return '▶';
      case 'email': return '@';
      case 'facebook': return 'f';
      case 'instagram': return 'ig';
      default: return '🔗';
    }
  };

  return (
    <footer className="relative bg-[#06000f] border-t border-white/10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/images/logo.png" alt="NexMedia" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-violet-500/30" />
              <span className="text-white font-bold text-xl">
                <span className="text-violet-400">Nex</span>Media
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              {t('desc')}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {Object.entries(socialLinks).map(([name, url]) => (
                url ? (
                  <a
                    key={name}
                    href={url.startsWith('http') || url.startsWith('mailto') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-300 text-xs font-bold"
                  >
                    {getSocialIcon(name)}
                  </a>
                ) : null
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div className="text-white font-semibold mb-4 text-sm">{title}</div>
              <ul className="space-y-2.5">
                {links.map((link: { label: string, href: string }) => (
                  <li key={link.label}>
                    <Link
                      href={link.href as any}
                      className="text-white/40 text-sm hover:text-white/80 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} {t('rights')}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

