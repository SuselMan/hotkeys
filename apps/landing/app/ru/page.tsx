import type { Metadata } from "next";
import { Home } from "../_components/Home";
import { content } from "../_lib/content";

export const metadata: Metadata = {
  description:
    "Хоткеи на ПК с экрана телефона — бесплатная локальная альтернатива Touch Portal и Stream Deck. Доски настраиваются с телефона, на ПК фигачат настоящие клавиши.",
  alternates: {
    canonical: "/ru/",
    languages: { "en-US": "/en/", "ru-RU": "/ru/", "x-default": "/en/" },
  },
};

export default function Page() {
  return <Home locale="ru" content={content.ru} />;
}
