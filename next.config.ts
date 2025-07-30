import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
