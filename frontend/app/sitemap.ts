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
    '/tools/motion-control',
    '/tools/text-to-video',
    '/tools/text-to-image',
    '/tools/reference-to-video'
  ];

  const sitemapEntries = routes.map((route) => ({
    url: `${baseUrl}/ar${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en${route}`,
        ar: `${baseUrl}/ar${route}`,
      },
    },
  }));

  return sitemapEntries;
}
