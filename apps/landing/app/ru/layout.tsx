export default function RuLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata = {
  alternates: {
    languages: {
      "en-US": "/en/",
      "ru-RU": "/ru/",
    },
  },
};
