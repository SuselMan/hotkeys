import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kekkeys.online"),
  title: {
    default: "kekkeys — phone-controlled hotkeys for your desktop",
    template: "%s · kekkeys",
  },
  description:
    "Free Stream Deck alternative on your phone. Programmable macropad for Windows — Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Figma. Local pairing via QR, no cloud, no telemetry.",
  applicationName: "kekkeys",
  authors: [{ name: "kekkeys" }],
  keywords: [
    // EN — primary searches
    "stream deck alternative",
    "free stream deck",
    "phone stream deck",
    "stream deck app android",
    "stream deck on phone",
    "phone as stream deck",
    "free macropad app",
    "software macropad",
    "phone macropad",
    "programmable macropad",
    "macropad app",
    "macro deck alternative",
    "touch portal alternative",
    "phone hotkeys",
    "phone hotkey deck",
    "tablet hotkey deck",
    "hotkeys for photoshop",
    "hotkeys for blender",
    "hotkeys for obs",
    "hotkeys for davinci resolve",
    "hotkeys for premiere",
    "hotkeys for after effects",
    "hotkey deck for windows",
    "shortcut deck for artists",
    // RU — primary searches
    "стрим дек на телефоне",
    "стрим дек android",
    "аналог стрим дек",
    "альтернатива stream deck",
    "макропад приложение",
    "программа макропад",
    "хоткеи для photoshop с телефона",
    "хоткеи с телефона",
    "как сделать стрим дек из телефона",
    // DE / ES / JA primary
    "stream deck alternative handy",
    "kostenloses macropad",
    "macropad para móvil",
    "alternativa stream deck",
    "スマホ ストリームデック",
    "マクロパッド アプリ",
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
