import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Приватность",
  alternates: {
    canonical: "/ru/privacy/",
    languages: { "en-US": "/en/privacy/", "ru-RU": "/ru/privacy/" },
  },
};

export default function Page() {
  return <PrivacyPage locale="ru" content={content.ru} />;
}
