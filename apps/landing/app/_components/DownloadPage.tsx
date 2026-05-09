import { Footer } from "./Footer";
import { Header } from "./Header";
import type { LandingContent, Locale } from "../_lib/content";

const WINDOWS_URL = "https://github.com/SuselMan/hotkeys/releases/latest/download/kekkeys-setup.exe";
const ANDROID_URL = "https://github.com/SuselMan/hotkeys/releases/latest/download/kekkeys.apk";

interface Props {
  locale: Locale;
  content: LandingContent;
}

export function DownloadPage({ locale, content }: Props) {
  const c = content.download;
  return (
    <>
      <Header locale={locale} content={content} />
      <main className="container doc">
        <h1>{c.title}</h1>
        <p>{c.intro}</p>

        <h2>{c.windowsTitle}</h2>
        <ol>
          {c.windows.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>
          <a href={WINDOWS_URL} className="btn btn-primary">{content.hero.ctaWindows}</a>
        </p>
        <div className="callout">{c.windowsCallout}</div>

        <h2>{c.androidTitle}</h2>
        <ol>
          {c.android.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>
          <a href={ANDROID_URL} className="btn btn-secondary">{content.hero.ctaApk}</a>
        </p>
        <div className="callout">{c.androidCallout}</div>
      </main>
      <Footer locale={locale} content={content} />
    </>
  );
}
