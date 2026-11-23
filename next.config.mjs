/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/oq',
        destination: '/',
      },
      {
        source: '/oq/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
