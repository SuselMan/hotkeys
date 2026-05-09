import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — スマホがホットキーデック" },
  description:
    "スマホで設定するPC用プログラマブル・ホットキーデック。無料、ローカル、クラウドなし。デジタルアーティスト、アニメーター、動画編集者、3Dモデラー、配信者 — キーボードショートカットに依存するすべてのワークフローのために。",
  alternates: {
    canonical: "/ja/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="ja" content={content.ja} />;
}
