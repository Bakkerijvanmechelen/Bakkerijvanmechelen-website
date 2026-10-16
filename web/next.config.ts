import type { NextConfig } from "next";

// Zolang ALLOW_INDEXING niet op "true" staat, houden we de site uit zoekmachines.
// Bij de livegang zet je die variabele in Vercel op true en deploy je opnieuw.
const indexable = process.env.ALLOW_INDEXING === "true";

const nextConfig: NextConfig = {
  async headers() {
    if (indexable) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }] }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
