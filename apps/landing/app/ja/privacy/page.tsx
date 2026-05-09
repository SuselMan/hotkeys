import type { Metadata } from "next";
import { PrivacyPage } from "../../_components/PrivacyPage";
import { altLanguages, content } from "../../_lib/content";

export const metadata: Metadata = {
  title: "プライバシー",
  description:
    "kekkeysは何も収集しません。アカウントなし、サーバーなし、テレメトリーなし。ペアリングはローカルWiFiで行われ、シークレットはOSのキーストアに留まります。",
  alternates: {
    canonical: "/ja/privacy/",
    languages: altLanguages("/privacy/"),
  },
};

export default function Page() {
  return <PrivacyPage locale="ja" content={content.ja} />;
}
