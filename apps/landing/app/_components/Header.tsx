import Link from "next/link";
import { locales, type LandingContent, type Locale } from "../_lib/content";

interface Props {
  locale: Locale;
  content: LandingContent;
}

const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  es: "ES",
  de: "DE",
  ja: "JA",
};

export function Header({ locale, content }: Props) {
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
            {locales.map((l) => (
              <Link key={l} href={`/${l}/`} className={locale === l ? "active" : ""}>
                {LOCALE_LABEL[l]}
              </Link>
            ))}
          </span>
        </nav>
      </div>
    </header>
  );
}
