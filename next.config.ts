import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/file-share',
  images: { unoptimized: true },
};

export default nextConfig;
