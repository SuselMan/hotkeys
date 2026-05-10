import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kekkeys.online"),
  title: {
    default: "kekkeys — phone-controlled hotkeys for your desktop",
    template: "%s · kekkeys",
  },
  description:
    "Free Stream Deck app for your phone. Programmable deck for OBS, Blender, Premiere, Animate. Local pairing via QR, no cloud, no account.",
  applicationName: "kekkeys",
  authors: [{ name: "kekkeys" }],
  keywords: [
    // EN — sized by Google Trends head terms; "stream deck app" 62, "free stream deck" 36 are the heads
    "stream deck app",
    "free stream deck",
    "free stream deck app",
    "stream deck mobile",
    "stream deck android",
    "stream deck app for android",
    "stream deck for phone",
    "stream deck alternative",
    "stream deck cheap",
    "obs hotkeys",
    "blender hotkeys",
    "macro deck",
    // RU — sized by Yandex Wordstat (cyrillic + latin both queried)
    "stream deck",
    "стрим дек",
    "стрим дек на телефоне",
    "стрим дек на телефон",
    "стрим дек android",
    "стрим дек скачать",
    "стрим дек приложение",
    "стрим дек из телефона",
    "стрим дек аналоги",
    "аналог стрим дек",
    "программируемая клавиатура",
    "программируемый макропад",
    "макропад",
    "стримдек",
    "streamdeck",
    "как сделать стрим дек из телефона",
    "как сделать стрим дек",
    "стрим дек своими руками",
    "программа для хоткеев",
    "пульт для obs",
    // DE / JA — markets are brand-concentrated, only head terms matter
    "Stream Deck App",
    "kostenlose Stream Deck App",
    "ストリームデック アプリ",
    "ストリームデック スマホ",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "kekkeys — your phone is your hotkey deck",
    description:
      "Programmable hotkey deck for the apps you live in. Press a button on your phone, the same keystroke fires on your PC. Built for shortcut-heavy workflows.",
    siteName: "kekkeys",
    type: "website",
    images: [{ url: "/1200x630.png", width: 1200, height: 630, alt: "kekkeys — phone-controlled hotkeys for your desktop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "kekkeys — your phone is your hotkey deck",
    description:
      "Programmable hotkey deck for the apps you live in. Real keystrokes on your PC, configured from your phone.",
    images: ["/1200x630.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
