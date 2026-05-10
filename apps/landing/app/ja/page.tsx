import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — Stream Deck（ストリームデック）アプリ · スマホがホットキーデックに" },
  description:
    "あなたのスマホをStream Deckに。OBS、Blender、Photoshop用のプログラマブルなホットキーデック。ローカルで動作、クラウド不要、アカウント不要、無料。",
  alternates: {
    canonical: "/ja/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="ja" content={content.ja} />;
}
