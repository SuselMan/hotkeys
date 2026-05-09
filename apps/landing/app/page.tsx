"use client";

import { useEffect } from "react";

/**
 * Static-export-safe locale router. Picks the closest match from the user's
 * `navigator.languages` chain against the locales we ship, with en as the
 * fallback. Uses `replace` so the back button doesn't ping-pong here.
 */
const SUPPORTED = ["en", "ru", "es", "de", "ja"] as const;

export default function RootRedirect() {
  useEffect(() => {
    const candidates = (navigator.languages ?? [navigator.language ?? "en"]).map((l) =>
      l.toLowerCase().split("-")[0],
    );
    const match = candidates.find((c) => (SUPPORTED as readonly string[]).includes(c));
    const lang = match ?? "en";
    window.location.replace(`/${lang}/`);
  }, []);
  return (
    <main className="container" style={{ padding: "48px 24px" }}>
      <p style={{ color: "var(--fg-muted)" }}>
        Redirecting…{" "}
        <a href="/en/">English</a>
        {" · "}
        <a href="/ru/">Русский</a>
        {" · "}
        <a href="/es/">Español</a>
        {" · "}
        <a href="/de/">Deutsch</a>
        {" · "}
        <a href="/ja/">日本語</a>
      </p>
    </main>
  );
}
