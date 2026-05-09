import type { MetadataRoute } from "next";
import { locales } from "./_lib/content";

export const dynamic = "force-static";

const BASE = "https://kekkeys.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "download/", "privacy/"];
  const routes: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of paths) {
      routes.push({
        url: `${BASE}/${locale}/${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/${p}`]),
          ),
        },
      });
    }
  }
  return routes;
}
