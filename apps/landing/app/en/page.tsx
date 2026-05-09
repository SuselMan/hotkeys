import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { content } from "../_lib/content";

export const metadata: Metadata = {
  description:
    "Phone-controlled hotkey deck for your PC — a free, local Touch Portal / Stream Deck alternative. Configure boards on the phone, real keystrokes fire on Windows.",
  alternates: {
    canonical: "/en/",
    languages: { "en-US": "/en/", "ru-RU": "/ru/", "x-default": "/en/" },
  },
};

export default function Page() {
  return <Home locale="en" content={content.en} />;
}
