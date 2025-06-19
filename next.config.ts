import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next',
  // 指定应用目录为 views
  useFileSystemPublicRoutes: true,
};

export default nextConfig;
