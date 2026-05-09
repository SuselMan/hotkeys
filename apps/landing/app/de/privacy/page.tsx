import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Datenschutz",
  description:
    "kekkeys sammelt nichts. Keine Konten, keine Server, keine Telemetrie. Die Kopplung passiert lokal über dein WiFi; Secrets bleiben in OS-Keystores.",
  alternates: {
    canonical: "/de/privacy/",
    languages: altLanguages("/privacy/"),
  },
};

export default function Page() {
  return <PrivacyPage locale="de" content={content.de} />;
}
