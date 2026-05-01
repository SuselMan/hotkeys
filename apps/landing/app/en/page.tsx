import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { content } from "../_lib/content";

export const metadata: Metadata = {
  alternates: {
    canonical: "/en/",
    languages: { "en-US": "/en/", "ru-RU": "/ru/" },
  },
};

export default function Page() {
  return <Home locale="en" content={content.en} />;
}
