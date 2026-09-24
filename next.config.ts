import type { NextConfig } from "next";

/**
 * Optional basePath for the Home Assistant addon image.
 * Built as `/__ha_ingress__`; the addon nginx layer rewrites it to the
 * dynamic `X-Ingress-Path` (e.g. `/api/hassio_ingress/<token>`) at runtime.
 * Leave unset for normal Docker / Unraid installs.
 */
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: basePath || undefined,
  serverExternalPackages: ["onnxruntime-web", "openwakeword-web"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
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
