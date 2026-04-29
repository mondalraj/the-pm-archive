/**
 * Central place for site-wide metadata.
 * Read in the root layout, SEO helpers, sitemap, robots, OG images, etc.
 * Update here instead of hunting through files.
 */
export const siteConfig = {
  name: "P.M. Archive.",
  shortName: "P.M. Archive",
  tagline: "5-minute product & AI insights that actually move the needle.",
  description:
    "Curated, no-fluff breakdowns on product strategy, agentic AI, startup execution, growth, and engineering leadership. One focused email every week. Applied the same day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  author: { name: "P.M. Archive" },
  nav: [
    { label: "Articles", href: "/articles" },
    { label: "Topics", href: "/topics" },
    { label: "About Us", href: "/about" },
  ],
  footerNav: {
    explore: [
      { label: "Articles", href: "/articles" },
      { label: "Topics", href: "/topics" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "mailto:contact@pmarchive.com" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
