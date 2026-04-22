/**
 * Central place for site-wide metadata.
 * Read in the root layout, SEO helpers, sitemap, robots, OG images, etc.
 * Update here instead of hunting through files.
 */
export const siteConfig = {
  name: "The P.M. Archive.",
  shortName: "P.M. Archive",
  tagline: "Ideas worth reading. Summarized by AI.",
  description:
    "We condense the world's best PM newsletters into high-signal summaries, complete with code, analogies, and key takeaways.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  author: { name: "The P.M. Archive" },
  nav: [
    { label: "Articles", href: "/articles" },
    { label: "Topics", href: "/topics" },
    { label: "Newsletter", href: "/#newsletter" },
  ],
  footerNav: {
    explore: [
      { label: "Articles", href: "/articles" },
      { label: "Topics", href: "/topics" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
