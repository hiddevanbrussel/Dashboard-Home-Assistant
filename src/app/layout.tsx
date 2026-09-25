import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { PageBackgroundProvider } from "@/components/page-background";
import { MusicPlayerProvider } from "@/components/music-player-provider";
import { GlobalMusicBar } from "@/components/global-music-bar";
import { BasePathScript } from "@/components/base-path-script";
import { withBasePath } from "@/lib/base-path";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home Assistant Dashboard",
  description: "Dashboard met live Home Assistant data.",
  // Prefix with basePath so Ingress does not resolve these against HA Core /api.
  manifest: withBasePath("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HA Dashboard",
    startupImage: withBasePath("/api/pwa-icon?size=512"),
  },
  icons: {
    icon: [
      { url: withBasePath("/api/pwa-icon?size=192"), sizes: "192x192", type: "image/png" },
      { url: withBasePath("/api/pwa-icon?size=512"), sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: withBasePath("/api/pwa-icon?size=180"), sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: "#4700B5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body className={`relative ${inter.className}`}>
        <BasePathScript />
        <Providers>
          <OnboardingGuard>
            <MusicPlayerProvider>
              <PageBackgroundProvider>
                <div className="relative min-h-screen">{children}</div>
              </PageBackgroundProvider>
              <GlobalMusicBar />
            </MusicPlayerProvider>
          </OnboardingGuard>
        </Providers>
      </body>
    </html>
  );
}
