import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — Stream-Deck-Alternative fürs Handy · Macropad für Windows" },
  description:
    "Kostenlose Stream-Deck-Alternative auf deinem Handy. Programmierbares Macropad für Windows — Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Figma. Lokale Kopplung per QR, keine Cloud.",
  alternates: {
    canonical: "/de/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="de" content={content.de} />;
}
