import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { altLanguages, content } from "../_lib/content";

export const metadata: Metadata = {
  title: { absolute: "kekkeys — хоткей-дек на экране твоего телефона" },
  description:
    "Программируемый хоткей-дек на экране телефона. Бесплатный, локальный, без облака. Для художников, аниматоров, видеомонтажёров, 3D-моделлеров, стримеров — всех у кого работа на хоткеях.",
  alternates: {
    canonical: "/ru/",
    languages: altLanguages("/"),
  },
};

export default function Page() {
  return <Home locale="ru" content={content.ru} />;
}
