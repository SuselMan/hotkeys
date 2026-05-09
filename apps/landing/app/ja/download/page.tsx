import type { Metadata } from "next";
import { DownloadPage } from "../../_components/DownloadPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "ダウンロード",
  description:
    "kekkeysをWindows用(トレイアプリ、インストーラ不要)とAndroid用(APKまたはGoogle Play)に取得。ローカルWiFi上のQRでペアリング — アカウント不要、クラウド不要。",
  alternates: {
    canonical: "/ja/download/",
    languages: altLanguages("/download/"),
  },
};

export default function Page() {
  return <DownloadPage locale="ja" content={content.ja} />;
}
