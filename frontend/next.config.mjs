import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '178.62.192.74', 
    'localhost',
    '127.0.0.1',
    '*.trycloudflare.com',
    'optimize-brief-configuring-promo.trycloudflare.com',
    'playstation-malpractice-physical-development.trycloudflare.com',
    '*.nip.io',
    'nexclone-dev.169.58.204.169.nip.io',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      // Serve sw.js with correct content-type and no cache
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://nexclone-backend:8080/api/:path*',
        },
        {
          source: '/nexmedia/:path*',
          destination: 'http://nexclone-dev-minio:9000/nexmedia/:path*',
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);


