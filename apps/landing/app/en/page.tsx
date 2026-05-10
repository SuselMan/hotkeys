import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — free Stream Deck app for Android · turn your phone into a programmable deck" },
  description:
    "Free Stream Deck app for your phone. Programmable deck for OBS, Blender, Premiere, Animate. Local pairing via QR, no cloud, no account. Open the app, scan a QR.",
  alternates: {
    canonical: "/en/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="en" content={content.en} />;
}
