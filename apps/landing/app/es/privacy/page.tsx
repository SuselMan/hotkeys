import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "kekkeys no recopila nada. Sin cuentas, sin servidores, sin telemetría. El emparejamiento ocurre localmente por tu WiFi; los secretos quedan en los keystores del SO.",
  alternates: {
    canonical: "/es/privacy/",
    languages: altLanguages("/privacy/"),
  },
};

export default function Page() {
  return <PrivacyPage locale="es" content={content.es} />;
}
