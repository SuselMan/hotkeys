import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { content } from "../_lib/content";

export const metadata: Metadata = {
  description:
    "Phone-controlled programmable macropad for your PC. A free, local hotkey deck for digital artists, animators, video editors, 3D modellers, streamers — any shortcut-heavy workflow.",
  alternates: {
    canonical: "/en/",
    languages: { "en-US": "/en/", "ru-RU": "/ru/", "x-default": "/en/" },
  },
};

export default function Page() {
  return <Home locale="en" content={content.en} />;
}
