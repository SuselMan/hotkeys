import type { Metadata } from "next";
import { DownloadPage } from "../../_components/DownloadPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Скачать",
  description:
    "Скачай kekkeys для Windows (трей, без визарда) и Android (APK или Google Play). Пейринг через QR в твоей WiFi — без аккаунтов и облака.",
  alternates: {
    canonical: "/ru/download/",
    languages: {
      "en-US": "/en/download/",
      "ru-RU": "/ru/download/",
      "x-default": "/en/download/",
    },
  },
};

export default function Page() {
  return <DownloadPage locale="ru" content={content.ru} />;
}
