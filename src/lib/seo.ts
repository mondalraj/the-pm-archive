import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
};

/**
 * Build a `Metadata` object with sensible SEO defaults so every page only
 * needs to override the fields that differ. Use from `generateMetadata` or
 * `export const metadata = buildMetadata(...)` in any route segment.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  authors,
  tags,
}: BuildMetadataInput = {}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const resolvedTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.name;
  const resolvedDescription = description ?? siteConfig.description;
  const ogImage = image ?? "/opengraph-image.png";

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description: resolvedDescription,
      locale: siteConfig.locale,
      images: [{ url: ogImage }],
      ...(type === "article" && {
        publishedTime,
        authors,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
