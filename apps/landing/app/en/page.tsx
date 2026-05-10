import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — phone Stream Deck alternative · free macropad for Windows" },
  description:
    "Free Stream Deck alternative on your phone. Programmable macropad for Windows — Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Figma. Local pairing via QR, no cloud, no telemetry.",
  alternates: {
    canonical: "/en/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="en" content={content.en} />;
}
