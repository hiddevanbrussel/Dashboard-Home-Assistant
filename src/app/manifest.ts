import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";

/** Ingress-safe PWA manifest (paths include addon basePath when set). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Home Assistant Dashboard",
    short_name: "HA Dashboard",
    description: "Dashboard met live Home Assistant data",
    start_url: withBasePath("/"),
    display: "standalone",
    background_color: "#0A0014",
    theme_color: "#4700B5",
    orientation: "any",
    scope: withBasePath("/"),
    icons: [
      {
        src: withBasePath("/api/pwa-icon?size=192"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/api/pwa-icon?size=512"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
