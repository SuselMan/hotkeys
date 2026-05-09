import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://kekkeys.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "download/", "privacy/"];
  const routes: MetadataRoute.Sitemap = [];
  for (const locale of ["en", "ru"]) {
    for (const p of paths) {
      routes.push({
        url: `${BASE}/${locale}/${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
        alternates: {
          languages: {
            en: `${BASE}/en/${p}`,
            ru: `${BASE}/ru/${p}`,
          },
        },
      });
    }
  }
  return routes;
}
