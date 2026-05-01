"use client";

import { useEffect } from "react";

/**
 * Static-export-safe locale router.
 * The site ships HTML for /en and /ru only; this index page picks one based
 * on `navigator.language` and replaces history so back doesn't loop.
 */
export default function RootRedirect() {
  useEffect(() => {
    const lang = (navigator.language || "").toLowerCase().startsWith("ru")
      ? "ru"
      : "en";
    window.location.replace(`/${lang}/`);
  }, []);
  return (
    <main className="container" style={{ padding: "48px 24px" }}>
      <p style={{ color: "var(--fg-muted)" }}>
        Redirecting…{" "}
        <a href="/en/">English</a>
        {" · "}
        <a href="/ru/">Русский</a>
      </p>
    </main>
  );
}
