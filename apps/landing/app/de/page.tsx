import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — kostenlose Stream Deck App fürs Handy · für Windows" },
  description:
    "Verwandle dein Handy in ein Stream Deck. Programmierbares Hotkey-Deck für OBS, Blender, Photoshop, DaVinci. Lokal, ohne Cloud, ohne Konto.",
  alternates: {
    canonical: "/de/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="de" content={content.de} />;
}
