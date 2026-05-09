import type { Metadata } from "next";
import { DownloadPage } from "../../_components/DownloadPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Get kekkeys for Windows (tray app, no install wizard) and Android (APK or Google Play). Pair via QR on your local WiFi — no account, no cloud.",
  alternates: {
    canonical: "/en/download/",
    languages: {
      "en-US": "/en/download/",
      "ru-RU": "/ru/download/",
      "x-default": "/en/download/",
    },
  },
};

export default function Page() {
  return <DownloadPage locale="en" content={content.en} />;
}
