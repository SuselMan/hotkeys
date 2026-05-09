import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Приватность",
  description:
    "kekkeys ничего не собирает. Нет аккаунтов, серверов и телеметрии. Пейринг локальный по WiFi, секреты лежат в OS keystore.",
  alternates: {
    canonical: "/ru/privacy/",
    languages: {
      "en-US": "/en/privacy/",
      "ru-RU": "/ru/privacy/",
      "x-default": "/en/privacy/",
    },
  },
};

export default function Page() {
  return <PrivacyPage locale="ru" content={content.ru} />;
}
