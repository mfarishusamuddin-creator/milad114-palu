import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

const LAST_MODIFIED = "2026-10-20";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/sejarah`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/layanan`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
