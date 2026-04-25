/**
 * Central place for site-wide metadata.
 * Read in the root layout, SEO helpers, sitemap, robots, OG images, etc.
 * Update here instead of hunting through files.
 */
export const siteConfig = {
  name: "The P.M. Archive.",
  shortName: "P.M. Archive",
  tagline: "5-minute reads for people building real products.",
  description:
    "The sharpest product, engineering, and startup insights in focused 5-minute reads you can apply to ship faster, reduce risk, and grow revenue.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  author: { name: "The P.M. Archive" },
  nav: [
    { label: "Articles", href: "/articles" },
    { label: "Topics", href: "/topics" },
    { label: "Subscribe", href: "/#newsletter" },
  ],
  footerNav: {
    explore: [
      { label: "Articles", href: "/articles" },
      { label: "Topics", href: "/topics" },
      { label: "Subscribe", href: "/#newsletter" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
