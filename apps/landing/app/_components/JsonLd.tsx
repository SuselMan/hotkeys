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
  faq?: ReadonlyArray<{ q: string; a: string }>;
}

export function JsonLd({ locale, description, faq }: Props) {
  const softwareApp = {
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

  const faqPage = faq && faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  );
}
