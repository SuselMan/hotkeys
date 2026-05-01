import { Footer } from "./Footer";
import { Header } from "./Header";
import type { LandingContent, Locale } from "../_lib/content";

interface Props {
  locale: Locale;
  content: LandingContent;
}

export function PrivacyPage({ locale, content }: Props) {
  return (
    <>
      <Header locale={locale} content={content} />
      <main className="container doc">
        <h1>{content.privacy.title}</h1>
        {content.privacy.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </main>
      <Footer locale={locale} content={content} />
    </>
  );
}
