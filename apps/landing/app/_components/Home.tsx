import Link from "next/link";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { JsonLd } from "./JsonLd";
import type { LandingContent, Locale } from "../_lib/content";

interface Props {
  locale: Locale;
  content: LandingContent;
}

export function Home({ locale, content }: Props) {
  return (
    <>
      <JsonLd locale={locale} description={content.hero.lead} />
      <Header locale={locale} content={content} />
      <main>
        <section className="hero">
          <div className="container">
            <h1>{content.hero.headline}</h1>
            <p className="lead">{content.hero.lead}</p>
            <div className="cta-row">
              <Link href={`/${locale}/download/`} className="btn btn-primary">
                <span>
                  {content.hero.ctaWindows}
                  <small>{content.hero.ctaWindowsSub}</small>
                </span>
              </Link>
              <Link href={`/${locale}/download/`} className="btn btn-secondary">
                <span>
                  {content.hero.ctaApk}
                  <small>{content.hero.ctaApkSub}</small>
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <p className="section-eyebrow">{content.features.eyebrow}</p>
            <h2>{content.features.title}</h2>
            <div className="feature-grid">
              {content.features.items.map((f) => (
                <div className="feature" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="steps">
          <div className="container">
            <p className="section-eyebrow">{content.steps.eyebrow}</p>
            <h2>{content.steps.title}</h2>
            <ol>
              {content.steps.items.map((s) => (
                <li key={s.body}>
                  {s.body}
                  <small>{s.sub}</small>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer locale={locale} content={content} />
    </>
  );
}
