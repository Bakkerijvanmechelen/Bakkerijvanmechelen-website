import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site-url";

/**
 * Pas na de livegang (ALLOW_INDEXING=true) mogen zoekmachines de site lezen, en nooit via het tijdelijke vercel.app-adres.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const open = process.env.ALLOW_INDEXING === "true" && !host.endsWith(".vercel.app");
  if (!open) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
