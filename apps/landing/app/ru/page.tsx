import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { content } from "../_lib/content";

export const metadata: Metadata = {
  alternates: {
    canonical: "/ru/",
    languages: { "en-US": "/en/", "ru-RU": "/ru/" },
  },
};

export default function Page() {
  return <Home locale="ru" content={content.ru} />;
}
