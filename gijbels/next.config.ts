import type { NextConfig } from "next";

// Zolang ALLOW_INDEXING niet op "true" staat, houden we de site uit zoekmachines.
// Bij de livegang zet je die variabele in Vercel op true en deploy je opnieuw.
const indexable = process.env.ALLOW_INDEXING === "true";

const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // De tijdelijke Vercel-adressen blijven altijd onzichtbaar voor zoekmachines, ook na de livegang.
      { source: "/:path*", has: [{ type: "host", value: "(?<sub>.+)\\.vercel\\.app" }], headers: noindex },
      ...(indexable ? [] : [{ source: "/:path*", headers: noindex }]),
    ];
  },
  // Oude adressen van de Wix-site, zodat bladwijzers en zoekresultaten blijven werken.
  async redirects() {
    return [{ source: "/kopie-van-home", destination: "/", permanent: true }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "jsxdsigtwanxykbmvdhc.supabase.co", pathname: "/storage/v1/object/public/**" }],
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
