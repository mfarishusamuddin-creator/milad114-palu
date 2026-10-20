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
      url: `${SITE.url}/en`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/ar`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
