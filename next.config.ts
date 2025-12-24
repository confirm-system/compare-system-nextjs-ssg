import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR専用設定
  basePath: '/next-ssr',
  trailingSlash: true,
};

export default nextConfig;
