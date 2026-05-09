import type { Metadata } from "next";
import { DownloadPage } from "../../_components/DownloadPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Descargar",
  description:
    "Descarga kekkeys para Windows (app de bandeja, sin asistente) y Android (APK o Google Play). Emparejamiento por QR en tu WiFi local — sin cuenta, sin nube.",
  alternates: {
    canonical: "/es/download/",
    languages: altLanguages("/download/"),
  },
};

export default function Page() {
  return <DownloadPage locale="es" content={content.es} />;
}
