import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontSans, fontSerif } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop";
import "./globals.css";

/**
 * Root metadata. Per-page metadata (in `page.tsx` / `generateMetadata`)
 * is merged on top of this by Next.js.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({
    description: siteConfig.description,
  }),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // `suppressHydrationWarning` is needed because next-themes sets the
      // `class` on <html> before React hydrates.
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable}`}
    >
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AmbientBackdrop />
          <GrainOverlay />
          <div className="ambient-above flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
