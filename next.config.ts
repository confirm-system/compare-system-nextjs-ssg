import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSG専用設定
  output: 'export',
  basePath: '/next-ssg',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
