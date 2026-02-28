import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { PageBackgroundProvider } from "@/components/page-background";
import { MusicPlayerProvider } from "@/components/music-player-provider";
import { GlobalMusicBar } from "@/components/global-music-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Assistant Dashboard",
  description: "Dashboard met live Home Assistant data.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HA Dashboard",
    startupImage: "/api/pwa-icon?size=512",
  },
  icons: {
    icon: [
      { url: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/api/pwa-icon?size=512", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/api/pwa-icon?size=180", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: "#4D2FB2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`relative ${inter.className}`}>
        <Providers>
          <OnboardingGuard>
            <MusicPlayerProvider>
              <PageBackgroundProvider>
                <div className="relative z-0 min-h-screen">{children}</div>
              </PageBackgroundProvider>
              <GlobalMusicBar />
            </MusicPlayerProvider>
          </OnboardingGuard>
        </Providers>
      </body>
    </html>
  );
}
