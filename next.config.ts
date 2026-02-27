import type { NextConfig } from "next";
import path from "path";

import withBundleAnalyzer from '@next/bundle-analyzer';

const internalConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Optimize images with aggressive caching
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ],
    // Cache images for 1 year since they rarely change
    minimumCacheTTL: 31536000
  },
  // Optimize headers
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" }
      ]
    }
  ],
  // Enable webpack caching for faster rebuilds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.join(process.cwd(), '.next/cache/webpack')
      };
    }
    return config;
  },
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false
};

// allow `ANALYZE=true npm run build` to output bundle size
const nextConfig = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(internalConfig);

export default nextConfig;