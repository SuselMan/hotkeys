import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Приватность",
  description:
    "kekkeys ничего не собирает. Нет аккаунтов, серверов и телеметрии. Пейринг локальный по WiFi, секреты лежат в OS keystore.",
  alternates: {
    canonical: "/ru/privacy/",
    languages: altLanguages("/privacy/"),
  },
};

export default function Page() {
  return <PrivacyPage locale="ru" content={content.ru} />;
}
