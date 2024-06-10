/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  output: 'standalone',
  assetPrefix: '/manage',
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: '/manage/_next/:path*',
        destination: '/_next/:path*'
      },
      {
        source: '/manage/api/:path*',
        destination: 'http://www.nawriterdev.co.kr/manage/api/:path*'
      }
    ];
  }
};

export default nextConfig;
