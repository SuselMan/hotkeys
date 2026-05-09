import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — das Hotkey-Deck deines Handys" },
  description:
    "Programmierbares Hotkey-Deck für deinen PC, am Handy konfiguriert. Kostenlos, lokal, ohne Cloud. Für digitale Künstler, Animatoren, Videoeditoren, 3D-Modellierer, Streamer — alle, deren Workflow auf Tastenkürzeln läuft.",
  alternates: {
    canonical: "/de/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="de" content={content.de} />;
}
