/**
 * SoftwareApplication structured data. Google rewards apps that ship this with
 * richer SERP cards (price, OS, category surfaces directly in results). One
 * instance per locale-rendered page so `inLanguage` and the canonical `url`
 * match the page Google is indexing.
 */
import type { Locale } from "../_lib/content";

const SITE_URL = "https://kekkeys.online";

interface Props {
  locale: Locale;
  description: string;
}

export function JsonLd({ locale, description }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "kekkeys",
    description,
    url: `${SITE_URL}/${locale}/`,
    inLanguage: locale,
    operatingSystem: "Windows 10, Windows 11, Android 8+",
    applicationCategory: "ProductivityApplication",
    applicationSubCategory: "UtilitiesApplication",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "PRO (lifetime)",
        price: "9.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    ],
    author: { "@type": "Organization", name: "kekkeys" },
    publisher: { "@type": "Organization", name: "kekkeys" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
