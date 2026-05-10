import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — Stream Deck на телефоне · бесплатная программируемая клавиатура для Windows" },
  description:
    "Сделай из телефона аналог Stream Deck. Программируемая клавиатура для OBS, Photoshop, Blender, DaVinci, Premiere. Бесплатно, локально, без облака и аккаунта.",
  alternates: {
    canonical: "/ru/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="ru" content={content.ru} />;
}
