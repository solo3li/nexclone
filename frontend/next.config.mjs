import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '178.62.192.74',
    'localhost',
    '127.0.0.1',
    '*.trycloudflare.com',
    '*.nip.io',
    'dev.169.58.204.169.nip.io',
    'api.169.58.204.169.nip.io',
    'https://staging.69.58.204.169.nip.io/',
    'uggu.space',
    'www.uggu.space'
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
          destination: 'http://127.0.0.1:5000/api/:path*',
        },
        {
          source: '/nexmedia/:path*',
          destination: 'http://127.0.0.1:9001/nexmedia/:path*',
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);


