/** @type {import('next').NextConfig} */
const nextConfig = {
  // devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.wlycdn.com',
        pathname: '/articles/**',
      },
    ],
  },
}

export default nextConfig
