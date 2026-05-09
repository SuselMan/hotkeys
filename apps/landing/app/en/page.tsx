import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  description:
    "Phone-controlled programmable hotkey deck for your PC. Free, local, no cloud. Built for digital artists, animators, video editors, 3D modellers, streamers — any shortcut-heavy workflow.",
  alternates: {
    canonical: "/en/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="en" content={content.en} />;
}
