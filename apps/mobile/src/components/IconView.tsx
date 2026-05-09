import { useEffect, useMemo, useState } from "react";
import { Image, View, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { colorize, getSvg, getSvgSync } from "../icons";
import { extOf, readUserSvg, readUserSvgSync, userIconUri } from "../user-icons";

interface Props {
  /** Material Symbols icon name. Ignored if `customIcon` is set. */
  name?: string;
  /** Basename of a user-uploaded icon (e.g. `"abc.svg"`). Wins over `name`. */
  customIcon?: string;
  size: number;
  color?: string;
  style?: ViewStyle;
}

export function IconView({ name, customIcon, size, color = "#e8e8e8", style }: Props) {
  if (customIcon) {
    const ext = extOf(customIcon);
    if (ext === "png") {
      return <CustomPng basename={customIcon} size={size} style={style} />;
    }
    if (ext === "svg") {
      return <CustomSvg basename={customIcon} size={size} color={color} style={style} />;
    }
    // Unknown extension — fall through to placeholder.
    return <View style={[{ width: size, height: size }, style]} />;
  }
  if (name) {
    return <MaterialIcon name={name} size={size} color={color} style={style} />;
  }
  return <View style={[{ width: size, height: size }, style]} />;
}

function MaterialIcon({
  name,
  size,
  color,
  style,
}: { name: string; size: number; color: string; style?: ViewStyle }) {
  // Initialize synchronously from the in-memory cache so bundled (top-200)
  // icons paint on the very first render — no `null → svg` flicker.
  const [rawSvg, setRawSvg] = useState<string | null>(() => getSvgSync(name));

  useEffect(() => {
    const sync = getSvgSync(name);
    if (sync !== null) {
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
  }, [name]);

  const xml = useMemo(() => (rawSvg ? colorize(rawSvg, color) : null), [rawSvg, color]);

  if (!xml) {
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return (
    <View style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}

function CustomPng({
  basename,
  size,
  style,
}: { basename: string; size: number; style?: ViewStyle }) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={{ uri: userIconUri(basename) }}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

function CustomSvg({
  basename,
  size,
  color,
  style,
}: { basename: string; size: number; color: string; style?: ViewStyle }) {
  const [rawSvg, setRawSvg] = useState<string | null>(() => readUserSvgSync(basename));
  useEffect(() => {
    const sync = readUserSvgSync(basename);
    if (sync !== null) {
      setRawSvg(sync);
      return;
    }
    let cancelled = false;
    setRawSvg(null);
    void readUserSvg(basename).then((svg) => {
      if (!cancelled) setRawSvg(svg);
    });
    return () => {
      cancelled = true;
    };
  }, [basename]);

  // User SVGs may already carry fills; the colorize regex only injects on
  // <path> elements without a fill, so multi-color SVGs survive intact.
  const xml = useMemo(() => (rawSvg ? colorize(rawSvg, color) : null), [rawSvg, color]);

  if (!xml) {
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return (
    <View style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}
