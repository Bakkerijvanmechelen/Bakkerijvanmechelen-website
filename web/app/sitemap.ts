import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const pages = ["/", "/privacy", "/cookiebeleid"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.6 }));
}
