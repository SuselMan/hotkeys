// Per-page metadata.alternates.languages now uses altLanguages() from
// _lib/content.ts on every route, so this layout is just a passthrough.
export default function RuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
