import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: "/api/uploads/:path*" },
      // /rooms/[areaId] → dashboard editor (blijft op /rooms/ in de URL)
      { source: "/rooms/:areaId", destination: "/dashboards/room-:areaId" },
    ];
  },
};

export default nextConfig;
