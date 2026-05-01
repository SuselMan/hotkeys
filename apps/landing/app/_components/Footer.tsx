import Link from "next/link";
import type { LandingContent, Locale } from "../_lib/content";

interface Props {
  locale: Locale;
  content: LandingContent;
}

export function Footer({ locale, content }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          {content.footer.copy} · {year}
        </span>
        <span className="footer-links">
          <Link href={`/${locale}/download/`}>{content.footer.download}</Link>
          <Link href={`/${locale}/privacy/`}>{content.footer.privacy}</Link>
        </span>
      </div>
    </footer>
  );
}
