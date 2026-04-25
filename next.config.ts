import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Newsletter cover images are admin-curated via the Supabase Table
    // Editor (no user uploads), so we allow any HTTPS host. Tighten this
    // to specific hostnames if/when content authoring opens up.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
