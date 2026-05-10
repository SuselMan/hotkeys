import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — スマホでStream Deck · Windows用無料マクロパッド" },
  description:
    "スマホで使えるStream Deckの無料代替。Windows向けプログラマブル・マクロパッド — Photoshop、Blender、DaVinci Resolve、OBS、Premiere、After Effects、Figma対応。QRでローカルペアリング、クラウド不要。",
  alternates: {
    canonical: "/ja/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="ja" content={content.ja} />;
}
