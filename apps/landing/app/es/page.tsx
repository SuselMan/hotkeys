import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — el deck de hotkeys de tu teléfono" },
  description:
    "Deck programable de hotkeys para tu PC desde el móvil. Gratis, local, sin nube. Para artistas digitales, animadores, editores de video, modeladores 3D, streamers — cualquier flujo dependiente de atajos.",
  alternates: {
    canonical: "/es/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="es" content={content.es} />;
}
