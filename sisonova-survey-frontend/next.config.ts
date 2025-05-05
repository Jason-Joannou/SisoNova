import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
