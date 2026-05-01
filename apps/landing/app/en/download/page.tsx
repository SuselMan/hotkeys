import type { Metadata } from "next";
import { DownloadPage } from "../../_components/DownloadPage";
import { content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "Download",
  alternates: {
    canonical: "/en/download/",
    languages: { "en-US": "/en/download/", "ru-RU": "/ru/download/" },
  },
};

export default function Page() {
  return <DownloadPage locale="en" content={content.en} />;
}
