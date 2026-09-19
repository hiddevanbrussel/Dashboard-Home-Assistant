import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["onnxruntime-web", "openwakeword-web"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: "/api/uploads/:path*" },
      // /rooms/[areaId] → dashboard editor (blijft op /rooms/ in de URL)
      { source: "/rooms/:areaId", destination: "/dashboards/room-:areaId" },
    ];
  },
};

export default nextConfig;
