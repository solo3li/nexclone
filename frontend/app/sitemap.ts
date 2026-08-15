import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  const routes = [
    '',
    '/pricing',
    '/blog',
    '/tools/text-to-voice',
    '/tools/voice-to-text',
    '/tools/image-to-video',
    '/tools/advanced-lip-sync',
    '/tools/motion-control'
  ];

  const sitemapEntries = routes.map((route) => ({
    url: \/ar\,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
    alternates: {
      languages: {
        en: \/en\,
        ar: \/ar\,
      },
    },
  }));

  return sitemapEntries;
}
