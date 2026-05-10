import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — Stream Deck en tu teléfono · macropad gratis para Windows" },
  description:
    "Alternativa gratis a Stream Deck en tu teléfono. Macropad programable para Windows — Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Figma. Emparejamiento local por QR, sin nube.",
  alternates: {
    canonical: "/es/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="es" content={content.es} />;
}
