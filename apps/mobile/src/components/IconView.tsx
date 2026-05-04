import { useEffect, useMemo, useState } from "react";
import { View, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { colorize, getSvg, getSvgSync } from "../icons";

interface Props {
  name: string;
  size: number;
  color?: string;
  style?: ViewStyle;
}

export function IconView({ name, size, color = "#e8e8e8", style }: Props) {
  // Initialize synchronously from the in-memory cache so bundled (top-200)
  // icons paint on the very first render — no `null → svg` flicker.
  const [rawSvg, setRawSvg] = useState<string | null>(() => getSvgSync(name));

  useEffect(() => {
    const sync = getSvgSync(name);
    if (sync !== null) {
      // Cache hit (e.g. an icon resolved earlier in this session) — keep showing
      // it; no need to flicker through null while we re-resolve.
      setRawSvg(sync);
      return;
    }
    let cancelled = false;
    setRawSvg(null);
    void getSvg(name).then((svg) => {
      if (cancelled) return;
      setRawSvg(svg);
    });
    return () => {
      cancelled = true;
    };
    // Only re-resolve when the name changes — color changes are handled
    // synchronously by the colorize memo below, no refetch needed.
  }, [name]);

  const xml = useMemo(() => (rawSvg ? colorize(rawSvg, color) : null), [rawSvg, color]);

  if (!xml) {
    // Skeleton placeholder so the layout doesn't jump while we resolve.
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return (
    <View style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}
