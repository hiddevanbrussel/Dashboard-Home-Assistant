import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { PageBackgroundProvider } from "@/components/page-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Assistant Dashboard Builder",
  description: "Set up a working dashboard with live Home Assistant data in 5–10 minutes.",
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
            <PageBackgroundProvider>
              <div className="relative z-0 min-h-screen">{children}</div>
            </PageBackgroundProvider>
          </OnboardingGuard>
        </Providers>
      </body>
    </html>
  );
}
