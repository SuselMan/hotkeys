import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kekkeys.app"),
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
    "streamdeck on phone",
    "phone hotkeys",
    "tablet hotkey app",
    "hotkeys for photoshop",
    "hotkeys for animate",
    "hotkeys for blender",
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
