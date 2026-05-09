import Link from "next/link";
import type { LandingContent, Locale } from "../_lib/content";

interface Props {
  locale: Locale;
  content: LandingContent;
}

export function Header({ locale, content }: Props) {
  const other: Locale = locale === "en" ? "ru" : "en";
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href={`/${locale}/`} className="logo">
          <img
            src="/android-chrome-192x192.png"
            alt=""
            width={28}
            height={28}
            className="logo-mark"
          />
          <span>kekkeys</span>
        </Link>
        <nav className="nav">
          <Link href={`/${locale}/`} className="nav-link">
            {content.nav.home}
          </Link>
          <Link href={`/${locale}/download/`} className="nav-link">
            {content.nav.download}
          </Link>
          <Link href={`/${locale}/privacy/`} className="nav-link">
            {content.nav.privacy}
          </Link>
          <span className="lang-switch">
            <Link href={`/en/`} className={locale === "en" ? "active" : ""}>
              EN
            </Link>
            <Link href={`/ru/`} className={locale === "ru" ? "active" : ""}>
              RU
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
