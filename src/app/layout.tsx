import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { PageBackgroundProvider } from "@/components/page-background";
import { MusicPlayerProvider } from "@/components/music-player-provider";
import { GlobalMusicBar } from "@/components/global-music-bar";
import { BasePathScript } from "@/components/base-path-script";
import { SecretMigrator } from "@/components/secret-migrator";
import { AuthFetchGuard } from "@/components/auth-fetch-guard";
import { isPublicPage, pathnameForAuth, requestIsAuthorized } from "@/lib/auth-policy";
import { withBasePath } from "@/lib/base-path";
import { safeNextPath } from "@/lib/session-redirect";

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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const incoming = await headers();
  const path = pathnameForAuth(incoming.get("x-pathname"));
  const publicPage = isPublicPage(path);
  if (!publicPage) {
    const request = new Request(`http://internal${path}`, { headers: incoming });
    if (!requestIsAuthorized(request)) {
      redirect(`/login?next=${encodeURIComponent(safeNextPath(path))}`);
    }
  }

  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body className={`relative ${inter.className}`}>
        <BasePathScript />
        <AuthFetchGuard />
        {publicPage ? (
          <div className="relative min-h-screen">{children}</div>
        ) : (
          <Providers>
            <SecretMigrator>
              <OnboardingGuard>
                <MusicPlayerProvider>
                  <PageBackgroundProvider>
                    <div className="relative min-h-screen">{children}</div>
                  </PageBackgroundProvider>
                  <GlobalMusicBar />
                </MusicPlayerProvider>
              </OnboardingGuard>
            </SecretMigrator>
          </Providers>
        )}
      </body>
    </html>
  );
}
