import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kekkeys.online"),
  title: {
    default: "kekkeys — phone-controlled hotkeys for your desktop",
    template: "%s · kekkeys",
  },
  description:
    "Turn your phone into a programmable macropad. Configure boards on the phone, press buttons, real keystrokes fire on Windows. Built for digital artists, animators, video editors, 3D modellers, streamers — any shortcut-heavy workflow.",
  applicationName: "kekkeys",
  authors: [{ name: "kekkeys" }],
  keywords: [
    "software macropad",
    "phone macropad",
    "programmable macropad",
    "macropad app",
    "phone hotkeys",
    "phone hotkey deck",
    "tablet hotkey app",
    "tablet hotkey deck",
    "streamdeck on phone",
    "phone as streamdeck",
    "shortcut deck for artists",
    "hotkeys for photoshop",
    "hotkeys for animate",
    "hotkeys for blender",
    "hotkeys for davinci resolve",
    "hotkeys for obs",
    "hotkey deck for windows",
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
    title: "kekkeys — your phone is your macropad",
    description:
      "Programmable hotkey deck for the apps you live in. Press a button on your phone, the same keystroke fires on your PC. Built for shortcut-heavy workflows.",
    siteName: "kekkeys",
    type: "website",
    images: [{ url: "/1200x630.png", width: 1200, height: 630, alt: "kekkeys — phone-controlled hotkeys for your desktop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "kekkeys — your phone is your macropad",
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
