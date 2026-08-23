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
    'nexmediaai.com',
    'www.nexmediaai.com'
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
          source: '/nexmedia-files-zyavomezs0/:path*',
          destination: 'http://minio:9001/nexmedia-files-zyavomezs0/:path*',
        },
        {
          source: '/nexmedia/:path*',
          destination: 'http://minio:9001/nexmedia/:path*',
        },
        {
          source: '/mediaoss/:path*',
          destination: 'https://tempfile.mediaoss.bar/:path*',
        },
        {
          source: '/api/:path*',
          destination: 'http://backend:8080/api/:path*',
        },
        {
          source: '/nexmedia-ai-files/:path*',
          destination: 'http://minio:9001/nexmedia-ai-files/:path*',
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);


