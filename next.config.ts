import type { NextConfig } from "next";

/**
 * Optional basePath for the Home Assistant addon image.
 * Built as `/__ha_ingress__`; the addon ingress-proxy rewrites it to the
 * dynamic `X-Ingress-Path` (e.g. `/api/hassio_ingress/<token>`) at runtime.
 * Leave unset for normal Docker / Unraid installs.
 *
 * Do NOT enable trailingSlash here: with App Router it 308s
 * `/__ha_ingress__/` → `/__ha_ingress__`, and an ingress proxy that targets
 * the slashed form loops / surfaces as a 404 in the HA iframe. The proxy
 * still rewrites bare `/__ha_ingress__` links to `X-Ingress-Path/` so HA's
 * `/api/hassio_ingress/{token}/{path:.*}` route matches.
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
