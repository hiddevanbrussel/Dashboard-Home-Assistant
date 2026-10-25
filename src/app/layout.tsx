import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import { montserrat } from "@/fonts/montserrat/montserrat";
import "./globals.css";
import { Providers } from "@/components/providers";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { PageBackgroundProvider } from "@/components/page-background";
import { MusicPlayerProvider } from "@/components/music-player-provider";
import { GlobalMusicBar } from "@/components/global-music-bar";
import { BasePathScript } from "@/components/base-path-script";
import { SecretMigrator } from "@/components/secret-migrator";
import { AuthFetchGuard } from "@/components/auth-fetch-guard";
import { LanguageBootstrap } from "@/components/language-bootstrap";
import { LANGUAGE_COOKIE, parseLanguage, resolveLanguage } from "@/lib/language";
import { isPublicPage, pathnameForAuth, requestIsAuthorized } from "@/lib/auth-policy";
import { withBasePath } from "@/lib/base-path";
import { safeNextPath } from "@/lib/session-redirect";

/**
 * Classic Google Sans (variable wght axis only, latin subset).
 * One preloaded woff2. adjustFontFallback inserts a size-adjusted Arial
 * face, then the named stack ends with system-ui.
 */
const googleSans = localFont({
  src: "../../node_modules/@fontsource-variable/google-sans/files/google-sans-latin-wght-normal.woff2",
  weight: "400 700",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["system-ui"],
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
  interactiveWidget: "resizes-content" as const,
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

  // Runtime value (add-on option / Docker env), not the build-time inline the client bundle sees.
  const languageCookieValue = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  const language = resolveLanguage(languageCookieValue, process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE);

  return (
    <html lang={language} className={montserrat.variable} suppressHydrationWarning>
      <body className={`relative ${googleSans.className}`}>
        <BasePathScript />
        <AuthFetchGuard />
        <LanguageBootstrap language={language} fromCookie={parseLanguage(languageCookieValue) != null}>
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
        </LanguageBootstrap>
      </body>
    </html>
  );
}
