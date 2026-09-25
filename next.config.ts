import type { NextConfig } from "next";

/**
 * Optional basePath for the Home Assistant addon image.
 * Built as `/__ha_ingress__`; the addon ingress-proxy rewrites it to the
 * dynamic `X-Ingress-Path` (e.g. `/api/hassio_ingress/<token>`) at runtime.
 * Leave unset for normal Docker / Unraid installs.
 *
 * trailingSlash: HA's ingress route is `/api/hassio_ingress/{token}/{path:.*}`
 * and does not match a bare `/api/hassio_ingress/{token}` (404). Root links
 * must therefore end with `/` after rewrite.
 * skipTrailingSlashRedirect: keep API fetches without a forced 308.
 */
const basePath = process.env.NEXT_BASE_PATH || "";
const isHaIngress = Boolean(basePath);

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: basePath || undefined,
  ...(isHaIngress
    ? {
        trailingSlash: true,
        skipTrailingSlashRedirect: true,
      }
    : {}),
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
