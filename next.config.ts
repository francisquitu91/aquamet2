import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'colegiosagradafamilia.cl',
        port: '',
        pathname: '/www/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
