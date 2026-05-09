import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "kekkeys collects nothing. No accounts, no servers, no telemetry. Pairing happens locally over your WiFi; secrets stay in OS keystores.",
  alternates: {
    canonical: "/en/privacy/",
    languages: {
      "en-US": "/en/privacy/",
      "ru-RU": "/ru/privacy/",
      "x-default": "/en/privacy/",
    },
  },
};

export default function Page() {
  return <PrivacyPage locale="en" content={content.en} />;
}
