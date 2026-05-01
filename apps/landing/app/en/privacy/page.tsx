import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: {
    canonical: "/en/privacy/",
    languages: { "en-US": "/en/privacy/", "ru-RU": "/ru/privacy/" },
  },
};

export default function Page() {
  return <PrivacyPage locale="en" content={content.en} />;
}
