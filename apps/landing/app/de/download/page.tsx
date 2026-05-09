import type { Metadata } from "next";
import { DownloadPage } from "../../_components/DownloadPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Herunterladen",
  description:
    "Hol dir kekkeys für Windows (Tray-App, ohne Installationsassistent) und Android (APK oder Google Play). Kopplung per QR in deinem lokalen WiFi — kein Konto, keine Cloud.",
  alternates: {
    canonical: "/de/download/",
    languages: altLanguages("/download/"),
  },
};

export default function Page() {
  return <DownloadPage locale="de" content={content.de} />;
}
