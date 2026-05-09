import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kekkeys.online"),
  title: {
    default: "kekkeys — phone-controlled hotkeys for your desktop",
    template: "%s · kekkeys",
  },
  description:
    "Turn your phone into a Touch Portal-style hotkey deck. Configure boards on the phone, press buttons, real keys fire on Windows.",
  applicationName: "kekkeys",
  authors: [{ name: "kekkeys" }],
  keywords: [
    "touch portal alternative",
    "stream deck alternative",
    "streamdeck on phone",
    "phone as streamdeck",
    "phone hotkeys",
    "tablet hotkey app",
    "tablet hotkey deck",
    "hotkeys for photoshop",
    "hotkeys for animate",
    "hotkeys for blender",
    "hotkeys for davinci resolve",
    "hotkeys for obs",
    "hotkey deck for windows",
    "free stream deck software",
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
    title: "kekkeys — phone-controlled hotkeys",
    description:
      "Press a button on your phone — the same combination fires on your PC. Boards configured on the phone, real keys on Windows.",
    siteName: "kekkeys",
    type: "website",
    images: [{ url: "/1200x630.png", width: 1200, height: 630, alt: "kekkeys — phone-controlled hotkeys for your desktop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "kekkeys — phone-controlled hotkeys",
    description:
      "Press a button on your phone — the same combination fires on your PC.",
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
