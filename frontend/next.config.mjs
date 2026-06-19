import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = { allowedDevOrigins: ['178.62.192.74', 'localhost'] };

export default withNextIntl(nextConfig);
