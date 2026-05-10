import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — стрим дек на телефоне, бесплатный макропад для Windows" },
  description:
    "Бесплатный аналог Stream Deck на телефоне. Программируемый макропад для Windows — Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Figma. Локальный пейринг через QR, без облака.",
  alternates: {
    canonical: "/ru/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="ru" content={content.ru} />;
}
