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
  openGraph: {
    title: "kekkeys — phone-controlled hotkeys",
    description:
      "Press a button on your phone — the same combination fires on your PC. Boards configured on the phone, real keys on Windows.",
    siteName: "kekkeys",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kekkeys — phone-controlled hotkeys",
    description:
      "Press a button on your phone — the same combination fires on your PC.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
